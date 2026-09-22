import Link from "next/link";
import { getUser } from "@/lib/auth";
import { tailorsLeft } from "@/lib/quota";
import { TailorTool } from "@/components/TailorTool";
import { LEGAL_LINKS } from "@/components/LegalPage";

export default async function Home() {
  const user = await getUser();
  const left = user ? tailorsLeft(user.id, user.subscription_plan) : 0;

  return (
    <div className="min-h-screen bg-white">
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

      <section className="mx-auto max-w-5xl px-6 pt-14 pb-6 text-center">
        <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.18em] text-zinc-500">AI résumé tailoring</p>
        <h1 className="mx-auto max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-zinc-900 sm:text-5xl">
          Your résumé, matched to the job.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-zinc-600">
          Paste your résumé and a job description. Tailor scores your fit, shows what&apos;s missing, and rewrites your résumé for that exact role — using only what&apos;s truly on it.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <TailorTool signedIn={!!user} left={left} />
      </section>

      <section className="border-t border-zinc-100 bg-zinc-50/60">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 py-14 sm:grid-cols-3">
          {[
            ["Honest fit score", "A realistic 0–100 match of your résumé to the role — not flattery."],
            ["Gaps, before they do", "See exactly what the job wants that your résumé doesn't show yet."],
            ["Keyword-honest rewrite", "Reordered and rephrased for the role, never inventing experience you don't have."],
          ].map(([t, d]) => (
            <div key={t}>
              <h3 className="font-semibold text-zinc-900">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-zinc-100">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-zinc-500">
          <span className="font-semibold text-zinc-900">Tailor</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/pricing" className="hover:text-zinc-900">Pricing</Link>
            {LEGAL_LINKS.map(([href, label]) => <Link key={href} href={href} className="hover:text-zinc-900">{label}</Link>)}
          </div>
        </div>
      </footer>
    </div>
  );
}
