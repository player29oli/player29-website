import Link from "next/link";

import { ContactTrackedLink } from "@/components/analytics/contact-tracked-link";
import { ContentImage } from "@/components/content-image";
import { HeroVisual } from "@/components/sections/hero-visual";
import { buttonVariants } from "@/components/ui/button";
import type { HeroSection } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

export function Hero({ section }: { section: HeroSection }) {
  return (
    <section
      id={section.anchor || undefined}
      aria-labelledby="hero-heading"
      className="overflow-hidden pt-10 pb-20 md:pt-16 md:pb-32"
    >
      <div className="container-site grid items-center gap-14 md:grid-cols-12 md:gap-10">
        <div className="motion-entry md:col-span-6 lg:col-span-7">
          {section.kicker ? (
            <p className="mb-6 flex items-center gap-3 text-sm font-semibold text-ink/70">
              <span className="signal-gradient inline-block h-px w-8" aria-hidden />
              {section.kicker}
            </p>
          ) : null}
          <h1
            id="hero-heading"
            className="font-display text-[clamp(2.5rem,5.4vw,4.5rem)] leading-[1.05] font-bold"
          >
            {section.headline}
          </h1>
          {section.supporting ? (
            <p className="text-muted-text mt-6 max-w-[38rem] text-[1.0625rem] leading-[1.65] md:text-[1.125rem]">
              {section.supporting}
            </p>
          ) : null}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            {section.primaryCta.label ? (
              <ContactTrackedLink
                href={section.primaryCta.href || "/#contact"}
                location="hero"
                className={cn(buttonVariants({ size: "cta" }), "justify-center")}
              >
                {section.primaryCta.label}
              </ContactTrackedLink>
            ) : null}
            {section.secondaryCta.label ? (
              <Link
                href={section.secondaryCta.href || "/#capabilities"}
                className={cn(
                  buttonVariants({ variant: "outline", size: "cta" }),
                  "justify-center",
                )}
              >
                {section.secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </div>
        <div className="motion-entry md:col-span-6 lg:col-span-5" style={{ animationDelay: "120ms" }}>
          {section.imageSrc ? (
            <ContentImage
              src={section.imageSrc}
              alt={section.imageAlt}
              width={960}
              height={960}
              className="h-auto w-full rounded-[22px]"
              priority
            />
          ) : (
            <HeroVisual />
          )}
        </div>
      </div>
    </section>
  );
}
