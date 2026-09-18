export const siteConfig = {
  name: "Player29",
  legalName: "Player29 Ltd",
  tagline: "Digital products for sport, media and the screen.",
  title: "Player29 | Digital products for sport, media and the screen",
  description:
    "Player29 is a digital product company shaping and building engaging experiences across sport, media and connected TV.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:43129",
  locale: "en_GB",
  email: "oli@player29.com",
  linkedin: "https://www.linkedin.com/company/player29",
  /**
   * Companies House number. Leave empty until confirmed — do not invent one.
   */
  companyNumber: "",
  /**
   * Approved public registered office only. Never a personal residential address.
   */
  registeredOffice: "",
  contactFormEndpoint: process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ?? "",
  themeColor: "#111318",
} as const;

export type SiteConfig = typeof siteConfig;
