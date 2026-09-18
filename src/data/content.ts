export const navigation = [
  { label: "Work", href: "/#work" },
  { label: "Capabilities", href: "/#capabilities" },
  { label: "About", href: "/#about" },
] as const;

export const hero = {
  headline: "Digital products built for sport, media and the screen.",
  supporting:
    "We turn strong ideas and valuable IP into engaging digital experiences — from football products to connected-TV applications.",
  primaryCta: { label: "Start a conversation", href: "/#contact" },
  secondaryCta: { label: "Explore what we do", href: "/#capabilities" },
} as const;

export const intro = {
  heading: "Strong ideas, made real.",
  paragraphs: [
    "Player29 shapes and builds digital products at the intersection of sport, media and technology.",
    "We combine product thinking, audience understanding and hands-on delivery to turn promising concepts into experiences people want to use.",
  ],
} as const;

export type FeaturedWork = {
  id: string;
  name: string;
  partner: string;
  status: string;
  description: string;
  role: string;
  screenshot: string | null;
  video: string | null;
  launchUrl: string | null;
  appStoreUrl: string | null;
  caseStudyUrl: string | null;
};

export const featuredWork: FeaturedWork = {
  id: "football-product",
  name: "",
  partner: "",
  status: "Football product — in development",
  description:
    "A compact football management experience designed around meaningful decisions, replayability and playing with friends.",
  role: "Product strategy, design and delivery",
  screenshot: null,
  video: null,
  launchUrl: null,
  appStoreUrl: null,
  caseStudyUrl: null,
};

export const capabilities = [
  {
    number: "01",
    title: "Product strategy",
    copy: "Clarify the audience, opportunity, proposition and route to a viable product. Turn an open-ended concept into priorities, journeys, requirements and a practical plan.",
  },
  {
    number: "02",
    title: "Digital product delivery",
    copy: "Shape and build focused applications with clear user journeys, considered interfaces and delivery appropriate to the stage of the product.",
  },
  {
    number: "03",
    title: "Connected TV and media",
    copy: "Create screen-first experiences informed by television interfaces, remote interaction, content discovery and cross-platform constraints.",
  },
  {
    number: "04",
    title: "IP to digital product",
    copy: "Translate an existing brand, format or ruleset into a digital experience while understanding what should remain familiar and what needs to change.",
  },
] as const;

export const approach = {
  intro:
    "Good digital products begin by understanding what needs to be true for them to work.",
  stages: [
    {
      number: "01",
      title: "Understand the opportunity",
      copy: "Who it is for, why it should exist, and what would make it worth returning to.",
    },
    {
      number: "02",
      title: "Shape the product",
      copy: "Priorities, journeys and an interface that can be built and tested without theatre.",
    },
    {
      number: "03",
      title: "Build and learn",
      copy: "Ship a focused slice, see how people actually use it, and keep the scope honest.",
    },
    {
      number: "04",
      title: "Improve with evidence",
      copy: "Change what the product is based on behaviour, not on a slide of next steps.",
    },
  ],
} as const;

export const about = {
  heading: "Founder-led by design.",
  paragraphs: [
    "Player29 is a founder-led digital product company created by product manager Oliver Kyte.",
    "The company brings together product strategy, interface thinking and software delivery, bringing in trusted design, engineering and specialist expertise when a product requires it.",
    "This keeps decisions close to the work while allowing each delivery team to grow responsibly around the needs of the product.",
  ],
  portraitLabel: "Founder portrait",
  portraitCaption: "To follow",
} as const;

export const closing = {
  heading: "Have a strong idea, format or audience?",
  supporting: "Let's explore what it could become.",
  cta: { label: "Start a conversation", href: "/#contact" },
} as const;

export const contact = {
  heading: "Start a conversation",
  supporting:
    "Tell us a little about the idea, format or audience. A short note is enough.",
  fields: {
    name: "Name",
    email: "Email",
    organisation: "Organisation",
    message: "Message",
  },
  submit: "Send message",
  success: "Thanks — we will get back to you shortly.",
  error: "Something went wrong. Please email us instead.",
} as const;

export const footer = {
  privacy: { label: "Privacy", href: "/privacy" },
  copyrightPrefix: "©",
} as const;
