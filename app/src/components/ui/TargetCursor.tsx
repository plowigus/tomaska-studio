"use client";

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';

export interface TargetCursorProps {
    targetSelector?: string;
    spinDuration?: number;
    hideDefaultCursor?: boolean;
}

const TargetCursor: React.FC<TargetCursorProps> = ({
    targetSelector = '.cursor-target',
    spinDuration = 3,
    hideDefaultCursor = true
}) => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setMounted(true);
        setIsMobile(window.matchMedia("(max-width: 768px) and (pointer: coarse)").matches);

        if (hideDefaultCursor && !isMobile) {
            document.body.style.cursor = 'none';
        }
        return () => { document.body.style.cursor = 'default'; };
    }, [hideDefaultCursor, isMobile]);

    useEffect(() => {
        if (!mounted || isMobile || !cursorRef.current) return;

        const cursor = cursorRef.current;
        const corners = cursor.querySelectorAll('.target-cursor-corner');

        gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 1 });

        const moveHandler = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power3.out'
            });
        };

        const hoverHandler = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest(targetSelector);
            if (target) {
                const rect = target.getBoundingClientRect();
                gsap.to(corners, {
                    scale: 1.2,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            } else {
                gsap.to(corners, { scale: 1, duration: 0.3 });
            }
        };

        window.addEventListener('mousemove', moveHandler);
        window.addEventListener('mouseover', hoverHandler);

        return () => {
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseover', hoverHandler);
        };
    }, [mounted, isMobile, targetSelector]);

    if (!mounted || isMobile) return null;

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-0 h-0 pointer-events-none z-99999 mix-blend-difference opacity-100"
            style={{ willChange: 'transform' }}
        >
            <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="target-cursor-corner absolute top-1/2 left-1/2 w-4 h-4 border-2 border-white -translate-x-[180%] -translate-y-[180%] border-r-0 border-b-0" />
            <div className="target-cursor-corner absolute top-1/2 left-1/2 w-4 h-4 border-2 border-white translate-x-[80%] -translate-y-[180%] border-l-0 border-b-0" />
            <div className="target-cursor-corner absolute top-1/2 left-1/2 w-4 h-4 border-2 border-white translate-x-[80%] translate-y-[80%] border-l-0 border-t-0" />
            <div className="target-cursor-corner absolute top-1/2 left-1/2 w-4 h-4 border-2 border-white -translate-x-[180%] translate-y-[80%] border-r-0 border-t-0" />
        </div>
    );
};

export default TargetCursor;