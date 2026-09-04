"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

// Counts from zero to `value` the first time it scrolls into view.
export default function CountUp({
  value,
  suffix = "",
  duration = 1.8,
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // once: the number settling every time you scroll back past it reads as a
  // glitch rather than an effect.
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    // Reduced motion runs the same animation at zero duration rather than
    // setting state directly — one code path, and it lands on the final
    // value immediately either way.
    const controls = animate(0, value, {
      duration: reduceMotion ? 0 : duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {/* The final value is in the DOM for assistive tech and for anyone
          who never scrolls it into view, rather than a stranded zero. */}
      <span aria-hidden="true">{display.toLocaleString()}</span>
      <span className="sr-only">{value.toLocaleString()}</span>
      {suffix}
    </span>
  );
}
