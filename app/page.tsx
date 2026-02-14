import { HeroSection } from "@/app/src/components/sections/HeroSection";
import { AboutSection } from "@/app/src/components/sections/AboutSection";
import { SelectedWorks } from "@/app/src/components/sections/SelectedWorks";
import { OfferSection } from "./src/components/sections/OfferSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <OfferSection />
      <SelectedWorks />
    </>
  );
}
