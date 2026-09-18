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
  stacked?: boolean;
};

function Mark({
  variant,
  compact,
  className,
  priority,
  hidden,
  labelled,
}: {
  variant: "light" | "dark";
  compact: boolean;
  className?: string;
  priority?: boolean;
  hidden?: boolean;
  labelled?: boolean;
}) {
  const asset = compact ? marks[variant] : wordmarks[variant];
  return (
    <Image
      src={asset.src}
      alt={labelled ? "" : asset.alt}
      width={asset.width}
      height={asset.height}
      priority={priority}
      aria-hidden={hidden || labelled}
      className={cn(
        "col-start-1 row-start-1",
        compact ? "h-8 w-auto md:h-9" : "h-7 w-auto md:h-8",
        hidden && "pointer-events-none opacity-0",
        "transition-opacity duration-200 motion-reduce:transition-none",
        className,
      )}
    />
  );
}

export function Logo({
  variant = "light",
  compact = false,
  className,
  priority = false,
  href = "/",
  stacked = false,
}: LogoProps) {
  const labelled = Boolean(href);
  const image = stacked ? (
    <span className="inline-grid items-center justify-items-start">
      <Mark
        variant="light"
        compact={compact}
        className={className}
        priority={priority}
        hidden={variant === "dark"}
        labelled={labelled}
      />
      <Mark
        variant="dark"
        compact={compact}
        className={className}
        priority={priority && variant === "dark"}
        hidden={variant === "light"}
        labelled={labelled}
      />
    </span>
  ) : (
    <Mark
      variant={variant}
      compact={compact}
      className={className}
      priority={priority}
      labelled={labelled}
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
