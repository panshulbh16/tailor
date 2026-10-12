import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AUTHOR, googleVerification, HOME_DESCRIPTION, HOME_TITLE, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

// No canonical here on purpose: a root canonical would be inherited by every page that forgets its own.
// Each page sets its canonical via pageMetadata() in src/lib/site.ts.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: HOME_TITLE, template: `%s · ${SITE_NAME}` },
  description: HOME_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
  creator: AUTHOR.name,
  publisher: AUTHOR.name,
  robots: { index: true, follow: true },
  // Search Console "HTML tag" method: set GOOGLE_SITE_VERIFICATION on the host, no code change needed.
  verification: { google: googleVerification() },
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_IN" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
