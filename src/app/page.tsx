import { About } from "@/components/sections/about";
import { Approach } from "@/components/sections/approach";
import { Capabilities } from "@/components/sections/capabilities";
import { Closing } from "@/components/sections/closing";
import { Hero } from "@/components/sections/hero";
import { Intro } from "@/components/sections/intro";
import { Work } from "@/components/sections/work";

export default function Home() {
  return (
    <main id="main" className="flex-1">
      <Hero />
      <Intro />
      <Work />
      <Capabilities />
      <Approach />
      <About />
      <Closing />
    </main>
  );
}
