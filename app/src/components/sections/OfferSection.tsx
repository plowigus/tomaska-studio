"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OFFER_STEPS, type OfferStep } from "@/app/src/config/constants";
import { Plus } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface OfferSectionProps {
    steps?: OfferStep[];
}

export function OfferSection({ steps }: OfferSectionProps) {
    const containerRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    const [hoveredStep, setHoveredStep] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    const displaySteps = steps && steps.length > 0 ? steps : OFFER_STEPS;

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

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
                toggleActions: "play none none none"
            }
        });

        if (cardsRef.current) {
            gsap.from(Array.from(cardsRef.current.children), {
                y: 40,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out",
                clearProps: "all",
                scrollTrigger: {
                    trigger: cardsRef.current,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });

            // Mobile: auto-activate hover state on scroll
            if (isMobile) {
                Array.from(cardsRef.current.children).forEach((card) => {
                    ScrollTrigger.create({
                        trigger: card,
                        start: "top 50%",
                        end: "bottom 30%",
                        onEnter: () => card.classList.add("active"),
                        onLeave: () => card.classList.remove("active"),
                        onEnterBack: () => card.classList.add("active"),
                        onLeaveBack: () => card.classList.remove("active"),
                    });
                });
            }
        }
    }, { scope: containerRef, dependencies: [isMobile] });

    return (
        <section
            ref={containerRef}
            id="oferta"
            className="px-8 md:px-16 lg:px-24 py-16 md:py-24 bg-alabaster overflow-hidden text-charcoal"
        >
            <div ref={headerRef} className="mb-16 md:mb-24 border-b border-black/30 pb-8">
                <h2 className="text-[clamp(2.5rem,5vw,3.5rem)] tracking-tight font-bold uppercase font-serif leading-none">
                    Współpraca
                </h2>
            </div>

            <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 lg:gap-6 items-stretch">
                {displaySteps.map((step) => {
                    return (
                        <div
                            key={step.id}
                            onMouseEnter={() => setHoveredStep(step.id)}
                            onMouseLeave={() => setHoveredStep(null)}
                            className="group relative h-[450px] flex flex-col p-8 bg-transparent transition-colors duration-300 cursor-pointer"
                        >

                            <div className="absolute inset-0 border border-black/30 group-hover:bg-white group-[.active]:bg-white transition-all duration-300 pointer-events-none" />

                            <div className="absolute top-0 left-0 h-[3px] w-0 bg-black group-hover:w-full group-[.active]:w-full transition-all duration-200 ease-out z-10" />
                            <div className="absolute top-0 right-0 w-[3px] h-0 bg-black group-hover:h-full group-[.active]:h-full transition-all duration-200 ease-out z-10" />
                            <div className="absolute bottom-0 right-0 h-[3px] w-0 bg-black group-hover:w-full group-[.active]:w-full transition-all duration-200 ease-out z-10" />
                            <div className="absolute bottom-0 left-0 w-[3px] h-0 bg-black group-hover:h-full group-[.active]:h-full transition-all duration-200 ease-out z-10" />

                            <div className="absolute top-4 right-4 opacity-40 group-hover:opacity-100 group-[.active]:opacity-100 transition-opacity z-20">
                                <Plus size={16} strokeWidth={3} className="text-black" />
                            </div>

                            <div className="relative z-20 h-full flex flex-col text-black">
                                <div className="mb-8 flex items-center gap-3">
                                    <span className="text-xs font-mono font-bold tracking-widest">
                                        {(step as any).step_number || step.id}
                                    </span>
                                    <div className="h-px flex-1 bg-black/30 group-hover:bg-black group-[.active]:bg-black transition-colors" />
                                </div>

                                <div className="h-[120px]">
                                    <h3 className="text-2xl font-serif leading-[1.1] font-bold">
                                        {step.title}
                                    </h3>
                                </div>

                                <p className="text-[15px] mt-1 leading-relaxed text-black/70 transition-all duration-300 border-t border-black/20 group-hover:border-black group-[.active]:border-black pt-4">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
