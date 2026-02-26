"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useEmblaCarousel from "embla-carousel-react";
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
    const [mobileActiveSlide, setMobileActiveSlide] = useState(0);

    const allImages = [project.image, ...project.gallery];

    // Mobile carousel (Embla)
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setMobileActiveSlide(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect);
        onSelect();
        return () => { emblaApi.off("select", onSelect); };
    }, [emblaApi, onSelect]);

    // Reset when project changes
    useEffect(() => {
        setActiveImage(project.image);
        setMobileActiveSlide(0);
        if (emblaApi) emblaApi.scrollTo(0, true);
    }, [project, emblaApi]);

    // Body scroll lock + theme-color for notch
    useEffect(() => {
        const setThemeColor = (color: string) => {
            let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = 'theme-color';
                document.head.appendChild(meta);
            }
            meta.content = color;
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            setThemeColor('#0a0a0a');
        } else {
            document.body.style.overflow = "";
            setThemeColor('#fcfbf9');
        }
        return () => {
            document.body.style.overflow = "";
            setThemeColor('#fcfbf9');
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

    // Autoplay logic (desktop only)
    useEffect(() => {
        if (isHovered || isAnimating) return;

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
                className="relative w-full h-dvh md:h-[90vh] md:max-w-[1600px] bg-[#0a0a0a] md:rounded-2xl overflow-hidden flex flex-col md:flex-row text-[#ededed] opacity-0 shadow-2xl"
                style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute z-50 p-2 rounded-full bg-black text-white border border-white/10 hover:scale-110 transition-all duration-300 pointer-events-auto cursor-pointer"
                    style={{ top: 'calc(env(safe-area-inset-top, 0px) + 1.5rem)', right: '1.5rem' }}
                >
                    <X size={24} />
                </button>

                {/* ========== MOBILE LAYOUT ========== */}
                <div className="md:hidden flex flex-col h-full overflow-hidden">
                    {/* Image Carousel (top, biggest element) */}
                    <div className="flex-none px-4 pt-4">
                        <div ref={emblaRef} className="overflow-hidden">
                            <div className="flex gap-4">
                                {allImages.map((img, index) => (
                                    <div key={index} className="flex-[0_0_100%] min-w-0 relative aspect-4/3">
                                        <Image
                                            src={img}
                                            alt={project.seoAlt ? `${project.seoAlt} - zdjęcie ${index + 1}` : `${project.title} - zdjęcie ${index + 1}`}
                                            fill
                                            className="object-contain"
                                            priority={index === 0}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Dot indicators */}
                        <div className="flex items-center justify-center gap-2 py-3">
                            {allImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => emblaApi?.scrollTo(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === mobileActiveSlide ? 'bg-white w-6' : 'bg-white/30 w-2'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Scrollable text content */}
                    <div className="flex-1 overflow-y-auto px-6 pb-4">
                        <span className="text-xs font-mono text-white/50 tracking-widest uppercase block mb-3">
                            {project.category} — {project.year}
                        </span>
                        <h2 className="text-2xl font-serif font-bold mb-4 leading-tight">
                            {project.title}
                        </h2>
                        <div className="w-10 h-px bg-white/30 mb-4" />
                        <p className="text-white/70 leading-relaxed text-sm font-sans">
                            {project.description}
                        </p>
                    </div>

                    {/* Mobile Navigation (Bottom) */}
                    <div className="flex-none flex items-center justify-between px-6 py-4 border-t border-white/10">
                        <button
                            onClick={onPrev}
                            className="flex items-center gap-2 text-xs font-mono tracking-widest p-3 active:scale-95 transition-transform"
                        >
                            <ArrowLeft size={14} /> POPRZEDNI
                        </button>
                        <button
                            onClick={onNext}
                            className="flex items-center gap-2 text-xs font-mono tracking-widest p-3 active:scale-95 transition-transform"
                        >
                            NASTĘPNY <ArrowRight size={14} />
                        </button>
                    </div>
                </div>

                {/* ========== DESKTOP LAYOUT ========== */}
                {/* LEFT COLUMN: Info & Navigation */}
                <div className="hidden md:flex w-full md:w-[400px] lg:w-[480px] md:h-full flex-col border-r border-white/10">
                    <div className="flex-1 p-12 lg:p-16 overflow-hidden">
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

                    <div className="flex-none px-12 lg:px-16 py-6 flex items-center gap-4 border-t border-white/5">
                        <button
                            onClick={onPrev}
                            className="group flex items-center gap-3 text-sm font-mono tracking-wider hover:text-white/70 transition-colors"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            POPRZEDNI
                        </button>
                        <div className="h-4 w-px bg-white/20 mx-2" />
                        <button
                            onClick={onNext}
                            className="group flex items-center gap-3 text-sm font-mono tracking-wider hover:text-white/70 transition-colors"
                        >
                            NASTĘPNY
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN: Gallery (desktop) */}
                <div
                    className="hidden md:flex flex-1 flex-col h-full bg-[#050505] overflow-hidden"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Main Stage */}
                    <div className="relative w-full flex-1 min-h-0 bg-[#0a0a0a] overflow-hidden">
                        <Image
                            src={activeImage}
                            alt={project.seoAlt || project.title}
                            fill
                            className="active-project-image object-contain"
                            priority
                        />
                    </div>

                    {/* Thumbnails */}
                    <div className="p-6 bg-[#0a0a0a] border-t border-white/5">
                        <div className="grid grid-cols-8 gap-2">
                            <button
                                onClick={() => handleImageChange(project.image)}
                                className={`relative aspect-square overflow-hidden rounded-sm transition-all duration-300 ${activeImage === project.image ? 'ring-2 ring-white opacity-100' : 'opacity-40 hover:opacity-100'
                                    }`}
                            >
                                <Image
                                    src={project.image}
                                    alt={project.seoAlt ? `${project.seoAlt} - miniatura głowna` : `${project.title} - miniatura główna`}
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
                                        alt={project.seoAlt ? `${project.seoAlt} - miniatura ${index + 1}` : `${project.title} - miniatura ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

