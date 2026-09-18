import Image from "next/image";

import { ContactForm } from "@/components/sections/contact-form";
import { closing, contact } from "@/data/content";
import { siteConfig } from "@/config/site";

export function Closing() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-ink relative overflow-hidden py-20 text-white md:py-28"
    >
      <Image
        src="/brand/player29-device-29.png"
        alt=""
        width={543}
        height={400}
        className="pointer-events-none absolute -right-16 -bottom-16 w-[min(28rem,55%)] opacity-25"
      />
      <div className="container-site relative grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <h2
            id="contact-heading"
            className="font-display text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.15] font-bold text-white"
          >
            {closing.heading}
          </h2>
          <p className="mt-4 text-[1.125rem] text-white/75">{closing.supporting}</p>
          <p className="mt-8 text-sm text-white/55">
            Or write directly to{" "}
            <a className="font-semibold text-white underline-offset-4 hover:underline" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
            .
          </p>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <div className="rounded-[22px] bg-white p-5 text-ink shadow-[0_24px_80px_rgba(0,0,0,0.25)] md:p-8">
            <h3 className="font-display mb-1 text-xl font-semibold">{contact.heading}</h3>
            <p className="text-muted-text mb-6 text-[0.975rem] leading-relaxed">
              {contact.supporting}
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
