"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, now } from "@/lib/db";
import { createSession, destroySession, getUser, isAdminEmail, requireUser } from "@/lib/auth";
import { hashPassword, token, verifyPassword } from "@/lib/password";
import { rateLimit } from "@/lib/ratelimit";
import { track } from "@/lib/analytics";
import { email } from "@/lib/email";
import { billingCurrency, paymentsConfigured } from "@/lib/plans";
import { createOrder, markOrderPaid, paymentSignatureValid } from "@/lib/razorpay";
import { extractProfileFromResume, looksLikePdf, RESUME_MAX_BYTES, resumeImportConfigured } from "@/lib/ai/resume";
export type ActionState = { error?: string; ok?: string } | undefined;
type Checkout = { orderId: string; amount: number; currency: string; keyId: string; name: string; email: string };

const str = (fd: FormData, k: string, max = 200) => String(fd.get(k) ?? "").trim().slice(0, max);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const fail = (m: string) => { throw new Error(m) };
const guard = async <T,>(fn: () => Promise<T>): Promise<T | { error: string }> => {
  try { return await fn(); } catch (e) {
    if ((e as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) throw e;
    return { error: e instanceof Error ? e.message : "Something went wrong" };
  }
};

// ---------- Auth ----------

export async function signup(_: ActionState, fd: FormData): Promise<ActionState> {
  return guard(async () => {
    await rateLimit("signup", 10, 300);
    const name = str(fd, "name", 80), em = str(fd, "email").toLowerCase(), pw = str(fd, "password", 200);
    if (name.length < 2) fail("Please enter your name.");
    if (!EMAIL_RE.test(em)) fail("Please enter a valid email.");
    if (pw.length < 8) fail("Password must be at least 8 characters.");
    if (db.prepare("SELECT 1 FROM users WHERE email = ?").get(em)) fail("An account with this email already exists.");
    const id = db.prepare("INSERT INTO users (name, email, password_hash, is_admin) VALUES (?, ?, ?, ?)").run(name, em, hashPassword(pw), isAdminEmail(em) ? 1 : 0).lastInsertRowid;
    track("signup", Number(id), { method: "password" });
    await createSession(Number(id));
    redirect("/");
  });
}

export async function login(_: ActionState, fd: FormData): Promise<ActionState> {
  return guard(async () => {
    await rateLimit("login", 10, 300);
    const em = str(fd, "email").toLowerCase(), pw = str(fd, "password", 200);
    const u = db.prepare("SELECT id, password_hash FROM users WHERE email = ?").get(em) as { id: number; password_hash: string | null } | undefined;
    if (!u || !verifyPassword(pw, u.password_hash)) fail("Incorrect email or password.");
    track("login", u!.id, {});
    await createSession(u!.id);
    redirect("/");
  });
}

export async function logout() {
  await destroySession();
  redirect("/");
}

export async function requestPasswordReset(_: ActionState, fd: FormData): Promise<ActionState> {
  return guard(async () => {
    await rateLimit("reset", 5, 300);
    const em = str(fd, "email").toLowerCase();
    const u = db.prepare("SELECT id, name FROM users WHERE email = ?").get(em) as { id: number; name: string } | undefined;
    if (u) {
      const t = token();
      db.prepare("INSERT INTO password_resets (token, user_id, expires_at) VALUES (?, ?, ?)").run(t, u.id, new Date(Date.now() + 36e5).toISOString());
      const url = `${process.env.APP_URL ?? "http://localhost:3000"}/reset-password?token=${t}`;
      // A delivery failure must look identical to success, so it never reveals who has an account.
      await email
        .send({ to: em, subject: "Reset your Tailor password", text: `Hi ${u.name},\n\nReset your password here (valid for 1 hour):\n${url}\n\nIf you didn't request this, ignore this email.` })
        .catch((e) => console.error("[reset] email delivery failed", String(e).slice(0, 200)));
    }
    return { ok: email.name === "console" ? "If that email exists, a reset link was generated. Email delivery isn't configured, so check the server console for the link." : "If that email exists, we've sent a reset link." };
  });
}

export async function resetPassword(_: ActionState, fd: FormData): Promise<ActionState> {
  return guard(async () => {
    const t = str(fd, "token", 100), pw = str(fd, "password", 200);
    if (pw.length < 8) fail("Password must be at least 8 characters.");
    const r = db.prepare("SELECT user_id FROM password_resets WHERE token = ? AND expires_at > ?").get(t, new Date().toISOString()) as { user_id: number } | undefined;
    if (!r) fail("This reset link is invalid or has expired.");
    db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hashPassword(pw), r!.user_id);
    db.prepare("DELETE FROM password_resets WHERE user_id = ?").run(r!.user_id);
    db.prepare("DELETE FROM sessions WHERE user_id = ?").run(r!.user_id);
    await createSession(r!.user_id);
    redirect("/");
  });
}

// ---------- Résumé import ----------

/** Reads an uploaded résumé PDF into plain text fields the user can paste. Nothing is stored. */
export async function importResume(fd: FormData): Promise<{ text?: string; error?: string }> {
  return guard(async () => {
    const user = await getUser();
    if (!user) redirect("/login");
    if (!resumeImportConfigured) fail("PDF import isn't available yet. Paste your résumé text instead.");
    await rateLimit("resume", 5, 600);
    const file = fd.get("resume");
    if (!(file instanceof File) || file.size === 0) fail("Choose your résumé as a PDF file.");
    const f = file as File;
    if (f.size > RESUME_MAX_BYTES) fail("That PDF is over 5 MB. Export a smaller copy and try again.");
    const bytes = Buffer.from(await f.arrayBuffer());
    if (!looksLikePdf(bytes)) fail("That file isn't a PDF. Save your résumé as a PDF and try again.");
    const p = await extractProfileFromResume(bytes);
    // Flatten the parsed profile into editable résumé text for the paste box.
    const text = [
      p.current_role, p.education, p.locations.join(", "),
      p.roles.length ? `Target roles: ${p.roles.join(", ")}` : "",
      p.skills.length ? `Skills: ${p.skills.join(", ")}` : "",
    ].filter(Boolean).join("\n");
    track("resume_imported", user!.id, { skills: p.skills.length });
    return { text };
  });
}

// ---------- Billing ----------

export async function startUpgrade(): Promise<Checkout | { error: string }> {
  return guard(async () => {
    const user = await requireUser();
    track("upgrade_clicked", user.id, { plan: "pro", paymentsConfigured });
    if (!paymentsConfigured) fail("Pro isn't on sale yet.");
    await rateLimit("upgrade", 10, 300);
    const currency = billingCurrency(await headers());
    const { orderId, amount } = await createOrder(user.id, currency);
    return { orderId, amount, currency, keyId: process.env.RAZORPAY_KEY_ID!, name: user.name, email: user.email };
  });
}

export async function confirmUpgrade(orderId: string, paymentId: string, signature: string): Promise<ActionState> {
  return guard(async () => {
    await requireUser();
    if (!paymentSignatureValid(String(orderId), String(paymentId), String(signature)))
      fail("We couldn't verify that payment. If you were charged, email us and we'll sort it out.");
    markOrderPaid(orderId, paymentId);
    revalidatePath("/", "layout");
    return { ok: "You're on Pro." };
  });
}
