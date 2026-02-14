"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { HERO_PROJECTS } from "@/app/src/config/constants";

export function HeroSection() {
    const containerRef = useRef<HTMLElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

    const { contextSafe } = useGSAP({ scope: containerRef });

    const [emblaRef] = useEmblaCarousel(
        { loop: true, dragFree: true },
        [AutoScroll({ playOnInit: true, speed: 1, stopOnInteraction: false })]
    );

    const allProjects = [...HERO_PROJECTS, ...HERO_PROJECTS];

    // GSAP quickTo refs for optimized performance
    const xTo = useRef<((value: number) => void) | null>(null);
    const yTo = useRef<((value: number) => void) | null>(null);

    useGSAP(() => {
        // Initial entrance animations
        gsap.from(textContainerRef.current, { y: 30, opacity: 0, duration: 1, delay: 0.5, ease: "power2.out" });
        gsap.from(sliderRef.current, { y: 40, opacity: 0, duration: 1, delay: 0.8, ease: "power2.out" });

        // Setup spotlight machinery
        if (overlayRef.current) {
            // Set initial CSS variables to avoid easy flashes or layout jumps
            gsap.set(overlayRef.current, { "--x": 0, "--y": 0, "--radius": 0 });

            // Initialize quickTo for super-fast mouse tracking
            xTo.current = gsap.quickTo(overlayRef.current, "--x", { duration: 0.1, ease: "power3.out" });
            yTo.current = gsap.quickTo(overlayRef.current, "--y", { duration: 0.1, ease: "power3.out" });
        }
    }, { scope: containerRef });

    const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
        if (!textContainerRef.current || !xTo.current || !yTo.current) return;

        const rect = textContainerRef.current.getBoundingClientRect();
        // Calculate relative coordinates + offset for the expanded container
        // -inset-20 = 5rem = 80px expansion on each side
        const OFFSET = 80;
        const x = e.clientX - rect.left + OFFSET;
        const y = e.clientY - rect.top + OFFSET;

        // Feed the optimized GSAP setters
        xTo.current(x);
        yTo.current(y);
    });

    const handleMouseEnter = contextSafe(() => {
        if (!overlayRef.current) return;
        // Expand the spotlight
        gsap.to(overlayRef.current, {
            "--radius": 140, // Reduced radius as requested
            duration: 0.3,
            ease: "power2.out"
        });
    });

    const handleMouseLeave = contextSafe(() => {
        if (!overlayRef.current) return;
        // Collapse the spotlight
        gsap.to(overlayRef.current, {
            "--radius": 0,
            duration: 0.3,
            ease: "power2.in"
        });
    });

    // Separated components for precise layout control
    const TitleText = ({ className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h1
            className={`text-5xl lg:text-5xl text-center leading-[1.2] tracking-tight font-serif max-w-3xl mx-auto ${className}`}
            {...props}
        >
            „Tworzę <em className="italic">przestrzeń</em> idealną dla klienta, <br />
            poznając jego <em className="italic">osobowość</em><br />
            oraz indywidualne potrzeby."
        </h1>
    );

    const AuthorText = ({ className = "" }: { className?: string }) => (
        <p className={`text-center text-lg tracking-wide opacity-70 ${className}`}>
            Joanna Tomaska
        </p>
    );

    return (
        <section ref={containerRef} className="relative w-full bg-alabaster h-dvh flex flex-col overflow-hidden pt-32">

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 items-center gap-4">

                {/* 
                    SPOTLIGHT CONTAINER
                    Wraps strictly the reference element (H1) for precise spotlight positioning.
                    cursor-none only applies here.
                */}
                <div
                    ref={textContainerRef}
                    className="no-custom-cursor relative w-full max-w-screen-2xl mx-auto p-10 lg:p-16 rounded-2xl" // removed cursor-none
                >
                    {/* Layer 1: Base (Dark) - NOW INTERACTIVE */}
                    <TitleText
                        className="relative z-0 text-charcoal cursor-none" // Base text determines cursor behavior. Cursor is hidden ON the text.
                        onMouseMove={handleMouseMove}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    />

                    {/* Layer 2: Overlay (White on Black) - Revealed by Clip Path */}
                    {/* 
                        Expanded by -inset-20 (80px) to prevent clip-path cutoff.
                        p-20 matches offset to center content.
                    */}
                    <div
                        ref={overlayRef}
                        className="absolute -inset-20 flex items-center justify-center pointer-events-none z-10 text-white bg-black"
                        style={{
                            // Using clip-path with CSS variables for the spotlight effect.
                            clipPath: "circle(calc(var(--radius) * 1px) at calc(var(--x) * 1px) calc(var(--y) * 1px))",
                            WebkitClipPath: "circle(calc(var(--radius) * 1px) at calc(var(--x) * 1px) calc(var(--y) * 1px))",
                        }}
                    >
                        {/* Wrapper to center text within the expanded overlay */}
                        <div className="flex items-center justify-center text-center">
                            <TitleText />
                        </div>
                    </div>

                    {/* Mobile Fallback or just standard overlay for all? 
                        The hidden md:flex above suggests I might be hiding it on mobile. 
                        Actually, spotlight effects on touch can be weird. 
                        I'll remove hidden md:flex and keep it standard for now unless requested.
                        Wait, I added hidden md:flex by mistake in thought process? No, I'll keep it visible always.
                    */}
                </div>

                {/* Author Name - Outside the spotlight influence */}


            </div>

            {/* Carousel Section */}
            <div
                ref={sliderRef}
                className="w-screen overflow-hidden cursor-grab active:cursor-grabbing" // removed pb-8
            >
                <div ref={emblaRef} className="overflow-hidden w-full">
                    <div className="flex">
                        {allProjects.map((project, index) => (
                            <div
                                key={`${project.location}-${index}`}
                                className="flex-[0_0_80%] md:flex-[0_0_40%] lg:flex-[0_0_33.333%] min-w-0 pl-1" // added pl-1 (0.25rem gap)
                            >
                                <div className="relative group/image">
                                    <div className="relative h-[300px] overflow-hidden bg-gray-200">
                                        <Image
                                            src={project.image}
                                            alt={`Projekt wnętrza w: ${project.location}`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover group-hover/image:scale-105 transition-transform duration-700 pointer-events-none select-none"
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