"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { HERO_PROJECTS } from "@/app/src/config/constants";
import { CarouselCursor } from "@/app/src/components/ui/CarouselCursor";
import type { HeroSlide } from "@/app/src/lib/cms";

interface HeroSectionProps {
    content?: Record<string, string>;
    slides?: HeroSlide[];
}

export function HeroSection({ content, slides }: HeroSectionProps) {
    const containerRef = useRef<HTMLElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);

    const [sliderContainer, setSliderContainer] = useState<HTMLDivElement | null>(null);

    const [emblaRef] = useEmblaCarousel(
        { loop: true, dragFree: true },
        [AutoScroll({ playOnInit: true, speed: 1, stopOnInteraction: false })]
    );

    const displaySlides = slides && slides.length > 0 ? slides : HERO_PROJECTS;
    const allProjects = [...displaySlides, ...displaySlides];

    const quote = content?.quote || "„Tworzę przestrzeń idealną dla klienta, poznając jego osobowość oraz indywidualne potrzeby.\"";

    useGSAP(() => {
        gsap.from(textContainerRef.current, {
            y: 30,
            opacity: 0,
            duration: 1,
            delay: 0.5,
            ease: "power2.out"
        });
    }, { scope: containerRef });

    useGSAP(() => {
        if (sliderContainer) {
            gsap.from(sliderContainer, {
                y: 40,
                opacity: 0,
                duration: 1,
                delay: 0.8,
                ease: "power2.out"
            });
        }
    }, {
        scope: containerRef,
        dependencies: [sliderContainer]
    });

    return (
        <section ref={containerRef} className="relative w-full bg-alabaster h-dvh flex flex-col overflow-hidden pt-32 text-charcoal">
            <div className="absolute top-0 left-0 right-0 bg-alabaster z-50" style={{ height: 'env(safe-area-inset-top, 0px)' }} />
            <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 items-center gap-4">
                <div
                    ref={textContainerRef}
                    className="relative w-full max-w-screen-2xl mx-auto p-0 lg:p-16 rounded-2xl"
                >
                    <h1 className="sr-only">Joanna Tomaska - Architekt Wnętrz, Ekskluzywne Projektowanie Wnętrz</h1>
                    <h2 className="text-3xl lg:text-5xl text-center leading-[1.2] tracking-tight font-serif max-w-6xl lg:max-w-3xl mx-auto text-charcoal">
                        {quote.split(',').map((part, i, arr) => (
                            <span key={i}>
                                {part}{i < arr.length - 1 ? ',' : ''}
                                {i < arr.length - 1 && <br className="hidden lg:block" />}
                            </span>
                        ))}
                    </h2>
                </div>
            </div>
            <CarouselCursor container={sliderContainer} />
            <div
                ref={setSliderContainer}
                className="relative w-screen overflow-hidden cursor-none"
            >
                <div ref={emblaRef} className="overflow-hidden w-full">
                    <div className="flex">
                        {allProjects.map((project: any, index) => (
                            <div key={`${project.seo_alt || project.seoAlt}-${index}`} className="flex-[0_0_80%] md:flex-[0_0_40%] lg:flex-[0_0_33.333%] min-w-0 pl-1">
                                <div className="relative group/image">
                                    <div className="relative h-[300px] overflow-hidden bg-gray-200">
                                        <Image
                                            src={project.image}
                                            alt={project.seo_alt || project.seoAlt}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover pointer-events-none select-none group-hover/image:scale-105 transition-transform duration-700"
                                            priority={index === 0}
                                            fetchPriority={index === 0 ? "high" : undefined}
                                            loading={index === 0 ? "eager" : "lazy"}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
