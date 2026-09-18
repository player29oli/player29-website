import Link from "next/link";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { buttonVariants } from "@/components/ui/button";
import { getSiteContent } from "@/lib/content/store";
import { cn } from "@/lib/utils";

export default async function NotFound() {
  const content = await getSiteContent();
  return (
    <>
      <Header
        navigation={content.chrome.navigation}
        cta={content.chrome.headerCta}
      />
      <main
        id="main"
        className="container-site flex flex-1 flex-col items-start justify-center py-24 md:py-32"
      >
        <p className="mt-10 text-sm font-semibold text-ink/55">
          {content.notFound.kicker}
        </p>
        <h1 className="font-display mt-3 max-w-xl text-[clamp(2rem,4vw,3rem)] font-bold">
          {content.notFound.title}
        </h1>
        <p className="text-muted-text mt-4 max-w-md text-[1.0625rem] leading-relaxed">
          {content.notFound.body}
        </p>
        <Link href="/" className={cn(buttonVariants({ size: "cta" }), "mt-8")}>
          {content.notFound.ctaLabel}
        </Link>
      </main>
      <Footer content={content} />
    </>
  );
}
