import { FREE_TAILORS, paymentsConfigured } from "./plans";
import { RESUME_MAX_BYTES } from "./ai/resume";

// Shown on the home page AND emitted as FAQPage JSON-LD from the same array, so the two always match.
// Every answer must stay true of the code: src/app/api/tailor/route.ts, src/lib/tailor.ts, src/lib/quota.ts,
// src/components/TailorTool.tsx. Change the answer in the same commit as the behaviour.
export function faqs(): { q: string; a: string }[] {
  const mb = RESUME_MAX_BYTES / (1024 * 1024);
  return [
    {
      q: "How does Tailor match my résumé to a job description?",
      a: `Upload your résumé as a PDF (up to ${mb} MB) or paste it as text, then paste the job description. Tailor sends both to Claude, Anthropic's AI model, which returns a 0–100 fit score with a one-line verdict, what your résumé already shows that the job wants, what's missing or underplayed, and your résumé rewritten for that role.`,
    },
    {
      q: "Will Tailor invent experience I don't have?",
      a: "It's instructed not to. The rewrite may only reorder and rephrase what's already on your résumé, using the job's own terms where they truthfully apply. It must never add employers, titles, dates, degrees, tools or skills; anything you genuinely lack goes in the gaps list instead. Read the result before you send it.",
    },
    {
      q: "Is my résumé stored?",
      a: "Your original résumé — the PDF or pasted text — isn't saved; it's sent to Anthropic's Claude API to produce your result. The result is saved to your account: the fit score, verdict, matched and missing items, the list of changes, the tailored résumé (built from yours, so it contains your details) and the first line of the job description.",
    },
    {
      q: "Is Tailor free?",
      a: `You need a free account, which includes ${FREE_TAILORS} tailors in total. ` +
        (paymentsConfigured
          ? "After that, Pro gives unlimited tailors: a 30-day pass paid once through Razorpay that never renews on its own."
          : "Pro, for unlimited tailors, is coming soon; nobody is charged today."),
    },
    {
      q: "Can I edit and download the tailored résumé?",
      a: "Yes. When it finishes, the tailored résumé is editable right on the page. Copy it, or download it as a PDF through your browser's print dialog.",
    },
  ];
}
