import Link from "next/link";

import { HeroVisual } from "@/components/sections/hero-visual";
import { buttonVariants } from "@/components/ui/button";
import { hero } from "@/data/content";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="overflow-hidden pt-10 pb-20 md:pt-16 md:pb-32"
    >
      <div className="container-site grid items-center gap-14 md:grid-cols-12 md:gap-10">
        <div className="motion-entry md:col-span-6 lg:col-span-7">
          <p className="mb-6 flex items-center gap-3 text-sm font-semibold text-ink/70">
            <span className="signal-gradient inline-block h-px w-8" aria-hidden />
            Player29
          </p>
          <h1
            id="hero-heading"
            className="font-display text-[clamp(2.5rem,5.4vw,4.5rem)] leading-[1.05] font-bold"
          >
            {hero.headline}
          </h1>
          <p className="text-muted-text mt-6 max-w-[38rem] text-[1.0625rem] leading-[1.65] md:text-[1.125rem]">
            {hero.supporting}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={hero.primaryCta.href}
              className={cn(buttonVariants({ size: "cta" }), "justify-center")}
            >
              {hero.primaryCta.label}
            </Link>
            <Link
              href={hero.secondaryCta.href}
              className={cn(
                buttonVariants({ variant: "outline", size: "cta" }),
                "justify-center",
              )}
            >
              {hero.secondaryCta.label}
            </Link>
          </div>
        </div>
        <div className="motion-entry md:col-span-6 lg:col-span-5" style={{ animationDelay: "120ms" }}>
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
