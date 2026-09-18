import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Sora } from "next/font/google";

import { SkipLink } from "@/components/layout/skip-link";
import { siteConfig } from "@/config/site";
import { getSiteContent } from "@/lib/content/store";

import "./globals.css";
import "@/styles/motion.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const siteUrl = siteConfig.url.replace(/\/$/, "");
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: content.site.title,
      template: `%s | ${content.site.name}`,
    },
    description: content.site.description,
    applicationName: content.site.name,
    authors: [{ name: content.site.name }],
    keywords: [
      "digital products",
      "sport",
      "media",
      "connected TV",
      "product design",
      "Player29",
    ],
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: siteUrl,
      siteName: content.site.name,
      title: content.site.title,
      description: content.site.description,
    },
    twitter: {
      card: "summary_large_image",
      title: content.site.title,
      description: content.site.description,
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: "/icon.png",
      apple: "/apple-icon.png",
    },
  };
}

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en-GB"
      className={`${inter.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
