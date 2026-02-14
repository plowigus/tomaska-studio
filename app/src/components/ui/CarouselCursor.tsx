"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function CarouselCursor({
    container
}: {
    // ZMIANA: Przyjmujemy gotowy element HTML, a nie RefObject
    container: HTMLDivElement | null
}) {
    const cursorRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Jeśli kontener jeszcze nie istnieje, nic nie rób
        if (!cursorRef.current || !container) return;

        // 1. Inicjalizacja: wyśrodkowanie i ukrycie
        gsap.set(cursorRef.current, {
            xPercent: -50,
            yPercent: -50,
            scale: 0,
            opacity: 0,
            x: 0,
            y: 0
        });

        const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.4, ease: "power3" });
        const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.4, ease: "power3" });

        const onMouseMove = (e: MouseEvent) => {
            // Pobieramy pozycję względem viewportu (fixed)
            xTo(e.clientX);
            yTo(e.clientY);
        };

        const onMouseEnter = () => {
            gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3 });
        };

        const onMouseLeave = () => {
            gsap.to(cursorRef.current, { scale: 0, opacity: 0, duration: 0.3 });
        };

        container.addEventListener("mousemove", onMouseMove);
        container.addEventListener("mouseenter", onMouseEnter);
        container.addEventListener("mouseleave", onMouseLeave);

        return () => {
            container.removeEventListener("mousemove", onMouseMove);
            container.removeEventListener("mouseenter", onMouseEnter);
            container.removeEventListener("mouseleave", onMouseLeave);
        };
    }, {
        scope: container ? { current: container } : undefined,
        dependencies: [container] // KLUCZOWE: Restartujemy efekt, gdy kontener się pojawi
    });

    return (
        <div
            ref={cursorRef}
            // ZMIANA: Dodano 'opacity-0 scale-0' jako fallback w CSS
            // ZMIANA: Dodano 'z-[100]' dla pewności warstwy
            className="fixed top-0 left-0 w-24 h-24 border border-black rounded-full pointer-events-none z-[100] flex items-center justify-center bg-white/40 backdrop-blur-sm opacity-0 scale-0"
        >
            <span className="text-[12px] font-mono uppercase tracking-widest text-black font-bold">
                drag me
            </span>
        </div>
    );
}