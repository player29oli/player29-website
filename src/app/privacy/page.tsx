import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Player29 handles information on this website. This page has not received legal review.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main id="main" className="flex-1">
      <article className="container-site max-w-3xl py-16 md:py-24">
        <p className="mb-4 text-sm font-semibold text-ink/60">Player29</p>
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold">
          Privacy
        </h1>
        <p className="text-muted-text mt-4 text-sm">
          Last updated 18 September 2026. This page is a working draft for the
          first public site. It has not received legal review and is not legal
          advice.
        </p>

        <div className="mt-12 space-y-10 text-[1.0625rem] leading-[1.65]">
          <section>
            <h2 className="font-display mb-3 text-2xl font-semibold">
              Who we are
            </h2>
            <p className="text-muted-text">
              This website is published by {siteConfig.legalName}, a founder-led
              digital product company. You can contact us at{" "}
              <a className="font-medium text-ink underline-offset-4 hover:underline" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl font-semibold">
              What this site collects
            </h2>
            <p className="text-muted-text">
              The public pages do not use advertising trackers, analytics
              cookies or unnecessary cookies. We do not implement Google
              Analytics.
            </p>
            <p className="text-muted-text mt-4">
              If you send a message through the contact form or email, we
              receive the name, email address, organisation (if you provide
              one) and message that you submit, so that we can reply. We do
              not sell this information.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl font-semibold">Cookies</h2>
            <p className="text-muted-text">
              This version of the site does not set advertising or analytics
              cookies. Hosting providers such as Vercel may process technical
              logs (for example IP address, browser and request time) to
              operate and secure the service. If we later add privacy-conscious
              analytics, this page will be updated before those tools are
              switched on.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl font-semibold">
              Where messages go
            </h2>
            <p className="text-muted-text">
              If a contact form endpoint is configured, submissions are posted
              to that provider so we can read them. If no endpoint is
              configured, the form opens your email application addressed to{" "}
              {siteConfig.email}. Do not send passwords, payment details or
              confidential third-party material through this form.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl font-semibold">
              How long we keep it
            </h2>
            <p className="text-muted-text">
              Enquiry messages are kept for as long as needed to respond and
              to maintain a record of the conversation, then deleted unless we
              have a continuing reason to hold them (for example an active
              project discussion).
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl font-semibold">
              Your rights
            </h2>
            <p className="text-muted-text">
              If you are in the UK or EEA you may have rights to access,
              correct or delete personal data we hold about you, and to object
              to or restrict certain processing. Email{" "}
              <a className="font-medium text-ink underline-offset-4 hover:underline" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>{" "}
              to ask. You may also complain to the Information Commissioner’s
              Office.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl font-semibold">
              Changes
            </h2>
            <p className="text-muted-text">
              We will update this page if the way the site handles information
              changes. The date at the top will change when we do.
            </p>
          </section>
        </div>

        <p className="mt-14">
          <Link
            href="/"
            className="text-sm font-semibold text-ink underline-offset-4 hover:underline"
          >
            Back to the homepage
          </Link>
        </p>
      </article>
    </main>
  );
}
