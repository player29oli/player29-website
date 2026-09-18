"use client";

import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { hero, navigation } from "@/data/content";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  return (
    <div className="lg:hidden">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-11 min-h-11 min-w-11 rounded-[13px] border-ink/15"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => onOpenChange(true)}
      >
        <Menu className="size-5" aria-hidden />
      </Button>
      {open ? (
        <div className="fixed inset-0 z-[80]">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close menu"
            onClick={() => onOpenChange(false)}
          />
          <div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col bg-canvas shadow-[0_24px_80px_rgba(17,19,24,0.28)]"
          >
            <div className="flex items-center justify-between border-b border-ink/8 p-4">
              <h2 id={titleId} className="sr-only">
                Site menu
              </h2>
              <Logo variant="light" compact href="/" />
              <Button
                ref={closeRef}
                type="button"
                variant="outline"
                size="icon"
                className="size-11 min-h-11 min-w-11 rounded-[13px] border-ink/15"
                aria-label="Close menu"
                onClick={() => onOpenChange(false)}
              >
                <X className="size-5" aria-hidden />
              </Button>
            </div>
            <nav aria-label="Mobile" className="flex flex-col gap-1 p-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex min-h-11 items-center rounded-[14px] px-3 text-base font-semibold text-ink"
                  onClick={() => onOpenChange(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={hero.primaryCta.href}
                className={cn(
                  buttonVariants({ size: "cta" }),
                  "mt-3 justify-center",
                )}
                onClick={() => onOpenChange(false)}
              >
                {hero.primaryCta.label}
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
