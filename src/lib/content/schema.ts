export type ContentStoreKind = "blob" | "file" | "default";

export const CONTENT_VERSION = 1;
export const MAX_SECTIONS = 24;
export const MAX_LIST_ITEMS = 16;
export const MAX_PARAGRAPHS = 12;
export const MAX_STRING = 8000;
export const MAX_SHORT = 240;

export const SECTION_TYPES = [
  "hero",
  "intro",
  "work",
  "capabilities",
  "approach",
  "about",
  "closing",
  "richText",
  "media",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export const SECTION_LABELS: Record<SectionType, string> = {
  hero: "Hero",
  intro: "Introduction",
  work: "Work",
  capabilities: "Capabilities",
  approach: "Approach",
  about: "About",
  closing: "Contact",
  richText: "Rich text",
  media: "Media",
};

export type LinkField = {
  label: string;
  href: string;
};

export type NumberedItem = {
  number: string;
  title: string;
  copy: string;
};

export type FrameCard = {
  title: string;
  lines: string[];
};

export type HeroSection = {
  id: string;
  type: "hero";
  anchor: string;
  kicker: string;
  headline: string;
  supporting: string;
  primaryCta: LinkField;
  secondaryCta: LinkField;
  imageSrc: string;
  imageAlt: string;
};

export type IntroSection = {
  id: string;
  type: "intro";
  anchor: string;
  heading: string;
  paragraphs: string[];
};

export type WorkSection = {
  id: string;
  type: "work";
  anchor: string;
  eyebrow: string;
  name: string;
  partner: string;
  status: string;
  description: string;
  role: string;
  screenshot: string;
  screenshotAlt: string;
  video: string;
  launchUrl: string;
  appStoreUrl: string;
  caseStudyUrl: string;
  frame: {
    badge: string;
    cards: FrameCard[];
    footerLabel: string;
    footerCopy: string;
  };
};

export type CapabilitiesSection = {
  id: string;
  type: "capabilities";
  anchor: string;
  eyebrow: string;
  heading: string;
  items: NumberedItem[];
};

export type ApproachSection = {
  id: string;
  type: "approach";
  anchor: string;
  eyebrow: string;
  intro: string;
  stages: NumberedItem[];
};

export type AboutSection = {
  id: string;
  type: "about";
  anchor: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  portraitSrc: string;
  portraitAlt: string;
  portraitLabel: string;
  portraitCaption: string;
};

export type ClosingSection = {
  id: string;
  type: "closing";
  anchor: string;
  heading: string;
  supporting: string;
  emailLead: string;
  backgroundImage: string;
  cta: LinkField;
  contact: {
    heading: string;
    supporting: string;
    fields: {
      name: string;
      email: string;
      organisation: string;
      message: string;
    };
    submit: string;
    sending: string;
    success: string;
    error: string;
    validation: {
      nameRequired: string;
      emailRequired: string;
      emailInvalid: string;
      messageRequired: string;
    };
  };
};

export type RichTextSection = {
  id: string;
  type: "richText";
  anchor: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  tone: "light" | "surface" | "ink";
};

export type MediaSection = {
  id: string;
  type: "media";
  anchor: string;
  eyebrow: string;
  heading: string;
  caption: string;
  imageSrc: string;
  imageAlt: string;
  layout: "full" | "split";
};

export type HomepageSection =
  | HeroSection
  | IntroSection
  | WorkSection
  | CapabilitiesSection
  | ApproachSection
  | AboutSection
  | ClosingSection
  | RichTextSection
  | MediaSection;

export type PrivacyBlock = {
  heading: string;
  paragraphs: string[];
};

export type SiteContent = {
  version: typeof CONTENT_VERSION;
  updatedAt: string;
  site: {
    name: string;
    legalName: string;
    tagline: string;
    title: string;
    description: string;
    email: string;
    linkedin: string;
    companyNumber: string;
    registeredOffice: string;
  };
  chrome: {
    navigation: LinkField[];
    headerCta: LinkField;
    footerBlurb: string;
    privacyLabel: string;
    privacyHref: string;
    copyrightPrefix: string;
    linkedinLabel: string;
    socials: LinkField[];
  };
  notFound: {
    kicker: string;
    title: string;
    body: string;
    ctaLabel: string;
  };
  privacy: {
    kicker: string;
    title: string;
    lastUpdated: string;
    backLabel: string;
    sections: PrivacyBlock[];
  };
  sections: HomepageSection[];
};

export function isSectionType(value: unknown): value is SectionType {
  return typeof value === "string" && (SECTION_TYPES as readonly string[]).includes(value);
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  return value.length > MAX_STRING ? value.slice(0, MAX_STRING) : value;
}

function asShort(value: unknown, fallback = ""): string {
  const text = asString(value, fallback);
  return text.length > MAX_SHORT ? text.slice(0, MAX_SHORT) : text;
}

function asStringArray(value: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .filter((item): item is string => typeof item === "string")
    .slice(0, MAX_PARAGRAPHS)
    .map((item) => asString(item));
}

function asId(value: unknown, fallback: string): string {
  const text = asShort(value, fallback).replace(/[^a-zA-Z0-9_-]/g, "");
  return text || fallback;
}

function asAnchor(value: unknown): string {
  return asShort(value).replace(/[^a-zA-Z0-9_-]/g, "");
}

function isSafeHref(value: string): boolean {
  const href = value.trim();
  if (!href) return true;
  const lower = href.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:")) return false;
  return (
    href.startsWith("/") ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("https://") ||
    href.startsWith("http://")
  );
}

function asHref(value: unknown, fallback = ""): string {
  const href = asString(value, fallback).trim();
  return isSafeHref(href) ? href : fallback;
}

function asLink(value: unknown, fallback: LinkField): LinkField {
  const record = isRecord(value) ? value : {};
  return {
    label: asShort(record.label, fallback.label),
    href: asHref(record.href, fallback.href),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asNumberedItem(value: unknown, fallback: NumberedItem): NumberedItem {
  const record = isRecord(value) ? value : {};
  return {
    number: asShort(record.number, fallback.number),
    title: asShort(record.title, fallback.title),
    copy: asString(record.copy, fallback.copy),
  };
}

function asNumberedList(value: unknown, fallback: NumberedItem[]): NumberedItem[] {
  if (!Array.isArray(value) || value.length === 0) return fallback;
  return value.slice(0, MAX_LIST_ITEMS).map((item, index) =>
    asNumberedItem(item, fallback[index] ?? { number: String(index + 1).padStart(2, "0"), title: "", copy: "" }),
  );
}

const emptyLink: LinkField = { label: "", href: "" };

function parseHero(raw: Record<string, unknown>, id: string): HeroSection {
  return {
    id,
    type: "hero",
    anchor: asAnchor(raw.anchor),
    kicker: asShort(raw.kicker),
    headline: asString(raw.headline),
    supporting: asString(raw.supporting),
    primaryCta: asLink(raw.primaryCta, emptyLink),
    secondaryCta: asLink(raw.secondaryCta, emptyLink),
    imageSrc: asHref(raw.imageSrc),
    imageAlt: asShort(raw.imageAlt),
  };
}

function parseIntro(raw: Record<string, unknown>, id: string): IntroSection {
  return {
    id,
    type: "intro",
    anchor: asAnchor(raw.anchor),
    heading: asString(raw.heading),
    paragraphs: asStringArray(raw.paragraphs, [""]),
  };
}

function parseWork(raw: Record<string, unknown>, id: string): WorkSection {
  const frameRaw = isRecord(raw.frame) ? raw.frame : {};
  const cardsRaw = Array.isArray(frameRaw.cards) ? frameRaw.cards : [];
  return {
    id,
    type: "work",
    anchor: asAnchor(raw.anchor),
    eyebrow: asShort(raw.eyebrow, "Work"),
    name: asShort(raw.name),
    partner: asShort(raw.partner),
    status: asShort(raw.status),
    description: asString(raw.description),
    role: asShort(raw.role),
    screenshot: asHref(raw.screenshot),
    screenshotAlt: asShort(raw.screenshotAlt),
    video: asHref(raw.video),
    launchUrl: asHref(raw.launchUrl),
    appStoreUrl: asHref(raw.appStoreUrl),
    caseStudyUrl: asHref(raw.caseStudyUrl),
    frame: {
      badge: asShort(frameRaw.badge),
      cards: (cardsRaw.length ? cardsRaw : [{ title: "", lines: ["", ""] }])
        .slice(0, MAX_LIST_ITEMS)
        .map((card) => {
          const record = isRecord(card) ? card : {};
          return {
            title: asShort(record.title),
            lines: asStringArray(record.lines, ["", ""]).slice(0, 4),
          };
        }),
      footerLabel: asShort(frameRaw.footerLabel),
      footerCopy: asString(frameRaw.footerCopy),
    },
  };
}

function parseCapabilities(raw: Record<string, unknown>, id: string): CapabilitiesSection {
  return {
    id,
    type: "capabilities",
    anchor: asAnchor(raw.anchor),
    eyebrow: asShort(raw.eyebrow, "Capabilities"),
    heading: asString(raw.heading),
    items: asNumberedList(raw.items, []),
  };
}

function parseApproach(raw: Record<string, unknown>, id: string): ApproachSection {
  return {
    id,
    type: "approach",
    anchor: asAnchor(raw.anchor),
    eyebrow: asShort(raw.eyebrow, "Approach"),
    intro: asString(raw.intro),
    stages: asNumberedList(raw.stages, []),
  };
}

function parseAbout(raw: Record<string, unknown>, id: string): AboutSection {
  return {
    id,
    type: "about",
    anchor: asAnchor(raw.anchor),
    eyebrow: asShort(raw.eyebrow, "About"),
    heading: asString(raw.heading),
    paragraphs: asStringArray(raw.paragraphs, [""]),
    portraitSrc: asHref(raw.portraitSrc),
    portraitAlt: asShort(raw.portraitAlt),
    portraitLabel: asShort(raw.portraitLabel),
    portraitCaption: asShort(raw.portraitCaption),
  };
}

function parseClosing(raw: Record<string, unknown>, id: string): ClosingSection {
  const contactRaw = isRecord(raw.contact) ? raw.contact : {};
  const fieldsRaw = isRecord(contactRaw.fields) ? contactRaw.fields : {};
  const validationRaw = isRecord(contactRaw.validation) ? contactRaw.validation : {};
  return {
    id,
    type: "closing",
    anchor: asAnchor(raw.anchor) || "contact",
    heading: asString(raw.heading),
    supporting: asString(raw.supporting),
    emailLead: asShort(raw.emailLead, "Or write directly to"),
    backgroundImage: asHref(raw.backgroundImage),
    cta: asLink(raw.cta, emptyLink),
    contact: {
      heading: asShort(contactRaw.heading),
      supporting: asString(contactRaw.supporting),
      fields: {
        name: asShort(fieldsRaw.name, "Name"),
        email: asShort(fieldsRaw.email, "Email"),
        organisation: asShort(fieldsRaw.organisation, "Organisation"),
        message: asShort(fieldsRaw.message, "Message"),
      },
      submit: asShort(contactRaw.submit, "Send message"),
      sending: asShort(contactRaw.sending, "Sending…"),
      success: asString(contactRaw.success),
      error: asString(contactRaw.error),
      validation: {
        nameRequired: asShort(validationRaw.nameRequired, "Please enter your name."),
        emailRequired: asShort(validationRaw.emailRequired, "Please enter your email."),
        emailInvalid: asShort(validationRaw.emailInvalid, "Enter a valid email address."),
        messageRequired: asShort(validationRaw.messageRequired, "Please add a short message."),
      },
    },
  };
}

function parseRichText(raw: Record<string, unknown>, id: string): RichTextSection {
  const tone = raw.tone === "surface" || raw.tone === "ink" ? raw.tone : "light";
  return {
    id,
    type: "richText",
    anchor: asAnchor(raw.anchor),
    eyebrow: asShort(raw.eyebrow),
    heading: asString(raw.heading),
    paragraphs: asStringArray(raw.paragraphs, [""]),
    tone,
  };
}

function parseMedia(raw: Record<string, unknown>, id: string): MediaSection {
  return {
    id,
    type: "media",
    anchor: asAnchor(raw.anchor),
    eyebrow: asShort(raw.eyebrow),
    heading: asString(raw.heading),
    caption: asString(raw.caption),
    imageSrc: asHref(raw.imageSrc),
    imageAlt: asShort(raw.imageAlt),
    layout: raw.layout === "split" ? "split" : "full",
  };
}

function parseSection(value: unknown, index: number): HomepageSection | null {
  if (!isRecord(value) || !isSectionType(value.type)) return null;
  const id = asId(value.id, `${value.type}-${index + 1}`);
  switch (value.type) {
    case "hero":
      return parseHero(value, id);
    case "intro":
      return parseIntro(value, id);
    case "work":
      return parseWork(value, id);
    case "capabilities":
      return parseCapabilities(value, id);
    case "approach":
      return parseApproach(value, id);
    case "about":
      return parseAbout(value, id);
    case "closing":
      return parseClosing(value, id);
    case "richText":
      return parseRichText(value, id);
    case "media":
      return parseMedia(value, id);
    default:
      return null;
  }
}

/**
 * Coerce unknown JSON into a SiteContent document.
 * Returns null if the payload is not a usable v1 document.
 */
export function parseSiteContent(value: unknown): SiteContent | null {
  if (!isRecord(value)) return null;
  if (value.version !== CONTENT_VERSION) return null;
  if (!isRecord(value.site) || !isRecord(value.chrome) || !Array.isArray(value.sections)) {
    return null;
  }

  const siteRaw = value.site;
  const chromeRaw = value.chrome;
  const notFoundRaw = isRecord(value.notFound) ? value.notFound : {};
  const privacyRaw = isRecord(value.privacy) ? value.privacy : {};
  const navRaw = Array.isArray(chromeRaw.navigation) ? chromeRaw.navigation : [];
  const privacySectionsRaw = Array.isArray(privacyRaw.sections) ? privacyRaw.sections : [];

  const sections = value.sections
    .slice(0, MAX_SECTIONS)
    .map((section, index) => parseSection(section, index))
    .filter((section): section is HomepageSection => section !== null);

  const socialsRaw = Array.isArray(chromeRaw.socials) ? chromeRaw.socials : null;
  let socials = (socialsRaw ?? [])
    .slice(0, MAX_LIST_ITEMS)
    .map((item) => asLink(item, emptyLink));
  if (socialsRaw === null) {
    const inherited = asHref(siteRaw.linkedin);
    if (inherited) {
      socials = [
        {
          label: asShort(chromeRaw.linkedinLabel, "LinkedIn"),
          href: inherited,
        },
      ];
    }
  }
  const linkedinFromSocials =
    socials.find((item) => /linkedin\.com/i.test(item.href))?.href ?? "";

  return {
    version: CONTENT_VERSION,
    updatedAt: asString(value.updatedAt, new Date().toISOString()),
    site: {
      name: asShort(siteRaw.name, "Player29"),
      legalName: asShort(siteRaw.legalName, "Player29 Ltd"),
      tagline: asString(siteRaw.tagline),
      title: asString(siteRaw.title),
      description: asString(siteRaw.description),
      email: asShort(siteRaw.email),
      linkedin: linkedinFromSocials || asHref(siteRaw.linkedin),
      companyNumber: asShort(siteRaw.companyNumber),
      registeredOffice: asString(siteRaw.registeredOffice),
    },
    chrome: {
      navigation: navRaw.slice(0, MAX_LIST_ITEMS).map((item) => asLink(item, emptyLink)),
      headerCta: asLink(chromeRaw.headerCta, emptyLink),
      footerBlurb: asString(chromeRaw.footerBlurb),
      privacyLabel: asShort(chromeRaw.privacyLabel, "Privacy"),
      privacyHref: asHref(chromeRaw.privacyHref, "/privacy"),
      copyrightPrefix: asShort(chromeRaw.copyrightPrefix, "©"),
      linkedinLabel: asShort(chromeRaw.linkedinLabel, "LinkedIn"),
      socials,
    },
    notFound: {
      kicker: asShort(notFoundRaw.kicker, "404"),
      title: asString(notFoundRaw.title),
      body: asString(notFoundRaw.body),
      ctaLabel: asShort(notFoundRaw.ctaLabel, "Go to the homepage"),
    },
    privacy: {
      kicker: asShort(privacyRaw.kicker),
      title: asShort(privacyRaw.title, "Privacy"),
      lastUpdated: asString(privacyRaw.lastUpdated),
      backLabel: asShort(privacyRaw.backLabel, "Back to the homepage"),
      sections: privacySectionsRaw.slice(0, MAX_LIST_ITEMS).map((block) => {
        const record = isRecord(block) ? block : {};
        return {
          heading: asShort(record.heading),
          paragraphs: asStringArray(record.paragraphs, [""]),
        };
      }),
    },
    sections,
  };
}

export function createSectionId(type: SectionType): string {
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  return `${type}-${suffix}`;
}

export function createSection(type: SectionType): HomepageSection {
  const id = createSectionId(type);
  switch (type) {
    case "hero":
      return parseHero(
        {
          kicker: "Player29",
          headline: "",
          supporting: "",
          primaryCta: { label: "Start a conversation", href: "/#contact" },
          secondaryCta: { label: "Explore what we do", href: "/#capabilities" },
        },
        id,
      );
    case "intro":
      return parseIntro({ heading: "", paragraphs: [""] }, id);
    case "work":
      return parseWork(
        {
          anchor: "work",
          eyebrow: "Work",
          status: "",
          description: "",
          role: "",
          frame: {
            badge: "In development",
            cards: [{ title: "", lines: ["", ""] }],
            footerLabel: "",
            footerCopy: "",
          },
        },
        id,
      );
    case "capabilities":
      return parseCapabilities(
        {
          anchor: "capabilities",
          eyebrow: "Capabilities",
          heading: "",
          items: [{ number: "01", title: "", copy: "" }],
        },
        id,
      );
    case "approach":
      return parseApproach(
        {
          anchor: "approach",
          eyebrow: "Approach",
          intro: "",
          stages: [{ number: "01", title: "", copy: "" }],
        },
        id,
      );
    case "about":
      return parseAbout(
        {
          anchor: "about",
          eyebrow: "About",
          heading: "",
          paragraphs: [""],
          portraitLabel: "Founder portrait",
          portraitCaption: "",
        },
        id,
      );
    case "closing":
      return parseClosing(
        {
          anchor: "contact",
          heading: "",
          supporting: "",
          emailLead: "Or write directly to",
          backgroundImage: "/brand/player29-device-29.png",
          contact: {
            heading: "Start a conversation",
            supporting: "",
            submit: "Send message",
          },
        },
        id,
      );
    case "richText":
      return parseRichText(
        {
          heading: "",
          paragraphs: [""],
          tone: "surface",
        },
        id,
      );
    case "media":
      return parseMedia(
        {
          heading: "",
          caption: "",
          layout: "full",
        },
        id,
      );
  }
}
