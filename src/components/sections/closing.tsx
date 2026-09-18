import Image from "next/image";

import { ContactTrackedLink } from "@/components/analytics/contact-tracked-link";
import { ContactForm } from "@/components/sections/contact-form";
import { siteConfig } from "@/config/site";
import type { ClosingSection } from "@/lib/content/schema";

export function Closing({
  section,
  email,
  name,
}: {
  section: ClosingSection;
  email: string;
  name: string;
}) {
  const background = section.backgroundImage || "/brand/player29-device-29.png";

  return (
    <section
      id={section.anchor || "contact"}
      aria-labelledby="contact-heading"
      className="bg-ink relative overflow-hidden py-20 text-white md:py-28"
      data-header-tone="dark"
    >
      {background.startsWith("http") ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={background}
          alt=""
          className="pointer-events-none absolute -right-16 -bottom-16 w-[min(28rem,55%)] opacity-25"
        />
      ) : (
        <Image
          src={background}
          alt=""
          width={543}
          height={400}
          className="pointer-events-none absolute -right-16 -bottom-16 w-[min(28rem,55%)] opacity-25"
        />
      )}
      <div className="container-site relative grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <h2
            id="contact-heading"
            className="font-display text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.15] font-bold text-white"
          >
            {section.heading}
          </h2>
          {section.supporting ? (
            <p className="mt-4 text-[1.125rem] text-white/75">
              {section.supporting}
            </p>
          ) : null}
          {email ? (
            <p className="mt-8 text-sm text-white/55">
              {section.emailLead}{" "}
              <ContactTrackedLink
                className="font-semibold text-white underline-offset-4 hover:underline"
                href={`mailto:${email}`}
                location="closing"
              >
                {email}
              </ContactTrackedLink>
              .
            </p>
          ) : null}
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <div className="rounded-[22px] bg-white p-5 text-ink shadow-[0_24px_80px_rgba(0,0,0,0.25)] md:p-8">
            <h3 className="font-display mb-1 text-xl font-semibold">
              {section.contact.heading}
            </h3>
            {section.contact.supporting ? (
              <p className="text-muted-text mb-6 text-[0.975rem] leading-relaxed">
                {section.contact.supporting}
              </p>
            ) : null}
            <ContactForm
              copy={section.contact}
              email={email}
              name={name}
              endpoint={siteConfig.contactFormEndpoint}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
