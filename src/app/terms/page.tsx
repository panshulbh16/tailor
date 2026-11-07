import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { FREE_TAILORS, PLANS } from "@/lib/plans";
import { PASS_DAYS } from "@/lib/razorpay";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: "Terms of Service for Tailor: what the résumé tailoring service does, checking AI output before you send it, your account, the free tier and one-time Pro pass via Razorpay, liability, and governing law (India).",
  path: "/terms",
});

export default function Terms() {
  return (
    <LegalPage title="Terms of Service" updated="7 November 2026">
      <p>These terms cover your use of Tailor, a résumé-tailoring service run by Panshul Bharadwaj, an individual developer based in India. By creating an account you agree to them.</p>

      <h2>The service</h2>
      <ul>
        <li>You give Tailor your résumé (a PDF or pasted text) and a job description. It uses an AI model, Anthropic&apos;s Claude, to return a 0–100 fit score with a one-line verdict, what your résumé already shows that the job wants, what&apos;s missing, and your résumé rewritten for that role.</li>
        <li>It&apos;s provided as-is. Features may change, and there may be downtime.</li>
        <li>We don&apos;t guarantee that you&apos;ll get an interview or a job, or that a fit score reflects how any employer will judge you.</li>
      </ul>

      <h2>AI output</h2>
      <p>Everything Tailor produces is written by an AI model and can be wrong: the score is an estimate, the gap list can miss things or flag things you do have, and the rewrite can misstate or leave out details. Tailor is instructed to work only from what&apos;s on your résumé and never to add employers, titles, dates, degrees, tools or skills, but it can still make mistakes. Read the tailored résumé and correct it before you send it to an employer. You&apos;re responsible for what you submit, including anything Tailor drafted. Tailor isn&apos;t affiliated with any employer or job site.</p>

      <h2>Your account</h2>
      <ul>
        <li>You need an account to tailor a résumé. Keep your login to yourself. One account per person.</li>
        <li>Only submit résumés and job descriptions you have the right to use — normally your own résumé.</li>
        <li>Don&apos;t use the service to scrape, spam, or abuse it or others, to get around the free limit or rate limits, or to submit unlawful content or text meant to manipulate the AI. We may suspend accounts that do; if you had an active Pro pass, we&apos;ll refund the unused days.</li>
        <li>To delete your account, email us from the address on it (see <Link className="underline" href="/contact">Contact</Link>).</li>
      </ul>

      <h2>Free tier, Pro and payments</h2>
      <ul>
        <li>A free account includes {FREE_TAILORS} tailors in total, not per month. Each tailor that finishes counts, including any you run while on Pro.</li>
        <li>Pro gives unlimited tailors for {PASS_DAYS} days. Unlimited means no cap on the number of tailors; we still rate-limit very heavy use so the service stays available for everyone.</li>
        <li>Pro costs ₹{PLANS.pro.prices.INR} for {PASS_DAYS} days in India, or ${PLANS.pro.prices.USD} where we bill in US dollars, paid once through Razorpay. Which one applies depends on where you are paying from.</li>
        <li>It does <strong>not</strong> renew automatically. When the {PASS_DAYS} days end, your account returns to the Free plan; nothing is deleted. Buying again adds another {PASS_DAYS} days, on top of any time you have left.</li>
        <li>If we change the price, passes you&apos;ve already bought aren&apos;t affected.</li>
        <li>Refunds are covered in our <Link className="underline" href="/refunds">Refund policy</Link>.</li>
      </ul>

      <h2>Liability</h2>
      <p>To the extent the law allows, we aren&apos;t liable for indirect losses such as missed opportunities or rejected applications, or for decisions you make based on Tailor&apos;s output, and our total liability to you is limited to what you paid us in the {PASS_DAYS} days before the claim.</p>

      <h2>Changes and governing law</h2>
      <p>We may update these terms; significant changes will be announced in the app before they apply. These terms are governed by the laws of India. Questions: see <Link className="underline" href="/contact">Contact</Link>.</p>
    </LegalPage>
  );
}
