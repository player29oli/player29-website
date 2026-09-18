import { ContentImage } from "@/components/content-image";
import type { MediaSection } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

export function MediaBlock({ section }: { section: MediaSection }) {
  const headingId = `${section.id}-heading`;
  return (
    <section
      id={section.anchor || undefined}
      aria-labelledby={section.heading ? headingId : undefined}
      className="py-20 md:py-28"
    >
      <div
        className={cn(
          "container-site grid gap-8",
          section.layout === "split" && "md:grid-cols-12 md:items-center",
        )}
      >
        <div className={section.layout === "split" ? "md:col-span-5" : undefined}>
          {section.eyebrow ? (
            <p className="mb-4 text-sm font-semibold text-ink/60">{section.eyebrow}</p>
          ) : null}
          {section.heading ? (
            <h2
              id={headingId}
              className="font-display text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.15] font-bold"
            >
              {section.heading}
            </h2>
          ) : null}
          {section.caption && section.layout === "split" ? (
            <p className="text-muted-text mt-5 text-[1.0625rem] leading-[1.65]">
              {section.caption}
            </p>
          ) : null}
        </div>
        <div className={section.layout === "split" ? "md:col-span-7" : undefined}>
          {section.imageSrc ? (
            <ContentImage
              src={section.imageSrc}
              alt={section.imageAlt}
              width={1400}
              height={900}
              className="h-auto w-full rounded-[22px]"
            />
          ) : (
            <div className="bg-surface aspect-[16/10] rounded-[22px]" />
          )}
          {section.caption && section.layout === "full" ? (
            <p className="text-muted-text mt-4 text-sm">{section.caption}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
