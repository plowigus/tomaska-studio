import { HeroSection } from "@/app/src/components/sections/HeroSection";
import { AboutSection } from "@/app/src/components/sections/AboutSection";
import { SelectedWorks } from "@/app/src/components/sections/SelectedWorks";
import { OfferSection } from "./src/components/sections/OfferSection";
import { TestimonialsSection } from "./src/components/sections/TestimonialsSection";
import { ContactSection } from "./src/components/sections/ContactSection";
import { getSiteContent, getProjects, getTestimonials, getOfferSteps, getHeroSlides } from "@/app/src/lib/cms";

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
      <AboutSection content={siteContent.about} />
      <OfferSection steps={offerSteps} />
      <SelectedWorks projects={projects} />
      <TestimonialsSection testimonials={testimonials} />
      <ContactSection content={siteContent.contact} />
    </>
  );
}
