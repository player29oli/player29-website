import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main
      id="main"
      className="container-site flex flex-1 flex-col items-start justify-center py-24 md:py-32"
    >
      <Logo variant="light" />
      <p className="mt-10 text-sm font-semibold text-ink/55">404</p>
      <h1 className="font-display mt-3 max-w-xl text-[clamp(2rem,4vw,3rem)] font-bold">
        This page is not here.
      </h1>
      <p className="text-muted-text mt-4 max-w-md text-[1.0625rem] leading-relaxed">
        The address may be mistyped, or the page may have moved. The homepage
        is the best place to start again.
      </p>
      <Link
        href="/"
        className={cn(buttonVariants({ size: "cta" }), "mt-8")}
      >
        Go to the homepage
      </Link>
    </main>
  );
}
