import type { ReactNode } from "react";

import { AnalyticsConsent } from "@/components/analytics/analytics-consent";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { siteConfig } from "@/config/site";
import { getSiteContent } from "@/lib/content/store";
import { visibleSocials } from "@/lib/content/social";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const content = await getSiteContent();
  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const organisationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: content.site.name,
    legalName: content.site.legalName,
    url: siteUrl,
    email: content.site.email,
    description: content.site.description,
    logo: `${siteUrl}/brand/player29-icon-dark.png`,
    sameAs: visibleSocials(content.chrome.socials).map((item) => item.href),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organisationJsonLd),
        }}
      />
      <Header
        navigation={content.chrome.navigation}
        cta={content.chrome.headerCta}
      />
      {children}
      <Footer content={content} />
      <AnalyticsConsent />
    </>
  );
}
