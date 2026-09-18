import type { ApproachSection } from "@/lib/content/schema";

export function Approach({ section }: { section: ApproachSection }) {
  return (
    <section
      id={section.anchor || undefined}
      aria-labelledby="approach-heading"
      className="py-20 md:py-32"
    >
      <div className="container-site">
        <div className="mb-12 max-w-2xl md:mb-16">
          {section.eyebrow ? (
            <p className="mb-4 text-sm font-semibold text-ink/60">{section.eyebrow}</p>
          ) : null}
          <h2
            id="approach-heading"
            className="font-display text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.15] font-bold"
          >
            {section.intro}
          </h2>
        </div>
        <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
          <span
            aria-hidden
            className="bg-ink/10 absolute top-5 right-0 left-0 hidden h-px md:block"
          />
          {section.stages.map((stage, index) => (
            <li key={`${stage.number}-${stage.title}`} className="relative">
              <span
                aria-hidden
                className={`mb-5 flex size-10 items-center justify-center rounded-full border bg-canvas text-sm font-semibold ${
                  index === 0
                    ? "border-transparent text-white"
                    : "border-ink/15 text-ink"
                }`}
                style={
                  index === 0
                    ? {
                        backgroundImage:
                          "linear-gradient(90deg, #20B8F6 0%, #8C24F5 100%)",
                      }
                    : undefined
                }
              >
                {stage.number}
              </span>
              <h3 className="font-display text-[1.25rem] font-semibold">
                {stage.title}
              </h3>
              <p className="text-muted-text mt-2 text-[1.0625rem] leading-[1.65]">
                {stage.copy}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
