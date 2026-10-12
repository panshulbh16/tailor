import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Everything public is crawlable; API routes (auth callbacks, webhooks, the tailor stream) are not pages.
// /_next/ must stay allowed — Google needs the JS and CSS to render pages.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: ["Googlebot", "*"], allow: "/", disallow: "/api/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
