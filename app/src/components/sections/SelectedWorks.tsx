"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SELECTED_WORKS } from "@/app/src/config/constants";
import { ProjectModal } from "@/app/src/components/ui/ProjectModal";

gsap.registerPlugin(ScrollTrigger);

export function SelectedWorks() {
    const containerRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLHRElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const [selectedProject, setSelectedProject] = useState<typeof SELECTED_WORKS[number] | null>(null);

    const handleNextProject = () => {
        if (!selectedProject) return;
        const currentIndex = SELECTED_WORKS.findIndex(p => p.id === selectedProject.id);
        const nextIndex = (currentIndex + 1) % SELECTED_WORKS.length;
        setSelectedProject(SELECTED_WORKS[nextIndex]);
    };

    const handlePrevProject = () => {
        if (!selectedProject) return;
        const currentIndex = SELECTED_WORKS.findIndex(p => p.id === selectedProject.id);
        const prevIndex = (currentIndex - 1 + SELECTED_WORKS.length) % SELECTED_WORKS.length;
        setSelectedProject(SELECTED_WORKS[prevIndex]);
    };

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse",
            },
        });

        tl.from(lineRef.current, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1,
            ease: "power3.inOut",
        })
            .from(headerRef.current, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
            }, "-=0.6");

        gsap.from(gridRef.current?.children || [], {
            y: 80,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: gridRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
            },
        });
    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            id="works"
            className="px-8 md:px-16 lg:px-24 py-12 md:py-24 bg-alabaster overflow-hidden"
        >
            <div className="mb-24">
                <div ref={headerRef} className="opacity-100">
                    <h2 className="text-[clamp(2rem,8vw,6rem)] tracking-tight font-bold uppercase font-serif leading-none">
                        Projekty
                    </h2>
                </div>

                <hr
                    ref={lineRef}
                    className="mt-8 w-full h-px bg-[#333] border-0 origin-left"
                />
            </div>

            <div
                ref={gridRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12 max-w-[1600px] mx-auto"
            >
                {SELECTED_WORKS.map((project) => (
                    <div
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className="cursor-target group cursor-pointer flex flex-col"
                    >
                        <div className="text-xs tracking-[0.2em] font-sans opacity-50 mb-1 uppercase">
                            {project.category}
                        </div>

                        <div className="flex items-center justify-between mb-4 border-b border-transparent group-hover:border-charcoal/20 transition-colors pb-2">
                            <h3 className="text-xl font-serif tracking-tight font-bold">
                                {project.title}
                            </h3>
                            <ArrowUpRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 ease-out" />
                        </div>

                        <div className="relative aspect-3/4 overflow-hidden bg-[#e5e5e5]">
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                style={{ filter: 'grayscale(0.2) contrast(1.05)' }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                        </div>
                    </div>
                ))}
            </div>

            {selectedProject && (
                <ProjectModal
                    isOpen={!!selectedProject}
                    onClose={() => setSelectedProject(null)}
                    project={selectedProject}
                    onNext={handleNextProject}
                    onPrev={handlePrevProject}
                />
            )}
        </section>
    );
}