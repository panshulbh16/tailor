import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "Privacy Policy for Tailor: what is collected (account, tailoring results, payments), why, which processors handle it including Anthropic for the AI, cookies, and how long data is kept.",
  path: "/privacy",
});

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="7 November 2026">
      <p>Tailor is free to use, with an optional paid Pro pass. This page explains, in plain language, what we collect and why.</p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Account details</strong> — your name, email, and password. Passwords are stored only as a salted hash; we can&apos;t read them. If you sign in with Google instead, we get your name, email and Google account ID from Google.</li>
        <li><strong>Your résumé and the job description</strong> — sent to Anthropic each time you tailor, to produce your result. We don&apos;t save the original PDF or pasted text, or the full job description.</li>
        <li><strong>Your tailoring results</strong> — each finished tailor is saved to your account: the fit score, verdict, matched and missing items, the list of changes, the tailored résumé (built from yours, so it contains your details) and the first line of the job description, usually the job title. We count these to apply the free limit.</li>
        <li><strong>Login sessions</strong> — a random token for each device you&apos;re logged in on, valid for 30 days or until you log out. Password-reset links use a one-time token that expires after an hour.</li>
        <li><strong>Payments</strong>, if you buy Pro — the amount, date, Razorpay order and payment IDs, and when your pass ends. Your card, UPI and bank details go straight to Razorpay; we never see or store them.</li>
        <li><strong>Basic usage events</strong> — for example that you signed up, logged in, ran a tailor (with its fit score) or bought Pro, and when you were last active — so we can see what works and fix what doesn&apos;t.</li>
        <li><strong>Your IP address</strong> — used in server memory to rate-limit sign-ups, logins and tailoring. We don&apos;t save it to our database.</li>
      </ul>

      <h2>How we use it</h2>
      <p>Only to run the service: tailoring your résumé, applying the free limit, keeping you logged in, activating Pro when you pay, and emailing you password-reset links. We don&apos;t sell your data, show ads, or use third-party tracking.</p>

      <h2>Who else handles it</h2>
      <ul>
        <li><strong>Railway</strong> hosts the app and its database.</li>
        <li><strong>Anthropic</strong> receives your résumé and the job description each time you tailor, and its Claude model writes the result. Under its commercial terms it doesn&apos;t use this data to train its models.</li>
        <li><strong>Our email provider</strong> — Google&apos;s Gmail or Resend — delivers password-reset emails, so it receives your email address and the message.</li>
        <li><strong>Razorpay</strong> processes Pro payments. It receives your name, email and payment details, under its own <a className="underline" href="https://razorpay.com/privacy/">privacy policy</a>.</li>
        <li><strong>Google</strong>, only if you choose to sign in with Google: it confirms who you are and shares your name and email with us, under its own privacy policy.</li>
      </ul>

      <h2>Cookies</h2>
      <p>One cookie, to keep you logged in. If you sign in with Google, a second cookie protects that sign-in for up to 10 minutes. No advertising or analytics cookies. Razorpay&apos;s checkout window sets its own cookies while you pay.</p>

      <h2>Keeping and deleting your data</h2>
      <p>We keep your data while your account exists. There&apos;s no delete button in the app yet: email us from the address on your account and we&apos;ll delete it, which permanently removes your saved tailoring results, sessions and our payment records. Anthropic and Razorpay keep their own records under their own policies; Razorpay keeps payment records as the law requires.</p>

      <h2>Contact</h2>
      <p>Questions or data requests: see <Link className="underline" href="/contact">Contact</Link>.</p>
    </LegalPage>
  );
}
