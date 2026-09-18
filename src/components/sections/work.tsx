import { ContentImage } from "@/components/content-image";
import type { WorkSection } from "@/lib/content/schema";

function ProductFrame({ section }: { section: WorkSection }) {
  return (
    <div
      aria-hidden="true"
      className="bg-charcoal overflow-hidden rounded-[22px] p-4 shadow-[0_24px_80px_rgba(17,19,24,0.16)] md:p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <span className="h-2 w-16 rounded-full bg-white/20" />
        {section.frame.badge ? (
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
            {section.frame.badge}
          </span>
        ) : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {section.frame.cards.map((card, index) => (
          <div key={`${card.title}-${index}`} className="rounded-[16px] bg-white/8 p-4">
            <p className="text-sm font-semibold text-white">{card.title}</p>
            <div className="mt-4 space-y-2">
              <span className="block h-2 w-3/4 rounded-full bg-white/15" />
              <span className="block h-2 w-1/2 rounded-full bg-white/10" />
            </div>
          </div>
        ))}
      </div>
      {section.frame.footerLabel || section.frame.footerCopy ? (
        <div className="mt-4 rounded-[16px] bg-white/6 p-4">
          {section.frame.footerLabel ? (
            <p className="text-xs font-semibold text-white/50">
              {section.frame.footerLabel}
            </p>
          ) : null}
          {section.frame.footerCopy ? (
            <p className="mt-2 text-sm text-white/85">{section.frame.footerCopy}</p>
          ) : null}
          <div className="signal-gradient mt-4 h-1 w-16 rounded-full" />
        </div>
      ) : null}
    </div>
  );
}

export function Work({ section }: { section: WorkSection }) {
  const title = section.name || section.status;
  const links = [
    section.launchUrl ? { href: section.launchUrl, label: "Open product" } : null,
    section.appStoreUrl ? { href: section.appStoreUrl, label: "App Store" } : null,
    section.caseStudyUrl ? { href: section.caseStudyUrl, label: "Case study" } : null,
  ].filter((item): item is { href: string; label: string } => Boolean(item));

  return (
    <section
      id={section.anchor || "work"}
      aria-labelledby="work-heading"
      className="scroll-mt-24 py-20 md:py-32"
    >
      <div className="container-site grid items-start gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          {section.eyebrow ? (
            <p className="mb-4 text-sm font-semibold text-ink/60">{section.eyebrow}</p>
          ) : null}
          <h2
            id="work-heading"
            className="font-display text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.15] font-bold"
          >
            {title}
          </h2>
          {section.partner ? (
            <p className="mt-3 text-sm font-semibold text-ink/65">{section.partner}</p>
          ) : null}
          {section.description ? (
            <p className="text-muted-text mt-5 max-w-[36rem] text-[1.0625rem] leading-[1.65]">
              {section.description}
            </p>
          ) : null}
          {section.role ? (
            <p className="mt-6 text-sm font-semibold text-ink/70">{section.role}</p>
          ) : null}
          {links.length > 0 ? (
            <ul className="mt-6 flex flex-col gap-2">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm font-semibold text-ink underline-offset-4 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="md:col-span-7">
          {section.screenshot ? (
            <ContentImage
              src={section.screenshot}
              alt={section.screenshotAlt || title}
              width={1200}
              height={800}
              className="h-auto w-full rounded-[22px]"
            />
          ) : (
            <ProductFrame section={section} />
          )}
        </div>
      </div>
    </section>
  );
}
