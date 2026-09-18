import { intro } from "@/data/content";

export function Intro() {
  return (
    <section
      aria-labelledby="intro-heading"
      className="border-y border-ink/6 bg-surface/60 py-20 md:py-28"
    >
      <div className="container-site grid gap-8 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <h2
            id="intro-heading"
            className="font-display text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.15] font-bold"
          >
            {intro.heading}
          </h2>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          {intro.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-muted-text mb-5 max-w-[38rem] text-[1.0625rem] leading-[1.65] last:mb-0"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
