import type { CapabilitiesSection } from "@/lib/content/schema";

export function Capabilities({ section }: { section: CapabilitiesSection }) {
  return (
    <section
      id={section.anchor || "capabilities"}
      aria-labelledby="capabilities-heading"
      className="scroll-mt-24 border-y border-ink/6 bg-surface/50 py-20 md:py-32"
    >
      <div className="container-site">
        <div className="mb-12 max-w-xl md:mb-16">
          {section.eyebrow ? (
            <p className="mb-4 text-sm font-semibold text-ink/60">{section.eyebrow}</p>
          ) : null}
          <h2
            id="capabilities-heading"
            className="font-display text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.15] font-bold"
          >
            {section.heading}
          </h2>
        </div>
        <ol className="grid gap-0 md:grid-cols-2">
          {section.items.map((item, index) => (
            <li
              key={`${item.number}-${item.title}`}
              className={`border-ink/8 py-8 md:p-10 md:py-12 ${
                index % 2 === 0 ? "md:border-r" : ""
              } ${index < 2 ? "md:border-b" : ""} ${
                index < section.items.length - 1 ? "border-b md:border-b-0" : ""
              } ${index < 2 ? "" : "md:border-t"}`}
            >
              {item.number ? (
                <p className="font-display mb-4 text-sm font-semibold tracking-wide text-ink/45">
                  {item.number}
                </p>
              ) : null}
              <h3 className="font-display text-[1.375rem] font-semibold md:text-[1.5rem]">
                {item.title}
              </h3>
              <p className="text-muted-text mt-3 max-w-[36rem] text-[1.0625rem] leading-[1.65]">
                {item.copy}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
