import type { Metadata } from "next";

import { HomepageSections } from "@/components/sections/homepage-sections";
import { getSiteContent } from "@/lib/content/store";

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: { canonical: "/" },
  };
}

export default async function Home() {
  const content = await getSiteContent();
  return (
    <main id="main" className="flex-1">
      <HomepageSections content={content} />
    </main>
  );
}
