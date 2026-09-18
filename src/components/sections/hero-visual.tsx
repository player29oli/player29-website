import Image from "next/image";

export function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-[34rem]"
    >
      <div className="bg-surface absolute inset-x-[12%] top-[8%] h-[72%] rotate-[-6deg] rounded-[22px]" />
      <div className="absolute inset-x-[6%] top-[14%] h-[70%] rotate-[4deg] rounded-[22px] border border-ink/8 bg-white shadow-[0_20px_60px_rgba(17,19,24,0.08)]" />
      <div className="bg-charcoal absolute inset-x-0 bottom-0 h-[78%] overflow-hidden rounded-[22px] shadow-[0_24px_80px_rgba(17,19,24,0.18)]">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="h-2 w-16 rounded-full bg-white/20" />
          <span className="flex gap-1.5">
            <span className="size-2 rounded-full bg-white/25" />
            <span className="size-2 rounded-full bg-white/25" />
            <span className="size-2 rounded-full bg-white/25" />
          </span>
        </div>
        <div className="px-5">
          <div className="mb-4 h-3 w-1/3 rounded-full bg-white/15" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 rounded-[14px] bg-white/8" />
            <div className="h-20 rounded-[14px] bg-white/8" />
            <div className="col-span-2 h-16 rounded-[14px] bg-white/6" />
          </div>
        </div>
        <Image
          src="/brand/player29-device-29.png"
          alt=""
          width={925}
          height={563}
          className="pointer-events-none absolute -right-8 -bottom-10 w-[72%] rotate-[-8deg] opacity-90"
        />
      </div>
      <div className="signal-gradient absolute top-1/2 -left-3 hidden h-24 w-1.5 -translate-y-1/2 rounded-full md:block" />
    </div>
  );
}
