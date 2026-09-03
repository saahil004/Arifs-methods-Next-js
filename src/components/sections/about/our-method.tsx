"use client";

import Link from "next/link";
import { Compass, ListChecks, PenSquare } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const steps = [
  {
    icon: Compass,
    title: "Diagnose the Gaps",
    description: "A short initial assessment shows us exactly which topics need the most work before we start.",
  },
  {
    icon: ListChecks,
    title: "Teach Topic by Topic",
    description: "Structured, syllabus-aligned lessons — nothing skipped, nothing rushed until it actually clicks.",
  },
  {
    icon: PenSquare,
    title: "Practice Under Exam Conditions",
    description: "Regular past papers and mock exams, so the real thing feels familiar by the time it arrives.",
  },
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function OurMethod() {
  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest text-amber">
          <span className="h-px w-6 bg-amber" />
          Our Method
          <span className="h-px w-6 bg-amber" />
        </p>
        <h2 className="mt-4 text-3xl font-extrabold leading-tight text-navy sm:text-4xl lg:text-5xl">
          How we actually get a student from confused to confident.
        </h2>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <h3 className="text-2xl font-extrabold text-navy">Why It Works</h3>
          <p className="mt-6 leading-relaxed text-navy/60">
            Most students aren&apos;t behind because they can&apos;t do the work — they&apos;re behind because one
            earlier topic never fully made sense, and everything built on top of it wobbled from there.
          </p>
          <p className="mt-4 leading-relaxed text-navy/60">
            We start by finding that gap. From there, every lesson is broken down step by step, at the pace it
            actually takes to understand it — the same approach Sir Arif has taught Mathematics with for years, now
            applied across every subject we offer.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-full bg-amber px-8 py-4 font-bold text-navy transition-transform duration-200 hover:scale-105 hover:bg-amber/90 active:scale-95"
          >
            Register Now
          </Link>
        </div>

        <motion.div
          className="order-1 space-y-6 lg:order-2"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              variants={item}
              className={`flex items-center gap-6 rounded-2xl bg-white p-6 shadow-[0_4px_30px_rgba(0,0,0,0.06)] ${
                i === 1 ? "lg:ml-10" : i === 2 ? "lg:ml-4" : ""
              }`}
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber/15">
                <Icon className="h-6 w-6 text-navy" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy">{title}</h3>
                <p className="mt-1 text-navy/60">{description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
