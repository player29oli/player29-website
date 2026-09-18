"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import {
  trackContactClick,
  type ContactLocation,
} from "@/lib/analytics/gtag";

export function ContactTrackedLink({
  href,
  location,
  className,
  children,
}: {
  href: string;
  location: ContactLocation;
  className?: string;
  children: ReactNode;
}) {
  function onClick() {
    trackContactClick(location);
  }

  if (href.startsWith("mailto:") || href.startsWith("http://") || href.startsWith("https://")) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
