import Link from "next/link";
import { getUser } from "@/lib/auth";
import { tailorsLeft } from "@/lib/quota";
import { faqs } from "@/lib/faq";
import { FREE_TAILORS, PLANS, paymentsConfigured } from "@/lib/plans";
import { AUTHOR, AUTHOR_ID, HOME_DESCRIPTION, HOME_TITLE, pageMetadata, SITE_NAME, SITE_URL } from "@/lib/site";
import { TailorTool } from "@/components/TailorTool";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";

export const metadata = pageMetadata({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/", absoluteTitle: true });

const FEATURES = [
  ["Honest fit score", "A realistic 0–100 match of your résumé to the role — not flattery."],
  ["Gaps, before they do", "See exactly what the job wants that your résumé doesn't show yet."],
  ["Keyword-honest rewrite", "Reordered and rephrased for the role, never inventing experience you don't have."],
] as const;

function structuredData(faq: { q: string; a: string }[]) {
  const offers = [
    { "@type": "Offer", name: `${PLANS.free.name} — ${FREE_TAILORS} tailors`, price: "0", priceCurrency: "INR" },
    ...(paymentsConfigured ? [{ "@type": "Offer", name: "Pro — 30-day pass", price: String(PLANS.pro.prices.INR), priceCurrency: "INR" }] : []),
  ];
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Person", "@id": AUTHOR_ID, name: AUTHOR.name, url: AUTHOR.url, sameAs: [AUTHOR.github] },
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: `${SITE_URL}/`, inLanguage: "en", author: { "@id": AUTHOR_ID }, publisher: { "@id": AUTHOR_ID } },
      {
        "@type": "WebApplication",
        "@id": `${SITE_URL}/#app`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        description: HOME_DESCRIPTION,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript and a modern web browser.",
        inLanguage: "en",
        isAccessibleForFree: true,
        featureList: FEATURES.map(([t]) => t),
        offers,
        author: { "@id": AUTHOR_ID },
        creator: { "@id": AUTHOR_ID },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      },
    ],
  };
}

export default async function Home() {
  const user = await getUser();
  const left = user ? tailorsLeft(user.id, user.subscription_plan) : 0;
  const faq = faqs();

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={structuredData(faq)} />
      <header className="sticky top-0 z-20 border-b border-zinc-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="font-semibold tracking-tight text-zinc-900">Tailor</Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/pricing" className="btn-ghost">Pricing</Link>
            {user ? (
              <form action={async () => { "use server"; const { logout } = await import("./actions"); await logout(); }}>
                <button className="btn-ghost">Log out</button>
              </form>
            ) : (
              <>
                <Link href="/login" className="btn-ghost">Log in</Link>
                <Link href="/signup" className="btn-primary ml-2">Sign up free</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-6 pt-14 pb-6 text-center">
          <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.18em] text-zinc-500">AI résumé tailoring</p>
          <h1 className="mx-auto max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-zinc-900 sm:text-5xl">
            Your résumé, matched to the job.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-zinc-600">
            Paste your résumé and a job description. Tailor scores your fit, shows what&apos;s missing, and rewrites your résumé for that exact role — using only what&apos;s truly on it.
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-16" aria-label="Tailor your résumé">
          <TailorTool signedIn={!!user} left={left} />
        </section>

        <section className="border-t border-zinc-100 bg-zinc-50/60" aria-label="Features">
          <div className="mx-auto grid max-w-5xl gap-8 px-6 py-14 sm:grid-cols-3">
            {FEATURES.map(([t, d]) => (
              <div key={t}>
                <h2 className="font-semibold text-zinc-900">{t}</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16" aria-labelledby="faq">
          <h2 id="faq" className="text-2xl font-semibold tracking-tight text-zinc-900">Frequently asked questions</h2>
          <div className="mt-8 divide-y divide-zinc-100">
            {faq.map(({ q, a }) => (
              <div key={q} className="py-5">
                <h3 className="font-semibold text-zinc-900">{q}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">{a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
