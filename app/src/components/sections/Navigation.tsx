"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

export function Navigation() {
    const [menuOpen, setMenuOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const line1Ref = useRef<HTMLDivElement>(null);
    const line2Ref = useRef<HTMLDivElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);

    const tl = useRef<gsap.core.Timeline | null>(null);

    const { contextSafe } = useGSAP({ scope: containerRef });

    // Blokada scrolla
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    useGSAP(() => {
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
            }, "-=0.2");
    });

    const toggleMenu = contextSafe(() => {
        if (!menuOpen) {
            tl.current?.play();
            // Hamburger -> X (biały)
            gsap.to(line1Ref.current, { rotate: 45, y: 6, duration: 0.3, backgroundColor: "#ffffff" });
            gsap.to(line2Ref.current, { rotate: -45, y: -6, width: 48, duration: 0.3, backgroundColor: "#ffffff" });
        } else {
            tl.current?.reverse();
            // X -> Hamburger (oryginalny kolor)
            gsap.to(line1Ref.current, { rotate: 0, y: 0, duration: 0.3, backgroundColor: "currentColor" });
            gsap.to(line2Ref.current, { rotate: 0, y: 0, width: 32, duration: 0.3, backgroundColor: "currentColor" });
        }
        setMenuOpen(!menuOpen);
    });

    const menuItems = [
        { number: '01', label: 'O MNIE', href: '#o-mnie' },
        { number: '02', label: 'PROJEKTY', href: '#galeria' },
        { number: '03', label: 'KONTAKT', href: '#kontakt' },
    ];

    return (
        <div ref={containerRef}>
            {/* NAVBAR */}
            <nav
                className={`absolute top-0 left-0 w-full px-8 md:px-16 lg:px-24 py-12 flex justify-between items-end z-60 transition-colors duration-300 ${menuOpen ? 'text-white' : 'text-[#333]'}`}
            >
                <Link
                    href="/"
                    className={`text-xl tracking-tight font-sans font-bold transition-opacity duration-300 ${menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    TOMASKA STUDIO
                </Link>

                <button
                    onClick={toggleMenu}
                    className="flex flex-col gap-2 items-end cursor-pointer group p-2"
                    aria-label="Toggle menu"
                >
                    <div ref={line1Ref} className="w-12 h-[2px] bg-current transition-colors" />
                    <div ref={line2Ref} className="w-8 h-[2px] bg-current transition-colors group-hover:w-12" />
                </button>
            </nav>

            {/* OVERLAY MENU */}
            <div
                ref={overlayRef}
                className="fixed inset-0 z-50 bg-black text-white flex flex-col translate-y-full"
            >
                {/* ZMIANA: items-center -> items-end 
                   Dzięki temu kontener z linkami zostanie wypchnięty na sam dół (flex-col + flex-1 na rodzicu + items-end w flex-row kontenerze).
                   justify-end trzyma je po prawej stronie.
                */}
                <div className="flex-1 flex items-end justify-end px-8 md:px-16 lg:px-24 pb-20">
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
                                    <span className="text-4xl md:text-7xl lg:text-8xl font-light tracking-tight group-hover:translate-x-4 transition-transform duration-500 font-serif">
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