import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

const wordmarks = {
  light: {
    src: "/brand/player29-wordmark-light-badge.png",
    alt: "Player29",
    width: 1662,
    height: 525,
  },
  dark: {
    src: "/brand/player29-wordmark-dark.png",
    alt: "Player29",
    width: 1586,
    height: 497,
  },
} as const;

const marks = {
  light: {
    src: "/brand/player29-icon-light.png",
    alt: "Player29",
    width: 1102,
    height: 1088,
  },
  dark: {
    src: "/brand/player29-icon-dark.png",
    alt: "Player29",
    width: 1062,
    height: 1062,
  },
} as const;

type LogoProps = {
  variant?: "light" | "dark";
  compact?: boolean;
  className?: string;
  priority?: boolean;
  href?: string;
};

export function Logo({
  variant = "light",
  compact = false,
  className,
  priority = false,
  href = "/",
}: LogoProps) {
  const asset = compact ? marks[variant] : wordmarks[variant];
  const image = (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      priority={priority}
      className={cn(
        compact
          ? "h-8 w-auto md:h-9"
          : "h-7 w-auto md:h-8",
        className,
      )}
    />
  );

  if (!href) {
    return image;
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-md"
      aria-label="Player29 home"
    >
      {image}
    </Link>
  );
}
