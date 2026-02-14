"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SELECTED_WORKS } from "@/app/src/config/constants";

type Project = typeof SELECTED_WORKS[number];

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project;
    onNext: () => void;
    onPrev: () => void;
}

export function ProjectModal({ isOpen, onClose, project, onNext, onPrev }: ProjectModalProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [activeImage, setActiveImage] = useState(project.image);
    const [isAnimating, setIsAnimating] = useState(false);

    // Reset active image when project changes
    useEffect(() => {
        setActiveImage(project.image);
    }, [project]);

    // Body scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") onNext();
            if (e.key === "ArrowLeft") onPrev();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose, onNext, onPrev]);

    const { contextSafe } = useGSAP({ scope: containerRef });

    useGSAP(() => {
        if (isOpen) {
            gsap.set(containerRef.current, { zIndex: 50 });
            const tl = gsap.timeline();

            tl.to(overlayRef.current, {
                opacity: 1,
                duration: 0.5,
                ease: "power2.out",
            })
                .fromTo(contentRef.current,
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
                    "-=0.3"
                );
        }
    }, [isOpen]);

    const handleClose = contextSafe(() => {
        const tl = gsap.timeline({
            onComplete: onClose
        });

        tl.to(contentRef.current, {
            y: 50,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in"
        })
            .to(overlayRef.current, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.in"
            }, "-=0.2")
            .set(containerRef.current, { zIndex: -1 });
    });

    const [isHovered, setIsHovered] = useState(false);

    // Autoplay logic
    useEffect(() => {
        if (isHovered || isAnimating) return;

        const allImages = [project.image, ...project.gallery];
        const interval = setInterval(() => {
            const currentIndex = allImages.indexOf(activeImage);
            const nextIndex = (currentIndex + 1) % allImages.length;
            handleImageChange(allImages[nextIndex]);
        }, 3500);

        return () => clearInterval(interval);
    }, [activeImage, isHovered, isAnimating, project]);

    const handleImageChange = contextSafe((newImage: string) => {
        if (activeImage === newImage || isAnimating) return;
        setIsAnimating(true);

        // Fast, smooth transition
        const tl = gsap.timeline({
            onComplete: () => setIsAnimating(false)
        });

        const imageElement = containerRef.current?.querySelector('.active-project-image');

        if (imageElement) {
            tl.to(imageElement, {
                opacity: 0,
                duration: 0.4,
                ease: "power1.inOut",
                onComplete: () => setActiveImage(newImage)
            })
                .fromTo(imageElement,
                    { opacity: 0, scale: 1.02 },
                    { opacity: 1, scale: 1, duration: 0.6, ease: "power1.inOut" }
                );
        } else {
            setActiveImage(newImage);
            setIsAnimating(false);
        }
    });

    if (!isOpen) return null;

    return (
        <div ref={containerRef} className="fixed inset-0 z-[-1] flex items-center justify-center">
            {/* Background Overlay */}
            <div
                ref={overlayRef}
                onClick={handleClose}
                className="absolute inset-0 bg-black/95 backdrop-blur-sm opacity-0 cursor-pointer"
            />

            {/* Modal Content */}
            <div
                ref={contentRef}
                className="relative w-full h-full md:h-[90vh] md:max-w-[1600px] bg-[#0a0a0a] md:rounded-2xl overflow-hidden flex flex-col md:flex-row text-[#ededed] opacity-0 shadow-2xl"
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black text-white border border-white/10 hover:scale-110 transition-all duration-300 pointer-events-auto"
                >
                    <X size={24} />
                </button>

                {/* LEFT COLUMN: Info & Navigation */}
                <div className="w-full md:w-[400px] lg:w-[480px] h-full flex flex-col border-b md:border-b-0 md:border-r border-white/10">
                    <div className="flex-1 p-8 md:p-12 lg:p-16 overflow-hidden">
                        <span className="text-xs font-mono text-white/50 tracking-widest uppercase block mb-4">
                            {project.category} — {project.year}
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-8 leading-tight">
                            {project.title}
                        </h2>
                        <div className="w-12 h-px bg-white/30 mb-8" />
                        <p className="text-white/70 leading-relaxed text-sm lg:text-base font-sans mb-6">
                            {project.description}
                        </p>
                    </div>

                    <div className="flex-none px-8 md:px-12 lg:px-16 py-6 hidden md:flex items-center gap-4 border-t border-white/5">
                        <button
                            onClick={onPrev}
                            className="group flex items-center gap-3 text-sm font-mono tracking-wider hover:text-white/70 transition-colors"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            PREV
                        </button>
                        <div className="h-4 w-px bg-white/20 mx-2" />
                        <button
                            onClick={onNext}
                            className="group flex items-center gap-3 text-sm font-mono tracking-wider hover:text-white/70 transition-colors"
                        >
                            NEXT
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN: Gallery */}
                <div
                    className="flex-1 flex flex-col h-full bg-[#050505] overflow-hidden"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Main Stage */}
                    <div className="relative w-full flex-1 min-h-0 bg-[#0a0a0a] overflow-hidden">
                        <Image
                            src={activeImage}
                            alt={project.title}
                            fill
                            className="active-project-image object-cover"
                            priority
                        />
                    </div>

                    {/* Thumbnails */}
                    <div className="p-4 md:p-6 bg-[#0a0a0a] border-t border-white/5">
                        <div className="grid grid-cols-6 md:grid-cols-8 gap-2">
                            <button
                                onClick={() => handleImageChange(project.image)}
                                className={`relative aspect-square overflow-hidden rounded-sm transition-all duration-300 ${activeImage === project.image ? 'ring-2 ring-white opacity-100' : 'opacity-40 hover:opacity-100'
                                    }`}
                            >
                                <Image
                                    src={project.image}
                                    alt="Thumbnail main"
                                    fill
                                    className="object-cover"
                                />
                            </button>
                            {project.gallery.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleImageChange(img)}
                                    className={`relative aspect-square overflow-hidden rounded-sm transition-all duration-300 ${activeImage === img ? 'ring-2 ring-white opacity-100' : 'opacity-40 hover:opacity-100'
                                        }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Navigation (Bottom) */}
                    <div className="md:hidden flex items-center justify-between p-6 border-t border-white/10 bg-[#0a0a0a]">
                        <button
                            onClick={onPrev}
                            className="flex items-center gap-2 text-xs font-mono tracking-widest p-4 active:scale-95 transition-transform"
                        >
                            <ArrowLeft size={14} /> PREV PROJECT
                        </button>
                        <button
                            onClick={onNext}
                            className="flex items-center gap-2 text-xs font-mono tracking-widest p-4 active:scale-95 transition-transform"
                        >
                            NEXT PROJECT <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}
