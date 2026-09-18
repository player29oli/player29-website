import type { RichTextSection } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

export function RichText({ section }: { section: RichTextSection }) {
  const ink = section.tone === "ink";
  return (
    <section
      id={section.anchor || undefined}
      aria-labelledby={`${section.id}-heading`}
      className={cn(
        "py-20 md:py-28",
        section.tone === "surface" && "border-y border-ink/6 bg-surface/60",
        ink && "bg-ink text-white",
      )}
    >
      <div className="container-site max-w-3xl">
        {section.eyebrow ? (
          <p className={cn("mb-4 text-sm font-semibold", ink ? "text-white/60" : "text-ink/60")}>
            {section.eyebrow}
          </p>
        ) : null}
        {section.heading ? (
          <h2
            id={`${section.id}-heading`}
            className={cn(
              "font-display text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.15] font-bold",
              ink && "text-white",
            )}
          >
            {section.heading}
          </h2>
        ) : null}
        {section.paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className={cn(
              "mt-5 text-[1.0625rem] leading-[1.65]",
              ink ? "text-white/75" : "text-muted-text",
            )}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
