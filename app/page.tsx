import { HeroSection } from "@/app/src/components/sections/HeroSection";
import { DynamicSections } from "@/app/src/components/DynamicSections";
import { getSiteContent, getProjects, getTestimonials, getOfferSteps, getHeroSlides } from "@/app/src/lib/cms";

export const dynamic = "force-dynamic";

type CMSContent = Record<string, Record<string, string>>;

export default async function Home() {
  const [content, projects, testimonials, offerSteps, heroSlides] = await Promise.all([
    getSiteContent().catch(() => ({} as CMSContent)),
    getProjects().catch(() => []),
    getTestimonials().catch(() => []),
    getOfferSteps().catch(() => []),
    getHeroSlides().catch(() => [])
  ]);

  const siteContent = content as CMSContent;

  return (
    <>
      <HeroSection content={siteContent.hero} slides={heroSlides} />
      <DynamicSections
        aboutContent={siteContent.about}
        offerSteps={offerSteps}
        projects={projects}
        testimonials={testimonials}
        contactContent={siteContent.contact}
      />
    </>
  );
}
