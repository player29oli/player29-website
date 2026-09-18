import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { siteConfig } from "@/config/site";
import { footer, navigation } from "@/data/content";

export function Footer() {
  const year = new Date().getFullYear();
  const legalBits = [
    siteConfig.legalName,
    siteConfig.companyNumber
      ? `Company number ${siteConfig.companyNumber}`
      : null,
    siteConfig.registeredOffice
      ? `Registered office: ${siteConfig.registeredOffice}`
      : null,
  ].filter(Boolean);

  return (
    <footer className="bg-ink text-white">
      <div className="container-site grid gap-10 py-14 md:grid-cols-12 md:gap-8 md:py-16">
        <div className="md:col-span-5">
          <Logo variant="dark" href="/" />
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/70">
            A digital product company creating engaging experiences across
            sport, media and the screen.
          </p>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-col gap-3 text-[15px] font-semibold md:col-span-3"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white/80 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={footer.privacy.href}
            className="text-white/80 transition-colors hover:text-white"
          >
            {footer.privacy.label}
          </Link>
        </nav>
        <div className="flex flex-col gap-3 text-[15px] md:col-span-4">
          <a
            href={`mailto:${siteConfig.email}`}
            className="font-semibold text-white/90 hover:text-white"
          >
            {siteConfig.email}
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white"
          >
            LinkedIn
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-6 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            {footer.copyrightPrefix} {year} {siteConfig.legalName}
          </p>
          <p>{legalBits.join(" · ")}</p>
        </div>
      </div>
    </footer>
  );
}
