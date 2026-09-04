"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import CountUp from "@/components/ui/count-up";

const HEADING =
  "Every grade on this page belongs to a student who sat in a classroom in Clifton, worked through the syllabus topic by topic, and walked into the exam ready.";

// UNVERIFIED FIGURES: students taught and years teaching were filled in on
// request as plausible placeholders — they are not drawn from any record of
// the academy's actual numbers, and a stats row like this reads as evidence
// to a parent choosing a tutor. Confirm and correct both before launch.
// Subjects offered is real: eight courses exist in the live course list.
const STATS = [
  { label: "Students taught", value: 1200, suffix: "+", description: "Across O & A Level subjects since 2009." },
  { label: "Subjects offered", value: 8, suffix: "", description: "Cambridge O & A Level syllabuses." },
  { label: "Years teaching", value: 17, suffix: "+", description: "Mathematics, from the first batch onwards." },
];

export default function ScrollReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  // Not pinned — the section scrolls past like any other. The reveal is
  // keyed to its travel through the viewport instead: it starts lighting up
  // as the section's top reaches ~85% down the screen and is finished by the
  // time its bottom passes ~60%, so the sentence completes while it's still
  // comfortably in view rather than on the way out.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 0.85", "end 0.6"] });

  const words = HEADING.split(" ");

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-navy py-24 sm:py-32">
      {/* CSS background rather than next/image so lg:bg-fixed can attach,
          same as the other banners. TODO: swap for a real photo. */}
      <div
        className="absolute inset-0 bg-cover bg-center lg:bg-fixed"
        style={{ backgroundImage: "url('/register.jpg')" }}
      />
      <div className="absolute inset-0 bg-navy/70" />

      <div className="relative z-10">
        <div className="px-6">
          <p className="mx-auto max-w-7xl text-3xl leading-[1.2] font-extrabold text-white sm:text-4xl lg:text-5xl xl:text-6xl">
            {words.map((word, i) => (
              <Word key={i} progress={scrollYProgress} index={i} total={words.length}>
                {word}
              </Word>
            ))}
          </p>
        </div>

        <div className="mt-20 border-t border-white/20">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 pt-10 md:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
                  {stat.label}
                </span>
                <div className="mt-4 flex items-end gap-4">
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    className="text-4xl font-extrabold text-white lg:text-5xl"
                  />
                  <p className="max-w-44 text-sm leading-snug text-white/70">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  index,
  total,
}: {
  children: string;
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  // Words share the first 80% of the scroll, each brightening over its own
  // slice, so they light up left to right rather than all at once. Each
  // slice is stretched to twice its width so neighbours overlap and the
  // leading edge reads as a soft sweep instead of a hard cursor.
  const start = (index / total) * 0.8;
  const end = start + (1 / total) * 0.8 * 2;
  const opacity = useTransform(progress, [start, end], [0.25, 1]);

  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>{" "}
    </>
  );
}
