"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { buttonVariants } from "@/components/ui/button";
import type { LinkField } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

export function Header({
  navigation,
  cta,
}: {
  navigation: LinkField[];
  cta: LinkField;
}) {
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
      const height = header.getBoundingClientRect().height;
      const darkSurfaces = document.querySelectorAll("[data-header-tone='dark']");
      let match = false;
      for (const el of darkSurfaces) {
        const rect = el.getBoundingClientRect();
        if (rect.top < height && rect.bottom > 0) {
          match = true;
          break;
        }
      }
      setOverDark(match);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      data-over-dark={overDark ? "true" : "false"}
      className={cn(
        "sticky top-0 z-50 isolate border-b motion-reduce:transition-none",
        "transition-[background-color,border-color,box-shadow] duration-200",
        overDark
          ? "border-white/12 bg-ink text-white"
          : scrolled
            ? "border-ink/10 bg-white text-ink shadow-[0_1px_0_rgba(17,19,24,0.04)]"
            : "border-transparent bg-white text-ink",
      )}
    >
      <div className="container-site flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Logo variant={overDark ? "dark" : "light"} stacked priority />

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={cn(
                "text-[15px] font-semibold transition-colors motion-reduce:transition-none",
                overDark
                  ? "text-white/80 hover:text-white"
                  : "text-ink/80 hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          {cta.label ? (
            <Link
              href={cta.href || "/#contact"}
              className={cn(
                buttonVariants({ size: "cta" }),
                overDark &&
                  "bg-white text-ink hover:bg-white/90 focus-visible:border-white",
              )}
            >
              {cta.label}
            </Link>
          ) : null}
        </div>

        <MobileNav navigation={navigation} cta={cta} inverted={overDark} />
      </div>
    </header>
  );
}
