import { Logo } from "@/components/brand/logo";

export default function Home() {
  return (
    <main id="main" className="flex-1">
      <section className="container-site grid min-h-[70vh] items-center gap-12 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-7">
          <p className="text-muted-text mb-5 text-sm font-semibold tracking-wide">
            Player29
          </p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] font-bold">
            Digital products built for sport, media and the screen.
          </h1>
        </div>
        <div className="md:col-span-5">
          <div className="bg-surface aspect-[4/3] rounded-[22px] p-8">
            <Logo variant="light" href="" />
          </div>
        </div>
      </section>
    </main>
  );
}
