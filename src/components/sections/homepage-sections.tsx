import { About } from "@/components/sections/about";
import { Approach } from "@/components/sections/approach";
import { Capabilities } from "@/components/sections/capabilities";
import { Closing } from "@/components/sections/closing";
import { Hero } from "@/components/sections/hero";
import { Intro } from "@/components/sections/intro";
import { MediaBlock } from "@/components/sections/media-block";
import { RichText } from "@/components/sections/rich-text";
import { Work } from "@/components/sections/work";
import type { SiteContent } from "@/lib/content/schema";

export function HomepageSections({ content }: { content: SiteContent }) {
  return (
    <>
      {content.sections.map((section) => {
        switch (section.type) {
          case "hero":
            return <Hero key={section.id} section={section} />;
          case "intro":
            return <Intro key={section.id} section={section} />;
          case "work":
            return <Work key={section.id} section={section} />;
          case "capabilities":
            return <Capabilities key={section.id} section={section} />;
          case "approach":
            return <Approach key={section.id} section={section} />;
          case "about":
            return <About key={section.id} section={section} />;
          case "closing":
            return (
              <Closing
                key={section.id}
                section={section}
                email={content.site.email}
                name={content.site.name}
              />
            );
          case "richText":
            return <RichText key={section.id} section={section} />;
          case "media":
            return <MediaBlock key={section.id} section={section} />;
          default:
            return null;
        }
      })}
    </>
  );
}
