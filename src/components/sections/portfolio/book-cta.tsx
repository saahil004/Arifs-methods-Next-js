"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const LABELS = ["Call us", "Say hello", "Book now", "Let's talk", "Ask away"];

// Amber and navy are the site's own two colours; the pale blue is a tint of
// navy, there only so three pills in a row don't read as a repeating pair.
const COLOURS = [
  "bg-amber text-navy",
  "bg-navy text-white",
  "bg-[#7fb0ee] text-navy",
];

// How far the cursor has to travel before another pill drops. Small enough
// that a normal sweep across the section leaves a trail, large enough that
// a fast flick doesn't dump twenty pills on top of each other.
const SPAWN_DISTANCE = 130;
const LIFETIME_MS = 1600;
const MAX_LIVE = 10;

type Pill = { id: number; x: number; y: number; label: string; colour: string; rotate: number };

export default function BookCta() {
  const sectionRef = useRef<HTMLElement>(null);
  const [pills, setPills] = useState<Pill[]>([]);
  const reduceMotion = useReducedMotion();

  // Refs, not state: these change on every pointer event and must not
  // re-render the section on their own.
  const lastSpawn = useRef<{ x: number; y: number } | null>(null);
  const nextId = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const handleMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      // Touch and pen have no hovering cursor to trail, and firing on tap
      // would drop a pill under the reader's own thumb.
      if (event.pointerType !== "mouse" || reduceMotion) return;

      const bounds = sectionRef.current?.getBoundingClientRect();
      if (!bounds) return;
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;

      const previous = lastSpawn.current;
      if (previous && Math.hypot(x - previous.x, y - previous.y) < SPAWN_DISTANCE) return;
      lastSpawn.current = { x, y };

      const id = nextId.current++;
      setPills((current) => [
        // Cap the trail rather than letting a long mouse sweep accumulate
        // hundreds of animating nodes.
        ...current.slice(-(MAX_LIVE - 1)),
        {
          id,
          x,
          y,
          label: LABELS[id % LABELS.length],
          colour: COLOURS[id % COLOURS.length],
          rotate: Math.random() * 40 - 20,
        },
      ]);

      timers.current.push(
        setTimeout(() => setPills((current) => current.filter((pill) => pill.id !== id)), LIFETIME_MS),
      );
    },
    [reduceMotion],
  );

  return (
    <section
      ref={sectionRef}
      onPointerMove={handleMove}
      onPointerLeave={() => (lastSpawn.current = null)}
      className="relative flex min-h-[70vh] items-center overflow-hidden bg-white py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <h2 className="text-center text-3xl leading-tight font-normal text-navy sm:text-4xl lg:text-5xl xl:text-6xl">
          <Link href="/register" className="transition-colors hover:text-amber">
            Want to get started? Click here to book a class.
          </Link>
        </h2>
      </div>

      {/* Decorative and non-interactive: pointer-events-none keeps a pill
          from swallowing the click on the heading it just landed over, and
          aria-hidden keeps the same five words out of the accessibility
          tree ten times over. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <AnimatePresence>
          {pills.map((pill) => (
            <motion.span
              key={pill.id}
              // left/top place it; x/y do the centring, because framer owns
              // the transform outright — a Tailwind -translate-x-1/2 here
              // would simply be overwritten.
              style={{ left: pill.x, top: pill.y, x: "-50%", y: "-50%", rotate: pill.rotate }}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 500, damping: 26 }}
              className={`absolute rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap ${pill.colour}`}
            >
              {pill.label}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
