import Link from "next/link";

import { AnalyticsSettingsLink } from "@/components/analytics/analytics-consent";
import { ContactTrackedLink } from "@/components/analytics/contact-tracked-link";
import { Logo } from "@/components/brand/logo";
import { SocialIcon } from "@/components/brand/social-icon";
import type { SiteContent } from "@/lib/content/schema";
import {
  detectSocialNetwork,
  socialAccessibleName,
  visibleSocials,
} from "@/lib/content/social";

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
  const socials = visibleSocials(content.chrome.socials);

  return (
    <footer className="isolate bg-ink text-white" data-header-tone="dark">
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
          <AnalyticsSettingsLink />
        </nav>
        <div className="flex flex-col gap-4 text-[15px] md:col-span-4">
          {content.site.email ? (
            <ContactTrackedLink
              href={`mailto:${content.site.email}`}
              location="footer"
              className="font-semibold text-white/90 hover:text-white"
            >
              {content.site.email}
            </ContactTrackedLink>
          ) : null}
          {socials.length > 0 ? (
            <ul
              aria-label="Social links"
              className="flex flex-wrap gap-2"
            >
              {socials.map((item) => {
                const name = socialAccessibleName(item.label, item.href);
                const network = detectSocialNetwork(item.href);
                return (
                  <li key={`${item.href}-${name}`}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/18 bg-white/8 px-3.5 text-sm font-semibold text-white/90 transition-colors hover:border-white/40 hover:bg-white/12 hover:text-white"
                    >
                      <SocialIcon network={network} />
                      <span>{name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
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
