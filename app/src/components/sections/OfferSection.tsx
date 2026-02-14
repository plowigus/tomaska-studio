"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OFFER_STEPS } from "@/app/src/config/constants";
import { Plus } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function OfferSection() {
    const containerRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Wejście nagłówka
        gsap.from(headerRef.current, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
        });

        // Wejście kart - usunięty stagger dla pełnej równości startu
        if (cardsRef.current) {
            gsap.from(Array.from(cardsRef.current.children), {
                y: 40,
                opacity: 0,
                duration: 0.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: cardsRef.current,
                    start: "top 85%",
                },
            });
        }
    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            id="oferta"
            className="px-8 md:px-16 lg:px-24 py-16 md:py-24 bg-alabaster overflow-hidden"
        >
            {/* Nagłówek z pełną czarną linią */}
            <div
                ref={headerRef}
                className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-end gap-8 border-b-2 border-black pb-8"
            >
                <h2 className="text-[clamp(2rem,6vw,5rem)] tracking-tight font-bold uppercase font-serif leading-none text-black">
                    Współpraca
                </h2>
            </div>

            <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-stretch">
                {OFFER_STEPS.map((step) => (
                    <div
                        key={step.id}
                        className="group relative h-[420px] flex flex-col p-8 bg-transparent transition-colors duration-300 cursor-crosshair"
                    >
                        {/* 1. BAZOWY BORDER - Mocny, czarny start */}
                        <div className="absolute inset-0 border border-black/40 group-hover:bg-white transition-all duration-300 pointer-events-none" />

                        {/* 2. BŁYSKAWICZNE LINIE - Brak delay, startują jednocześnie */}
                        <div className="absolute top-0 left-0 h-[3px] w-0 bg-black group-hover:w-full transition-all duration-200 ease-out z-10" />
                        <div className="absolute top-0 right-0 w-[3px] h-0 bg-black group-hover:h-full transition-all duration-200 ease-out z-10" />
                        <div className="absolute bottom-0 right-0 h-[3px] w-0 bg-black group-hover:w-full transition-all duration-200 ease-out z-10" />
                        <div className="absolute bottom-0 left-0 w-[3px] h-0 bg-black group-hover:h-full transition-all duration-200 ease-out z-10" />

                        {/* Plus - Większy kontrast */}
                        <div className="absolute top-4 right-4 opacity-40 group-hover:opacity-100 transition-opacity duration-200 z-20">
                            <Plus size={16} strokeWidth={3} className="text-black" />
                        </div>

                        <div className="relative z-20 h-full flex flex-col">
                            <div className="mb-12">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono font-bold tracking-widest text-black">
                                        {step.id}
                                    </span>
                                    <div className="h-px flex-1 bg-black/30 group-hover:bg-black transition-colors" />
                                </div>
                            </div>

                            <div className="min-h-[80px] flex items-start mb-4 text-black">
                                <h3 className="text-2xl font-serif leading-[1.1] font-bold">
                                    {step.title}
                                </h3>
                            </div>

                            <div className="mt-auto">
                                <p className="text-[14px] font-sans leading-relaxed text-black/80 group-hover:text-black opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 border-t-2 border-black/40 group-hover:border-black pt-4">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}