import type { MetadataRoute } from "next";
import { PAGES, SITE_URL } from "@/lib/site";

// /forgot-password and /reset-password are left out on purpose: they're noindex utility pages. See PAGES.
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(({ path, updated }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: updated,
    changeFrequency: path === "/" || path === "/pricing" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/pricing" || path === "/signup" ? 0.8 : 0.4,
  }));
}
