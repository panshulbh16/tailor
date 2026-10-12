import Link from "next/link";
import { AUTHOR } from "@/lib/site";

export const LEGAL_LINKS = [["/terms", "Terms"], ["/privacy", "Privacy"], ["/refunds", "Refunds"], ["/contact", "Contact"]] as const;

/** Shared footer: links every public page from every public page, and names the author. */
export function SiteFooter({ width = "max-w-5xl" }: { width?: string }) {
  return (
    <footer className="border-t border-zinc-100">
      <div className={`mx-auto flex flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-zinc-500 ${width}`}>
        <p>
          <Link href="/" className="font-semibold text-zinc-900">Tailor</Link>
          <span className="ml-3">Built by <a href={AUTHOR.url} rel="author" className="hover:text-zinc-900 hover:underline">{AUTHOR.name}</a></span>
        </p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/pricing" className="hover:text-zinc-900">Pricing</Link>
          <Link href="/signup" className="hover:text-zinc-900">Sign up</Link>
          {LEGAL_LINKS.map(([href, label]) => <Link key={href} href={href} className="hover:text-zinc-900">{label}</Link>)}
        </nav>
      </div>
    </footer>
  );
}
