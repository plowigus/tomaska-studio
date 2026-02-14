"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

export function Navigation() {
    const [menuOpen, setMenuOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const tl = useRef<gsap.core.Timeline | null>(null);

    const { contextSafe } = useGSAP({ scope: containerRef });

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
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
                x: 80,
                opacity: 0,
                duration: 0.6,
                stagger: (i) => i * 0.1 + (i >= 2 ? 0.2 : 0),
                ease: "power2.out"
            }, "-=0.2");
    });

    const openMenu = contextSafe(() => { setMenuOpen(true); tl.current?.play(); });
    const closeMenu = contextSafe(() => { setMenuOpen(false); tl.current?.reverse(); });

    const menuItems = [
        { number: '01', label: 'O MNIE', href: '#o-mnie' },
        { number: '02', label: 'PROJEKTY', href: '#galeria' },
        { number: '03', label: 'WSPÓŁPRACA', href: '#oferta' },
        { number: '04', label: 'KONTAKT', href: '#kontakt' },
    ];

    return (
        <div ref={containerRef}>
            <nav className="absolute top-0 left-0 w-full px-8 md:px-16 lg:px-24 py-12 flex justify-between items-end z-40">
                <Link href="/" className="cursor-pointer text-xl tracking-tight font-sans font-bold text-[#333]">
                    TOMASKA STUDIO
                </Link>
                <button onClick={openMenu} className="cursor-pointer group flex flex-col gap-2 items-end p-2">
                    <div className="w-12 h-[2px] bg-black" />
                    <div className="w-8 h-[2px] bg-black " />
                </button>
            </nav>

            <div ref={overlayRef} className="fixed inset-0 z-50 bg-black text-white flex flex-col translate-y-full">
                <div className="absolute top-0 left-0 w-full px-8 md:px-16 lg:px-24 py-12 flex justify-end">
                    <button onClick={closeMenu} className="cursor-pointer group flex flex-col gap-2 items-end p-2">
                        <div className="w-12 h-[2px] bg-white rotate-45 translate-y-[5px]" />
                        <div className="w-12 h-[2px] bg-white -rotate-45 -translate-y-[5px]" />
                    </button>
                </div>

                <div className="flex-1 flex items-end justify-end px-8 md:px-16 lg:px-24 pb-20">
                    <div className="w-full">
                        {menuItems.map((item) => (
                            <div key={item.label} className="menu-item group border-b border-white/20 transition-colors duration-500 hover:border-b-white">
                                <Link href={item.href} onClick={closeMenu} className="cursor-pointer flex items-center justify-between py-6 md:py-8">
                                    <span className="text-sm md:text-base opacity-50 group-hover:opacity-100 transition-opacity font-sans">{item.number}</span>
                                    <span className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight group-hover:translate-x-4 transition-transform duration-500 font-serif">{item.label}</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}