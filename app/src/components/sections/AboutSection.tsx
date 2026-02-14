"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
    const containerRef = useRef<HTMLElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLHRElement>(null);
    const imagesGridRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const textElements = textContainerRef.current?.children;
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
            },
        });

        tl.from(lineRef.current, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1,
            ease: "power3.inOut",
        })
            .from(textElements ? Array.from(textElements) : [], {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
            }, "-=0.5");

        gsap.from(imagesGridRef.current?.children || [], {
            y: 100,
            opacity: 0,
            duration: 1,
            delay: 0.6,
            stagger: 0.3,
            ease: "power3.out",
            scrollTrigger: {
                trigger: imagesGridRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse",
            },
        });

        gsap.to(imagesGridRef.current, {
            y: -50,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
        });
    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            id="o-mnie"
            className="px-8 md:px-16 lg:px-24 py-12 md:py-24 bg-alabaster overflow-hidden"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-[1600px] mx-auto items-start">
                <div className="flex flex-col justify-start">
                    <div className="mb-12">
                        <div ref={textContainerRef}>
                            <h2 className="text-[clamp(2rem,8vw,6rem)] tracking-tight font-bold uppercase font-serif leading-none">
                                O mnie
                            </h2>
                        </div>
                        <hr ref={lineRef} className="mt-8 w-full h-px bg-[#333] border-0 origin-left" />
                    </div>

                    <div ref={textContainerRef} className="opacity-100">
                        <p className="text-base md:text-lg leading-relaxed opacity-70 max-w-xl font-sans mb-6">
                            Jako absolwentka wrocławskiej ASP i założycielka TOMASKA STUDIO, patrzę na architekturę dwutorowo. Fascynują mnie wnętrza budynków, ale kluczem do ich zrozumienia są dla mnie wnętrza ludzi, którzy w nich mieszkają.
                        </p>
                        <p className="text-base md:text-lg leading-relaxed opacity-70 max-w-xl font-sans mb-6">
                            Wierzę, że przestrzeń ma realny wpływ na nasze życie. Dlatego każdy projekt zaczynam od poznania Twoich potrzeb, pasji i stylu bycia. Nie narzucam wizji – łączę Twoje oczekiwania z moim doświadczeniem.
                        </p>
                        <p className="text-base md:text-lg leading-relaxed opacity-70 max-w-xl font-sans">
                            Tworzę projekty ponadczasowe. Łączę fakturę, kolor i światło z funkcjonalnością. Efekt? Wnętrze, które jest nie tylko inspirujące i piękne, ale przede wszystkim wygodne. To ma być Twój azyl.
                        </p>
                    </div>
                </div>

                <div ref={imagesGridRef} className="grid grid-cols-2 gap-4 auto-rows-[200px] md:auto-rows-[300px]">
                    <div className="relative w-full h-full overflow-hidden bg-gray-200">
                        <Image
                            src="https://images.unsplash.com/photo-1728032648596-b969c7810937?q=80&w=1080&auto=format&fit=crop"
                            alt="Architektoniczny detal schodów"
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                    <div className="relative w-full h-full row-span-2 overflow-hidden bg-gray-200">
                        <Image
                            src="https://images.unsplash.com/photo-1760623139051-1358f93b1722?q=80&w=1080&auto=format&fit=crop"
                            alt="Minimalistyczne wnętrze"
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                    <div className="relative w-full h-full overflow-hidden bg-gray-200">
                        <Image
                            src="https://images.unsplash.com/photo-1762419757069-c0a1a31f943c?q=80&w=1080&auto=format&fit=crop"
                            alt="Luksusowe wnętrze"
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}