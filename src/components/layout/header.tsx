"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { hero, navigation } from "@/data/content";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/6 bg-white/88 backdrop-blur-[8px]">
      <div className="container-site flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <span className="md:hidden">
          <Logo variant="light" compact priority />
        </span>
        <span className="hidden md:inline-flex">
          <Logo variant="light" priority />
        </span>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 lg:flex"
        >
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

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="size-11 min-h-11 min-w-11 rounded-[13px] border-ink/15 lg:hidden"
                aria-label="Open menu"
              />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(100%,20rem)] bg-canvas p-0">
            <SheetHeader className="border-b border-ink/8 p-5">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <Logo variant="light" compact />
            </SheetHeader>
            <nav aria-label="Mobile" className="flex flex-col gap-1 p-3">
              {navigation.map((item) => (
                <SheetClose
                  key={item.href}
                  render={
                    <Link
                      href={item.href}
                      className="flex min-h-11 items-center rounded-[14px] px-3 text-base font-semibold text-ink"
                    />
                  }
                >
                  {item.label}
                </SheetClose>
              ))}
              <SheetClose
                render={
                  <Link
                    href={hero.primaryCta.href}
                    className={cn(
                      buttonVariants({ size: "cta" }),
                      "mt-3 justify-center",
                    )}
                  />
                }
              >
                {hero.primaryCta.label}
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
