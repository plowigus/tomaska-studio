"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

export function Navigation() {
    const [menuOpen, setMenuOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const line1Ref = useRef<HTMLDivElement>(null);
    const line2Ref = useRef<HTMLDivElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);

    const tl = useRef<gsap.core.Timeline | null>(null);

    // contextSafe gwarantuje czyszczenie animacji eventowych
    const { contextSafe } = useGSAP({ scope: containerRef });

    useGSAP(() => {
        // Inicjalizacja osi czasu (paused: true)
        tl.current = gsap.timeline({ paused: true })
            .to(overlayRef.current, {
                y: "0%",
                duration: 0.6,
                ease: "power3.inOut",
            })
            .from(".menu-item", {
                x: 100,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            }, "-=0.4");

        // Intro Navbaru
        gsap.from(navRef.current, {
            y: -20,
            opacity: 0,
            duration: 0.8,
            delay: 0.2,
            ease: "power2.out"
        });
    });

    const toggleMenu = contextSafe(() => {
        if (!menuOpen) {
            tl.current?.play();
            gsap.to(line1Ref.current, { rotate: 45, y: 6, duration: 0.3 });
            gsap.to(line2Ref.current, { rotate: -45, y: -6, width: 48, duration: 0.3 });
        } else {
            tl.current?.reverse();
            gsap.to(line1Ref.current, { rotate: 0, y: 0, duration: 0.3 });
            gsap.to(line2Ref.current, { rotate: 0, y: 0, width: 32, duration: 0.3 });
        }
        setMenuOpen(!menuOpen);
    });

    const menuItems = [
        { number: '01', label: 'O MNIE', href: '#o-mnie' },
        { number: '02', label: 'GALERIA PROJEKTÓW', href: '#galeria' },
        { number: '03', label: 'KONTAKT', href: '#kontakt' },
    ];

    return (
        <div ref={containerRef}>
            {/* Zmiana na fixed top-0 w-full zdejmuje element z dokumentu zapobiegając łamaniu 100vh */}
            <nav
                ref={navRef}
                className="fixed top-0 left-0 w-full px-8 md:px-16 lg:px-24 py-10 flex justify-between items-center z-60 mix-blend-difference text-white"
            >
                <Link href="/" className="text-xl tracking-tight">
                    TOMASKA STUDIO
                </Link>

                <button
                    onClick={toggleMenu}
                    className="flex flex-col gap-2 items-end cursor-pointer group z-50 relative"
                    aria-label="Toggle menu"
                >
                    <div ref={line1Ref} className="w-12 h-[2px] bg-current transition-colors" />
                    <div ref={line2Ref} className="w-8 h-[2px] bg-current transition-colors group-hover:w-12" />
                </button>
            </nav>

            {/* Usunięto ukrycie 'hidden', overlay bazuje tylko na transformacji - y-full chowa go pod ekranem */}
            <div
                ref={overlayRef}
                className="fixed inset-0 z-50 bg-primary text-secondary flex flex-col justify-center translate-y-full" // Added justify-center to vertically align menu items since top bar is gone
            >
                {/* Removed close button section */}

                <div className="flex-1 flex items-center justify-end px-8 md:px-16 lg:px-24">
                    <div className="w-full">
                        {menuItems.map((item) => (
                            <div key={item.label} className="menu-item border-t border-white/20 last:border-b">
                                <Link
                                    href={item.href}
                                    onClick={toggleMenu}
                                    className="flex items-center justify-between py-4 md:py-6 group"
                                >
                                    <span className="text-sm md:text-base opacity-50 group-hover:opacity-100 transition-opacity font-sans">
                                        {item.number}
                                    </span>
                                    <span className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight group-hover:translate-x-4 transition-transform duration-500 font-serif">
                                        {item.label}
                                    </span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}