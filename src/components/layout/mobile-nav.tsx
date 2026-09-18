"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import type { LinkField } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

export function MobileNav({
  navigation,
  cta,
}: {
  navigation: LinkField[];
  cta: LinkField;
}) {
  const titleId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const panel =
    open && typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-[80] lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-ink/40"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              id="mobile-navigation"
              className="absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col bg-white shadow-[0_24px_80px_rgba(17,19,24,0.28)]"
            >
              <div className="flex items-center justify-between border-b border-ink/8 p-4">
                <h2 id={titleId} className="sr-only">
                  Site menu
                </h2>
                <Logo variant="light" compact href="/" />
                <button
                  type="button"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                    "size-11 min-h-11 min-w-11 rounded-[13px] border-ink/15",
                  )}
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>
              <nav aria-label="Mobile" className="flex flex-col gap-1 p-3">
                {navigation.map((item) => (
                  <Link
                    key={`${item.href}-${item.label}`}
                    href={item.href}
                    className="flex min-h-11 items-center rounded-[14px] px-3 text-base font-semibold text-ink"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {cta.label ? (
                  <Link
                    href={cta.href || "/#contact"}
                    className={cn(
                      buttonVariants({ size: "cta" }),
                      "mt-3 justify-center",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {cta.label}
                  </Link>
                ) : null}
              </nav>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "size-11 min-h-11 min-w-11 rounded-[13px] border-ink/15",
        )}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" aria-hidden />
      </button>
      {panel}
    </div>
  );
}
