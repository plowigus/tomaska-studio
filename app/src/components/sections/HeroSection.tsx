"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { HERO_PROJECTS } from "@/app/src/config/constants";
import { CarouselCursor } from "@/app/src/components/ui/CarouselCursor";

export function HeroSection() {
    const containerRef = useRef<HTMLElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const [sliderContainer, setSliderContainer] = useState<HTMLDivElement | null>(null);

    const { contextSafe } = useGSAP({ scope: containerRef });

    const [emblaRef] = useEmblaCarousel(
        { loop: true, dragFree: true },
        [AutoScroll({ playOnInit: true, speed: 1, stopOnInteraction: false })]
    );

    const allProjects = [...HERO_PROJECTS, ...HERO_PROJECTS];
    const xTo = useRef<((value: number) => void) | null>(null);
    const yTo = useRef<((value: number) => void) | null>(null);

    useGSAP(() => {
        gsap.from(textContainerRef.current, {
            y: 30,
            opacity: 0,
            duration: 1,
            delay: 0.5,
            ease: "power2.out"
        });

        if (overlayRef.current) {
            gsap.set(overlayRef.current, { "--x": 0, "--y": 0, "--radius": 0 });
            xTo.current = gsap.quickTo(overlayRef.current, "--x", { duration: 0.1, ease: "power3.out" });
            yTo.current = gsap.quickTo(overlayRef.current, "--y", { duration: 0.1, ease: "power3.out" });
        }
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


    const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
        if (!textContainerRef.current || !xTo.current || !yTo.current) return;
        const rect = textContainerRef.current.getBoundingClientRect();
        const OFFSET = 80;
        xTo.current(e.clientX - rect.left + OFFSET);
        yTo.current(e.clientY - rect.top + OFFSET);
    });

    const handleMouseEnter = contextSafe(() => {
        if (overlayRef.current) gsap.to(overlayRef.current, { "--radius": 140, duration: 0.3, ease: "power2.out" });
    });

    const handleMouseLeave = contextSafe(() => {
        if (overlayRef.current) gsap.to(overlayRef.current, { "--radius": 0, duration: 0.3, ease: "power2.in" });
    });

    const TitleText = ({ className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h1 className={`text-5xl lg:text-5xl text-center leading-[1.2] tracking-tight font-serif max-w-3xl mx-auto ${className}`} {...props}>
            „Tworzę <em className="italic">przestrzeń</em> idealną dla klienta, <br />
            poznając jego <em className="italic">osobowość</em><br />
            oraz indywidualne potrzeby."
        </h1>
    );

    return (
        <section ref={containerRef} className="relative w-full bg-alabaster h-dvh flex flex-col overflow-hidden pt-32">
            <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 items-center gap-4">
                <div
                    ref={textContainerRef}
                    className="relative w-full max-w-screen-2xl mx-auto p-10 lg:p-16 rounded-2xl"
                >
                    <TitleText
                        className="relative z-0 text-charcoal cursor-none"
                        onMouseMove={handleMouseMove}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    />
                    <div
                        ref={overlayRef}
                        className="absolute -inset-20 flex items-center justify-center pointer-events-none z-10 text-white bg-black"
                        style={{
                            clipPath: "circle(calc(var(--radius) * 1px) at calc(var(--x) * 1px) calc(var(--y) * 1px))",
                            WebkitClipPath: "circle(calc(var(--radius) * 1px) at calc(var(--x) * 1px) calc(var(--y) * 1px))",
                        }}
                    >
                        <div className="flex items-center justify-center text-center">
                            <TitleText />
                        </div>
                    </div>
                </div>
            </div>
            <CarouselCursor container={sliderContainer} />
            <div
                ref={setSliderContainer}
                className="relative w-screen overflow-hidden cursor-none"
            >
                <div ref={emblaRef} className="overflow-hidden w-full">
                    <div className="flex">
                        {allProjects.map((project, index) => (
                            <div key={`${project.location}-${index}`} className="flex-[0_0_80%] md:flex-[0_0_40%] lg:flex-[0_0_33.333%] min-w-0 pl-1">
                                <div className="relative group/image">
                                    <div className="relative h-[300px] overflow-hidden bg-gray-200">
                                        <Image
                                            src={project.image}
                                            alt={project.location}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover pointer-events-none select-none group-hover/image:scale-105 transition-transform duration-700"
                                            priority={index < 3}
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