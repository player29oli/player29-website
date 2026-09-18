"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { buttonVariants } from "@/components/ui/button";
import { hero, navigation } from "@/data/content";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-white/88 backdrop-blur-[8px] transition-shadow",
        scrolled
          ? "border-ink/10 shadow-[0_1px_0_rgba(17,19,24,0.04)]"
          : "border-transparent",
      )}
    >
      <div className="container-site flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <span className="md:hidden">
          <Logo variant="light" compact priority />
        </span>
        <span className="hidden md:inline-flex">
          <Logo variant="light" priority />
        </span>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] font-semibold text-ink/80 transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href={hero.primaryCta.href}
            className={cn(buttonVariants({ size: "cta" }))}
          >
            {hero.primaryCta.label}
          </Link>
        </div>

        <MobileNav open={open} onOpenChange={setOpen} />
      </div>
    </header>
  );
}
