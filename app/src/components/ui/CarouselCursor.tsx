"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function CarouselCursor({
    containerRef
}: {
    containerRef: React.RefObject<HTMLDivElement | null>
}) {
    const cursorRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!cursorRef.current || !containerRef.current) return;

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

        const container = containerRef.current;
        container.addEventListener("mousemove", onMouseMove);
        container.addEventListener("mouseenter", onMouseEnter);
        container.addEventListener("mouseleave", onMouseLeave);

        return () => {
            container.removeEventListener("mousemove", onMouseMove);
            container.removeEventListener("mouseenter", onMouseEnter);
            container.removeEventListener("mouseleave", onMouseLeave);
        };
    }, { scope: containerRef });

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-24 h-24 border border-black rounded-full pointer-events-none z-100 flex items-center justify-center opacity-0 scale-0 -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-[1px]"
        >
            <span className="text-[10px] font-mono uppercase tracking-widest text-black font-bold">
                drag me
            </span>
        </div>
    );
}