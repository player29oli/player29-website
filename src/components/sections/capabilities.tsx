import { capabilities } from "@/data/content";

export function Capabilities() {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="scroll-mt-24 border-y border-ink/6 bg-surface/50 py-20 md:py-32"
    >
      <div className="container-site">
        <div className="mb-12 max-w-xl md:mb-16">
          <p className="mb-4 text-sm font-semibold text-ink/60">Capabilities</p>
          <h2
            id="capabilities-heading"
            className="font-display text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.15] font-bold"
          >
            What we bring to a product.
          </h2>
        </div>
        <ol className="grid gap-0 md:grid-cols-2">
          {capabilities.map((item, index) => (
            <li
              key={item.number}
              className={`border-ink/8 py-8 md:p-10 md:py-12 ${
                index % 2 === 0 ? "md:border-r" : ""
              } ${index < 2 ? "md:border-b" : ""} ${
                index < capabilities.length - 1 ? "border-b md:border-b-0" : ""
              } ${index < 2 ? "" : "md:border-t"}`}
            >
              <p className="font-display mb-4 text-sm font-semibold tracking-wide text-ink/45">
                {item.number}
              </p>
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
