"use client";

import dynamic from "next/dynamic";
import type { OfferStep, Testimonial, Project, HeroSlide } from "@/app/src/lib/cms";

const AboutSection = dynamic(() => import("@/app/src/components/sections/AboutSection").then(m => m.AboutSection), { ssr: false });
const OfferSection = dynamic(() => import("./sections/OfferSection").then(m => m.OfferSection), { ssr: false });
const SelectedWorks = dynamic(() => import("@/app/src/components/sections/SelectedWorks").then(m => m.SelectedWorks), { ssr: false });
const TestimonialsSection = dynamic(() => import("./sections/TestimonialsSection").then(m => m.TestimonialsSection), { ssr: false });
const ContactSection = dynamic(() => import("./sections/ContactSection").then(m => m.ContactSection), { ssr: false });

interface DynamicSectionsProps {
    aboutContent?: Record<string, string>;
    offerSteps: OfferStep[];
    projects: Project[];
    testimonials: Testimonial[];
    contactContent?: Record<string, string>;
}

export function DynamicSections({
    aboutContent,
    offerSteps,
    projects,
    testimonials,
    contactContent,
}: DynamicSectionsProps) {
    return (
        <>
            <AboutSection content={aboutContent} />
            <OfferSection steps={offerSteps} />
            <SelectedWorks projects={projects} />
            <TestimonialsSection testimonials={testimonials} />
            <ContactSection content={contactContent} />
        </>
    );
}
