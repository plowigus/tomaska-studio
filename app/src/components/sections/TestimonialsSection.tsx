"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/app/src/config/constants";
import type { Testimonial } from "@/app/src/lib/cms";

gsap.registerPlugin(ScrollTrigger);

const GAP = 20; // gap-5 = 1.25rem = 20px

interface TestimonialsSectionProps {
    testimonials?: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
    const containerRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : TESTIMONIALS;
    const total = displayTestimonials.length;

    const [visibleCount, setVisibleCount] = useState(3);

    useEffect(() => {
        const update = () => {
            if (window.innerWidth >= 1024) setVisibleCount(2);
            else if (window.innerWidth >= 768) setVisibleCount(2);
            else setVisibleCount(1);
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const maxIndex = Math.max(0, total - visibleCount);

    // GSAP scroll-triggered entrance
    useGSAP(() => {
        gsap.from(headerRef.current, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
            },
        });

        if (trackRef.current) {
            gsap.from(trackRef.current, {
                y: 40,
                opacity: 0,
                duration: 0.6,
                delay: 0.2,
                ease: "power2.out",
                clearProps: "all",
                scrollTrigger: {
                    trigger: trackRef.current,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
            });
        }
    }, { scope: containerRef });

    // Slide animation — compute pixel offset from DOM
    useEffect(() => {
        if (!sliderRef.current || !trackRef.current) return;
        const viewportWidth = trackRef.current.getBoundingClientRect().width;
        const cardWidth = (viewportWidth - GAP * (visibleCount - 1)) / visibleCount;
        const offset = current * (cardWidth + GAP);

        gsap.to(sliderRef.current, {
            x: -offset,
            duration: 0.5,
            ease: "power2.out",
        });
    }, [current, visibleCount]);

    const goTo = useCallback((index: number) => {
        setCurrent(Math.min(index, maxIndex));
    }, [maxIndex]);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % (maxIndex + 1));
    }, [maxIndex]);

    const prev = useCallback(() => {
        setCurrent((prev) => (prev - 1 + maxIndex + 1) % (maxIndex + 1));
    }, [maxIndex]);

    // Autoplay
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion || isPaused) {
            if (autoplayRef.current) clearInterval(autoplayRef.current);
            return;
        }

        autoplayRef.current = setInterval(() => {
            setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
        }, 5000);
        return () => {
            if (autoplayRef.current) clearInterval(autoplayRef.current);
        };
    }, [isPaused, maxIndex]);

    const cardWidth = `calc((100% - ${GAP * (visibleCount - 1)}px) / ${visibleCount})`;

    return (
        <section
            ref={containerRef}
            id="opinie"
            className="px-8 md:px-16 lg:px-24 py-16 md:py-24 bg-alabaster overflow-hidden text-charcoal"
        >
            <div ref={headerRef} className="mb-12 md:mb-16 border-b border-black/30 pb-6">
                <h2 className="text-[clamp(2.5rem,5vw,3.5rem)] tracking-tight font-bold uppercase font-serif leading-none">
                    Opinie
                </h2>
            </div>

            <div
                ref={trackRef}
                className="relative max-w-[1600px] mx-auto"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Slider viewport */}
                <div className="overflow-hidden">
                    <div
                        ref={sliderRef}
                        className="flex"
                        style={{ gap: GAP, willChange: "transform" }}
                    >
                        {displayTestimonials.map((t) => (
                            <div
                                key={t.id}
                                className="group relative flex flex-col p-6 md:p-8 border border-black/40 hover:border-black bg-white/60 hover:bg-white transition-all duration-500 ease-out shrink-0"
                                style={{ width: cardWidth }}
                            >
                                {/* Decorative quote */}
                                <Quote
                                    size={32}
                                    strokeWidth={1}
                                    className="text-black/20 mb-6 shrink-0"
                                />

                                {/* Quote text */}
                                <blockquote className="flex-1 mb-8">
                                    <p className="text-lg md:text-xl leading-relaxed font-serif italic">
                                        &ldquo;{t.quote}&rdquo;
                                    </p>
                                </blockquote>

                                {/* Author */}
                                <div className="border-t border-black/30 pt-5 mt-auto">
                                    <p className="text-sm font-bold tracking-wide">
                                        {t.name}
                                    </p>
                                    <p className="text-xs tracking-widest uppercase opacity-50 mt-1">
                                        {t.project}
                                    </p>
                                </div>

                                {/* Hover accent line */}
                                <div className="absolute top-0 left-0 h-[3px] w-0 bg-black group-hover:w-full transition-all duration-500 ease-out" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation controls */}
                <div className="flex items-center justify-center gap-6 mt-10 md:mt-12">
                    <button
                        onClick={prev}
                        aria-label="Poprzednia opinia"
                        className="cursor-pointer p-3 border border-black/40 hover:border-black hover:bg-black hover:text-white text-black transition-all duration-300"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {/* Dot indicators */}
                    <div className="flex items-center gap-2">
                        {Array.from({ length: maxIndex + 1 }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                aria-label={`Przejdź do opinii ${i + 1}`}
                                className={`
                                    cursor-pointer h-2 rounded-full transition-all duration-300
                                    ${i === current
                                        ? "bg-black w-6"
                                        : "bg-black/25 hover:bg-black/50 w-2"
                                    }
                                `}
                            />
                        ))}
                    </div>

                    <button
                        onClick={next}
                        aria-label="Następna opinia"
                        className="cursor-pointer p-3 border border-black/40 hover:border-black hover:bg-black hover:text-white text-black transition-all duration-300"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}
