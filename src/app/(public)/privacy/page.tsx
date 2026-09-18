import type { Metadata } from "next";
import Link from "next/link";

import { getSiteContent } from "@/lib/content/store";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content.privacy.title,
    description: content.privacy.lastUpdated,
    alternates: { canonical: "/privacy" },
  };
}

function interpolate(
  text: string,
  values: { email: string; legalName: string; name: string },
) {
  return text
    .replaceAll("{email}", values.email)
    .replaceAll("{legalName}", values.legalName)
    .replaceAll("{name}", values.name);
}

function PrivacyParagraph({
  text,
  email,
  legalName,
  name,
}: {
  text: string;
  email: string;
  legalName: string;
  name: string;
}) {
  const prepared = interpolate(text, { email, legalName, name });
  const parts = prepared.split(email);
  if (parts.length === 1 || !email) {
    return (
      <p className="text-muted-text mt-4 first:mt-0">{prepared}</p>
    );
  }
  return (
    <p className="text-muted-text mt-4 first:mt-0">
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {part}
          {index < parts.length - 1 ? (
            <a
              className="font-medium text-ink underline-offset-4 hover:underline"
              href={`mailto:${email}`}
            >
              {email}
            </a>
          ) : null}
        </span>
      ))}
    </p>
  );
}

export default async function PrivacyPage() {
  const content = await getSiteContent();
  const { email, legalName, name } = content.site;

  return (
    <main id="main" className="flex-1">
      <article className="container-site max-w-3xl py-16 md:py-24">
        {content.privacy.kicker ? (
          <p className="mb-4 text-sm font-semibold text-ink/60">
            {content.privacy.kicker}
          </p>
        ) : null}
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold">
          {content.privacy.title}
        </h1>
        {content.privacy.lastUpdated ? (
          <p className="text-muted-text mt-4 text-sm">
            {content.privacy.lastUpdated}
          </p>
        ) : null}

        <div className="mt-12 space-y-10 text-[1.0625rem] leading-[1.65]">
          {content.privacy.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display mb-3 text-2xl font-semibold">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <PrivacyParagraph
                  key={paragraph}
                  text={paragraph}
                  email={email}
                  legalName={legalName}
                  name={name}
                />
              ))}
            </section>
          ))}
        </div>

        <p className="mt-14">
          <Link
            href="/"
            className="text-sm font-semibold text-ink underline-offset-4 hover:underline"
          >
            {content.privacy.backLabel}
          </Link>
        </p>
      </article>
    </main>
  );
}
