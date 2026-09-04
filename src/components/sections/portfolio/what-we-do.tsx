"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useHeaderTheme } from "@/components/layout/header-theme";

// TODO: the photos are placeholders reused from elsewhere on the site —
// swap for real shots of the academy when they exist.
const ITEMS = [
  {
    title: "Small-Batch Classes",
    description:
      "Batches stay small enough that Sir Arif knows where every student is in the syllabus. Nobody sits at the back quietly falling behind for a term.",
    image: "/why-choose-us.jpg",
  },
  {
    title: "Topic-by-Topic Teaching",
    description:
      "Each topic is taught and finished before the next one starts, rather than racing the syllabus and hoping revision closes the gaps in April.",
    image: "/how-it-works.jpg",
  },
  {
    title: "Past-Paper Drills",
    description:
      "Regular timed past papers under exam conditions, marked the way an examiner marks them, so the real paper is familiar rather than a surprise.",
    image: "/who1.jpg",
  },
  {
    title: "Progress Parents Can See",
    description:
      "Parents hear how their child is actually doing during the term, not for the first time when the report card arrives.",
    image: "/who2.jpg",
  },
];

export default function WhatWeDo() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 pt-20 sm:pt-28">
        <p className="mb-3 flex items-center gap-2 text-sm font-bold tracking-widest text-amber uppercase">
          <span className="h-px w-6 bg-amber" />
          What We Do
        </p>
        <h2 className="max-w-3xl text-3xl leading-tight font-normal text-navy sm:text-4xl lg:text-5xl">
          Four things that turn a syllabus into a grade.
        </h2>
      </div>

      <DesktopCards />
      <MobileCards />
    </section>
  );
}

// lg and up: the same pinned horizontal swipe the home page's subject cards
// use — four viewport-sized panels dragged sideways by vertical scroll.
function DesktopCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const { setHeaderHidden } = useHeaderTheme();

  const smoothed = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  // Percentages of the track's own width, so the scrollbar can't cause drift.
  const x = useTransform(smoothed, [0, 1], ["0%", "-75%"]);

  // Progress sits strictly between 0 and 1 exactly while the section is
  // pinned, which is when a header bar floating over a full-bleed coloured
  // card looks like a mistake. Only writes on the flip, not every frame.
  const pinnedRef = useRef(false);
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const pinned = progress > 0 && progress < 1;
    if (pinned === pinnedRef.current) return;
    pinnedRef.current = pinned;
    setHeaderHidden(pinned);
  });

  return (
    <div ref={sectionRef} className="relative mt-14 hidden h-[400vh] lg:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ x }} className="flex h-full w-[400%]">
          {ITEMS.map((item, i) => (
            <div
              key={item.title}
              className={`flex h-full w-1/4 shrink-0 items-center ${
                i % 2 === 0 ? "bg-navy text-white" : "bg-amber text-navy"
              }`}
            >
              <div className="mx-auto grid w-full max-w-6xl items-center gap-16 px-6 lg:grid-cols-2">
                <div>
                  <p
                    className={`font-display text-8xl leading-none ${
                      i % 2 === 0 ? "text-white/25" : "text-navy/25"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-8 text-4xl leading-tight font-extrabold xl:text-5xl">{item.title}</h3>
                  <p className={`mt-6 max-w-lg leading-relaxed ${i % 2 === 0 ? "text-white/70" : "text-navy/70"}`}>
                    {item.description}
                  </p>
                </div>

                <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl shadow-2xl">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// Below lg: plain stacked cards. The pinned swipe depends on a tall scroll
// runway and a wide viewport, neither of which a phone has — so the same
// content is just a normal vertical list, per the mobile reference.
function MobileCards() {
  return (
    <div className="mx-auto mt-12 max-w-2xl space-y-6 px-6 pb-20 lg:hidden">
      {ITEMS.map((item, i) => (
        <motion.article
          key={item.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`rounded-3xl p-8 ${i % 2 === 0 ? "bg-navy text-white" : "bg-amber text-navy"}`}
        >
          <p className={`font-display text-6xl leading-none ${i % 2 === 0 ? "text-white/25" : "text-navy/25"}`}>
            {String(i + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-6 text-2xl leading-tight font-extrabold">{item.title}</h3>
          <p className={`mt-4 leading-relaxed ${i % 2 === 0 ? "text-white/70" : "text-navy/70"}`}>
            {item.description}
          </p>
          <div className="relative mt-6 aspect-4/3 w-full overflow-hidden rounded-2xl">
            <Image src={item.image} alt="" fill sizes="90vw" className="object-cover" />
          </div>
        </motion.article>
      ))}
    </div>
  );
}
