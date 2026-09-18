import { about } from "@/data/content";

function FounderPlaceholder() {
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
        <span className="font-semibold text-ink">{about.portraitLabel}</span>
        <span className="text-muted-text"> — {about.portraitCaption}</span>
      </figcaption>
    </figure>
  );
}

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-24 border-y border-ink/6 bg-surface/40 py-20 md:py-32"
    >
      <div className="container-site grid items-center gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-4 md:col-start-1">
          <FounderPlaceholder />
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <p className="mb-4 text-sm font-semibold text-ink/60">About</p>
          <h2
            id="about-heading"
            className="font-display text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.15] font-bold"
          >
            {about.heading}
          </h2>
          {about.paragraphs.map((paragraph) => (
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
