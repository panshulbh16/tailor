import type { NextRequest } from "next/server";
import { getUser } from "@/lib/auth";
import { db, now } from "@/lib/db";
import { rateLimit } from "@/lib/ratelimit";
import { track } from "@/lib/analytics";
import { FREE_TAILORS } from "@/lib/quota";
import { looksLikePdf, RESUME_MAX_BYTES } from "@/lib/ai/resume";
import { createTailorStream, parseTailorText, TAILOR_MAX_CHARS, tailorConfigured, type ResumeInput } from "@/lib/tailor";

// Streams the tailored result as plain text. Résumé comes in as an uploaded PDF (multipart) or pasted text (JSON).
export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return new Response("Please sign in.", { status: 401 });
  if (!tailorConfigured) return new Response("Tailoring isn't available yet.", { status: 503 });

  let resume: ResumeInput | null = null;
  let jd = "";
  const ct = req.headers.get("content-type") ?? "";
  if (ct.includes("multipart/form-data")) {
    const form = await req.formData();
    jd = String(form.get("jd") ?? "");
    const file = form.get("resume");
    if (file instanceof File && file.size > 0) {
      if (file.size > RESUME_MAX_BYTES) return new Response("That PDF is over 5 MB. Export a smaller copy.", { status: 413 });
      const buf = Buffer.from(await file.arrayBuffer());
      if (!looksLikePdf(buf)) return new Response("That file isn't a PDF. Upload a PDF or paste text instead.", { status: 400 });
      resume = { pdfBase64: buf.toString("base64") };
    } else {
      resume = { text: String(form.get("resumeText") ?? "").slice(0, TAILOR_MAX_CHARS) };
    }
  } else {
    const b = (await req.json().catch(() => ({}))) as { resume?: string; jd?: string };
    jd = String(b.jd ?? "");
    resume = { text: String(b.resume ?? "").slice(0, TAILOR_MAX_CHARS) };
  }

  jd = jd.slice(0, TAILOR_MAX_CHARS);
  if (jd.trim().length < 80) return new Response("Paste the full job description.", { status: 400 });
  if ("text" in resume && resume.text.trim().length < 80) return new Response("Paste your full résumé, or upload it as a PDF.", { status: 400 });

  if (user.subscription_plan !== "pro") {
    const used = (db.prepare("SELECT COUNT(*) n FROM tailors WHERE user_id = ?").get(user.id) as { n: number }).n;
    if (used >= FREE_TAILORS) return new Response("limit", { status: 402 });
  }
  try { await rateLimit(`tailor:${user.id}`, 20, 3600); } catch { return new Response("Too many requests — try again shortly.", { status: 429 }); }

  const jdTitle = (jd.split("\n").map((l) => l.trim()).find(Boolean) ?? "").slice(0, 120);
  const stream = createTailorStream(resume, jd);
  const encoder = new TextEncoder();
  let full = "";

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const ev of stream) {
          if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") {
            full += ev.delta.text;
            controller.enqueue(encoder.encode(ev.delta.text));
          }
        }
        const result = parseTailorText(full);
        db.prepare("INSERT INTO tailors (user_id, jd_title, fit_score, result, created_at) VALUES (?, ?, ?, ?, ?)")
          .run(user.id, jdTitle, result.fit_score, JSON.stringify(result), now());
        track("tailor_created", user.id, { fit: result.fit_score });
      } catch (e) {
        console.error("[tailor] stream failed", e);
        controller.enqueue(encoder.encode("\n\n[error] Couldn't finish tailoring — please try again."));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}
