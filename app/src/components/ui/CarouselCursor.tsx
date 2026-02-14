"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function CarouselCursor({
    container
}: {

    container: HTMLDivElement | null
}) {
    const cursorRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {

        if (!cursorRef.current || !container) return;
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
        dependencies: [container]
    });

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-24 h-24  border-black border-2 rounded-full pointer-events-none z-100 flex items-center justify-center bg-white/40 backdrop-blur-sm opacity-0 scale-0"
        >
            <span className="text-[14px] text-center font-mono uppercase tracking-widest text-black font-bold">
                drag me
            </span>
        </div>
    );
}