export const SOCIAL_NETWORKS = [
  "linkedin",
  "instagram",
  "x",
  "youtube",
  "tiktok",
  "facebook",
  "github",
  "link",
] as const;

export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number];

const HOST_MAP: Array<{ host: string; network: SocialNetwork }> = [
  { host: "linkedin.com", network: "linkedin" },
  { host: "instagram.com", network: "instagram" },
  { host: "twitter.com", network: "x" },
  { host: "x.com", network: "x" },
  { host: "youtube.com", network: "youtube" },
  { host: "youtu.be", network: "youtube" },
  { host: "tiktok.com", network: "tiktok" },
  { host: "facebook.com", network: "facebook" },
  { host: "fb.com", network: "facebook" },
  { host: "fb.me", network: "facebook" },
  { host: "github.com", network: "github" },
];

export const NETWORK_LABELS: Record<SocialNetwork, string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  x: "X",
  youtube: "YouTube",
  tiktok: "TikTok",
  facebook: "Facebook",
  github: "GitHub",
  link: "Website",
};

export function detectSocialNetwork(href: string): SocialNetwork {
  try {
    const host = new URL(href).hostname.replace(/^www\./, "").toLowerCase();
    const match = HOST_MAP.find(
      (item) => host === item.host || host.endsWith(`.${item.host}`),
    );
    return match?.network ?? "link";
  } catch {
    return "link";
  }
}

const PLACEHOLDER_HREF = /^(#|\/#|https?:\/\/?)$/i;

export function visibleSocials<T extends { label: string; href: string }>(
  items: T[],
): T[] {
  return items.filter((item) => {
    const href = item.href.trim();
    if (!href) return false;
    if (PLACEHOLDER_HREF.test(href)) return false;
    const lower = href.toLowerCase();
    if (lower.startsWith("javascript:") || lower.startsWith("data:")) return false;
    return true;
  });
}

export function socialAccessibleName(label: string, href: string): string {
  const trimmed = label.trim();
  if (trimmed) return trimmed;
  return NETWORK_LABELS[detectSocialNetwork(href)];
}
