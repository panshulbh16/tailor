import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3", "nodemailer"],
  outputFileTracingRoot: __dirname,
  // Resume import posts the PDF to a server action (5 MB cap, checked in importResume); the default is 1 MB.
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  // Next streams <title>/<meta>/<link rel=canonical> after <head> to browsers, and only blocks for a list of
  // "HTML-limited" bots. Googlebot isn't on that list (it renders JS), so on dynamic pages like /pricing it got
  // its title and canonical in <body>. Adding it here puts metadata in <head> for Googlebot on every page.
  // The rest is Next 15's default list (next/dist/shared/lib/router/utils/html-bots.js).
  htmlLimitedBots:
    /Googlebot|[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight/i,
  poweredByHeader: false,
  // Baseline hardening for a public site accepting logins. HSTS is left to Railway's TLS proxy.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" }, // no framing → clickjacking on the login/forms
          { key: "Strict-Transport-Security", value: "max-age=31536000" }, // always use HTTPS for this site
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
