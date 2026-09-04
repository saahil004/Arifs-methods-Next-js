"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";

// PLACEHOLDER CONTENT — none of these are real people or real quotes.
// Testimonials are the one thing on this site that can't be drafted and
// then quietly shipped: presenting invented praise from invented students
// to parents deciding where to send their child is a straightforward lie,
// however plausible it reads. Replace every entry with a real, attributable
// quote (with that person's permission) before this page goes live.
const TESTIMONIALS = [
  {
    quote: "Placeholder testimonial — replace with a real quote from a student or parent.",
    name: "Student name",
    detail: "O Level Mathematics",
    bg: "bg-amber",
    text: "text-navy",
  },
  {
    quote: "Placeholder testimonial — replace with a real quote from a student or parent.",
    name: "Student name",
    detail: "A Level Physics",
    bg: "bg-navy",
    text: "text-white",
  },
  {
    quote: "Placeholder testimonial — replace with a real quote from a student or parent.",
    name: "Parent name",
    detail: "Parent of an O Level student",
    bg: "bg-cream",
    text: "text-navy",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smoothed = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    // One viewport of scroll per card, plus one to read the last one on.
    <section ref={sectionRef} className="relative h-[400vh] bg-white">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-navy/40">Testimonials</p>
          <p className="text-sm font-bold uppercase tracking-widest text-navy/40">They love us</p>
        </div>

        <div className="relative mt-10 flex flex-1 items-center justify-center">
          {TESTIMONIALS.map((t, i) => (
            <Card key={i} testimonial={t} index={i} total={TESTIMONIALS.length} progress={smoothed} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({
  testimonial,
  index,
  total,
  progress,
}: {
  testimonial: (typeof TESTIMONIALS)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Each card owns an equal slice of the scroll. Within its slice it lifts
  // up and away, uncovering the one beneath — so the stack is peeled from
  // the front rather than the cards sliding past each other.
  const slice = 1 / total;
  const start = index * slice;
  const end = start + slice;

  const y = useTransform(progress, [start, end], ["0%", "-120%"]);
  const rotate = useTransform(progress, [start, end], [index % 2 === 0 ? -3 : 2, index % 2 === 0 ? -12 : 10]);
  const opacity = useTransform(progress, [start, end - slice * 0.15, end], [1, 1, 0]);

  return (
    <motion.div
      style={{
        y,
        rotate,
        opacity,
        // Later cards sit underneath, so the top card is the one that lifts.
        zIndex: total - index,
      }}
      className={`absolute w-[min(90vw,34rem)] rounded-3xl p-10 shadow-2xl ${testimonial.bg} ${testimonial.text}`}
    >
      <p className="text-xl leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
      <p className="mt-8 font-bold">{testimonial.name}</p>
      <p className="opacity-60">{testimonial.detail}</p>
    </motion.div>
  );
}
