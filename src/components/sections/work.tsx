import { featuredWork } from "@/data/content";

function ProductFrame() {
  return (
    <div
      aria-hidden="true"
      className="bg-charcoal overflow-hidden rounded-[22px] p-4 shadow-[0_24px_80px_rgba(17,19,24,0.16)] md:p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <span className="h-2 w-16 rounded-full bg-white/20" />
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
          In development
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {["Decide", "Replay", "Play with friends"].map((label) => (
          <div
            key={label}
            className="rounded-[16px] bg-white/8 p-4"
          >
            <p className="text-sm font-semibold text-white">{label}</p>
            <div className="mt-4 space-y-2">
              <span className="block h-2 w-3/4 rounded-full bg-white/15" />
              <span className="block h-2 w-1/2 rounded-full bg-white/10" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-[16px] bg-white/6 p-4">
        <p className="text-xs font-semibold text-white/50">
          Next decision
        </p>
        <p className="mt-2 text-sm text-white/85">
          A meaningful choice, not a menu of chores.
        </p>
        <div className="signal-gradient mt-4 h-1 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function Work() {
  const title = featuredWork.name || featuredWork.status;

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="scroll-mt-24 py-20 md:py-32"
    >
      <div className="container-site grid items-start gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <p className="mb-4 text-sm font-semibold text-ink/60">Work</p>
          <h2
            id="work-heading"
            className="font-display text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.15] font-bold"
          >
            {title}
          </h2>
          <p className="text-muted-text mt-5 max-w-[36rem] text-[1.0625rem] leading-[1.65]">
            {featuredWork.description}
          </p>
          <p className="mt-6 text-sm font-semibold text-ink/70">
            {featuredWork.role}
          </p>
        </div>
        <div className="md:col-span-7">
          <ProductFrame />
        </div>
      </div>
    </section>
  );
}
