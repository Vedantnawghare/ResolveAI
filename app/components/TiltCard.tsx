"use client";

import React, { useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/web";

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
}

export default function TiltCard({ children, className = "", intensity = 15 }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const [props, api] = useSpring(() => ({
        xys: [0, 0, 1],
        config: { mass: 5, tension: 350, friction: 40 },
    }));

    const calc = (x: number, y: number, rect: DOMRect) => [
        -(y - rect.top - rect.height / 2) / intensity, // rotateX
        (x - rect.left - rect.width / 2) / intensity,  // rotateY
        1.02, // scale
    ];

    const trans = (x: number, y: number, s: number) =>
        `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

    return (
        <animated.div
            ref={ref}
            style={{ transform: props.xys.to(trans) }}
            className={`relative will-change-transform ${className}`}
            onMouseMove={(e) => {
                if (!ref.current) return;
                setIsHovered(true);
                const rect = ref.current.getBoundingClientRect();
                api.start({ xys: calc(e.clientX, e.clientY, rect) });
            }}
            onMouseLeave={() => {
                setIsHovered(false);
                api.start({ xys: [0, 0, 1] });
            }}
        >
            {/* Dynamic Hover Glow */}
            {isHovered && (
                <div
                    className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300"
                    style={{
                        boxShadow: `0 30px 60px -12px rgba(163,230,53, 0.4)`,
                    }}
                />
            )}
            {children}
        </animated.div>
    );
}
