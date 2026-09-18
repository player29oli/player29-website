import { ContentImage } from "@/components/content-image";
import type { AboutSection } from "@/lib/content/schema";

function FounderPlaceholder({
  label,
  caption,
}: {
  label: string;
  caption: string;
}) {
  return (
    <figure className="bg-surface overflow-hidden rounded-[22px]">
      <div className="flex aspect-[4/5] flex-col items-center justify-center gap-4">
        <span
          aria-hidden
          className="font-display text-6xl font-bold text-ink/25 md:text-7xl"
        >
          OK
        </span>
        <span className="signal-gradient h-1 w-12 rounded-full" />
      </div>
      <figcaption className="border-t border-ink/6 px-5 py-4 text-sm">
        <span className="font-semibold text-ink">{label}</span>
        {caption ? (
          <span className="text-muted-text"> — {caption}</span>
        ) : null}
      </figcaption>
    </figure>
  );
}

export function About({ section }: { section: AboutSection }) {
  return (
    <section
      id={section.anchor || "about"}
      aria-labelledby="about-heading"
      className="scroll-mt-24 border-y border-ink/6 bg-surface/40 py-20 md:py-32"
    >
      <div className="container-site grid items-center gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-4 md:col-start-1">
          {section.portraitSrc ? (
            <figure className="bg-surface overflow-hidden rounded-[22px]">
              <ContentImage
                src={section.portraitSrc}
                alt={section.portraitAlt || section.portraitLabel}
                width={800}
                height={1000}
                className="aspect-[4/5] h-auto w-full object-cover"
              />
              <figcaption className="border-t border-ink/6 px-5 py-4 text-sm">
                <span className="font-semibold text-ink">
                  {section.portraitLabel}
                </span>
                {section.portraitCaption ? (
                  <span className="text-muted-text">
                    {" "}
                    — {section.portraitCaption}
                  </span>
                ) : null}
              </figcaption>
            </figure>
          ) : (
            <FounderPlaceholder
              label={section.portraitLabel}
              caption={section.portraitCaption}
            />
          )}
        </div>
        <div className="md:col-span-7 md:col-start-6">
          {section.eyebrow ? (
            <p className="mb-4 text-sm font-semibold text-ink/60">
              {section.eyebrow}
            </p>
          ) : null}
          <h2
            id="about-heading"
            className="font-display text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.15] font-bold"
          >
            {section.heading}
          </h2>
          {section.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-muted-text mt-5 max-w-[38rem] text-[1.0625rem] leading-[1.65]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
