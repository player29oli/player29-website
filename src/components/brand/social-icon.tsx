import type { ReactElement, SVGProps } from "react";

import type { SocialNetwork } from "@/lib/content/social";

const svgProps: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
  className: "size-4",
};

function LinkedInIcon() {
  return (
    <svg {...svgProps}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg {...svgProps}>
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg {...svgProps}>
      <path d="M4 4l11.5 16M20 4L8.5 20" />
      <path d="M4 20l7-7M13 11l7-7" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg {...svgProps}>
      <path d="M22.5 12s0-3.5-.45-5.1a2.8 2.8 0 0 0-2-2C18.4 4.5 12 4.5 12 4.5s-6.4 0-8.05.4a2.8 2.8 0 0 0-2 2C1.5 8.5 1.5 12 1.5 12s0 3.5.45 5.1a2.8 2.8 0 0 0 2 2c1.65.4 8.05.4 8.05.4s6.4 0 8.05-.4a2.8 2.8 0 0 0 2-2c.45-1.6.45-5.1.45-5.1z" />
      <path d="M10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg {...svgProps}>
      <path d="M14 4v10.2a3.8 3.8 0 1 1-3.2-3.75V13a1.3 1.3 0 1 0 1.2 1.3V4c1.5 2.2 3.7 3.4 6 3.6V10c-1.8-.1-3.5-.8-4-2.2" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg {...svgProps}>
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6L16 12h-3V10c0-.6.4-1 1-1z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg {...svgProps}>
      <path d="M15 22v-4a4.2 4.2 0 0 0-1-3.2c3.2-.4 6.5-1.6 6.5-7A5.4 5.4 0 0 0 19 4.8 5 5 0 0 0 18.9 1S17.7.6 15 2.5a13.4 13.4 0 0 0-6 0C6.3.6 5.1 1 5.1 1A5 5 0 0 0 5 4.8 5.4 5.4 0 0 0 3.5 7.8c0 5.4 3.3 6.6 6.5 7A4.2 4.2 0 0 0 9 18v4" />
      <path d="M9 18c-4 1.3-6-2-6-2" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg {...svgProps}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

const ICONS: Record<SocialNetwork, () => ReactElement> = {
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  x: XIcon,
  youtube: YouTubeIcon,
  tiktok: TikTokIcon,
  facebook: FacebookIcon,
  github: GitHubIcon,
  link: LinkIcon,
};

export function SocialIcon({
  network,
  className,
}: {
  network: SocialNetwork;
  className?: string;
}) {
  const Icon = ICONS[network] ?? LinkIcon;
  return (
    <span className={className}>
      <Icon />
    </span>
  );
}
