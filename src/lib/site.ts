import type { Metadata } from "next";

// One place for the public origin. Moving to a custom domain = set NEXT_PUBLIC_SITE_URL and redeploy
// (it's inlined at build time). Canonicals, the sitemap, robots.txt and JSON-LD all follow it.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://tailor-production-6d17.up.railway.app").replace(/\/+$/, "");
export const SITE_NAME = "Tailor";
export const AUTHOR = { name: "Panshul Bharadwaj", url: "https://panshulbh16.github.io/", github: "https://github.com/panshulbh16" } as const;
export const AUTHOR_ID = `${AUTHOR.url}#person`;

export const HOME_TITLE = "Tailor — tailor your résumé to a job description with AI";
export const HOME_DESCRIPTION =
  "Upload your résumé, paste a job description, and get an honest 0–100 fit score, the gaps, and a résumé rewritten for that role — without invented experience.";

/**
 * Pages listed in sitemap.xml, with when their content last changed (ISO dates) — this is <lastmod>.
 * Bump a page's date when you change what it says. /login is indexable but left out as a low-value landing page.
 */
export const PAGES = [
  { path: "/", updated: "2026-10-12" },
  { path: "/pricing", updated: "2026-10-12" },
  { path: "/signup", updated: "2026-10-12" },
  { path: "/terms", updated: "2026-09-19" },
  { path: "/privacy", updated: "2026-09-20" },
  { path: "/refunds", updated: "2026-09-19" },
  { path: "/contact", updated: "2026-09-19" },
] as const;

/** Accepts the bare token or the whole <meta name="google-site-verification" content="…"> tag Search Console shows. */
export function googleVerification(raw = process.env.GOOGLE_SITE_VERIFICATION) {
  const v = raw?.trim();
  if (!v) return undefined;
  return v.match(/content=["']([^"']+)["']/)?.[1] ?? v;
}

/** Per-page title, unique description, canonical and social tags. `path` is the page's own canonical path. */
export function pageMetadata({ title, description, path, absoluteTitle = false }: { title: string; description: string; path: string; absoluteTitle?: boolean }): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} · ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "en_IN", url: path, title: fullTitle, description },
    twitter: { card: "summary", title: fullTitle, description },
  };
}
