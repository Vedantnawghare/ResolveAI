"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

export default function AnimatedCounter({
    value,
    duration = 2
}: {
    value: number;
    duration?: number;
}) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const controls = animate(0, value, {
            duration,
            ease: "easeOut",
            onUpdate(cur) {
                setDisplayValue(Math.floor(cur));
            },
        });

        return () => controls.stop();
    }, [value, duration]);

    return <span>{displayValue.toLocaleString("en-IN")}</span>;
}
