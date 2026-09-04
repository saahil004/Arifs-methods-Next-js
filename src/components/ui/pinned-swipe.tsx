"use client";

import { Children, useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useHeaderTheme } from "@/components/layout/header-theme";

// Desktop-only deck of viewport-sized panels that swipe sideways as you
// scroll: the section is one viewport tall per panel, with a single pinned
// panel inside it, and vertical scroll progress drives the track's x.
//
// Shared by the home page's subject cards and the portfolio page's What We
// Do cards — the mechanic is identical between them, only the panel
// contents differ, so callers pass those in as children. The mobile
// treatments are deliberately NOT here: home uses a snap carousel with
// dots, portfolio a plain vertical stack, and each section renders its own.
export default function PinnedSwipe({ children, className = "" }: { children: ReactNode; className?: string }) {
  const panels = Children.toArray(children);
  const count = panels.length;

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const { setHeaderHidden } = useHeaderTheme();

  // The spring takes the edge off the last few pixels of scroll input.
  // Deliberately stiff: enough to kill jitter, not enough to let the panels
  // visibly lag behind the scroll.
  const smoothed = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  // Percentages of the track's own width rather than vw, so the scrollbar
  // can't cause drift. Travelling (count-1)/count of the track lands the
  // last panel exactly in frame.
  const x = useTransform(smoothed, [0, 1], ["0%", `-${((count - 1) / count) * 100}%`]);

  // Progress sits strictly between 0 and 1 exactly while the section is
  // pinned, which is when a header bar floating over a full-bleed coloured
  // panel reads as a mistake. Only writes state on the flip, not per frame.
  const pinnedRef = useRef(false);
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const pinned = progress > 0 && progress < 1;
    if (pinned === pinnedRef.current) return;
    pinnedRef.current = pinned;
    setHeaderHidden(pinned);
  });

  // Navigating away mid-section would otherwise strand the header offscreen.
  useEffect(() => () => setHeaderHidden(false), [setHeaderHidden]);

  return (
    <div
      ref={sectionRef}
      className={`relative hidden lg:block ${className}`}
      style={{ height: `${count * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ x, width: `${count * 100}%` }} className="flex h-full">
          {panels.map((panel, i) => (
            <div key={i} className="h-full shrink-0" style={{ width: `${100 / count}%` }}>
              {panel}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
