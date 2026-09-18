import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import type { SiteContent } from "@/lib/content/schema";

export function Footer({ content }: { content: SiteContent }) {
  const year = new Date().getFullYear();
  const legalBits = [
    content.site.legalName,
    content.site.companyNumber
      ? `Company number ${content.site.companyNumber}`
      : null,
    content.site.registeredOffice
      ? `Registered office: ${content.site.registeredOffice}`
      : null,
  ].filter(Boolean);

  return (
    <footer className="bg-ink text-white">
      <div className="container-site grid gap-10 py-14 md:grid-cols-12 md:gap-8 md:py-16">
        <div className="md:col-span-5">
          <Logo variant="dark" href="/" />
          {content.chrome.footerBlurb ? (
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/70">
              {content.chrome.footerBlurb}
            </p>
          ) : null}
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-col gap-3 text-[15px] font-semibold md:col-span-3"
        >
          {content.chrome.navigation.map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className="text-white/80 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          {content.chrome.privacyLabel ? (
            <Link
              href={content.chrome.privacyHref || "/privacy"}
              className="text-white/80 transition-colors hover:text-white"
            >
              {content.chrome.privacyLabel}
            </Link>
          ) : null}
        </nav>
        <div className="flex flex-col gap-3 text-[15px] md:col-span-4">
          {content.site.email ? (
            <a
              href={`mailto:${content.site.email}`}
              className="font-semibold text-white/90 hover:text-white"
            >
              {content.site.email}
            </a>
          ) : null}
          {content.site.linkedin ? (
            <a
              href={content.site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white"
            >
              {content.chrome.linkedinLabel}
            </a>
          ) : null}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-6 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            {content.chrome.copyrightPrefix} {year} {content.site.legalName}
          </p>
          <p>{legalBits.join(" · ")}</p>
        </div>
      </div>
    </footer>
  );
}
