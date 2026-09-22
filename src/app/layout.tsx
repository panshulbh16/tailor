import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Tailor — résumé, matched to the job", template: "%s · Tailor" },
  description: "Paste your résumé and a job description. Tailor scores your fit, shows the gaps, and rewrites your résumé for that exact role — keyword-honest.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
