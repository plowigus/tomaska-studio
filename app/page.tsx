import { HeroSection } from "@/app/src/components/sections/HeroSection";
import { AboutSection } from "@/app/src/components/sections/AboutSection";
import { SelectedWorks } from "@/app/src/components/sections/SelectedWorks";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SelectedWorks />
    </>
  );
}
