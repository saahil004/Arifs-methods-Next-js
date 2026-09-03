"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Book a Free Assessment",
    description:
      "Tell us your subjects, target grades, and current level so we can build the right plan for you.",
  },
  {
    number: "2",
    title: "Get Matched With a Tutor",
    description:
      "We pair you with an expert tutor experienced in your exact syllabus and subjects.",
  },
  {
    number: "3",
    title: "Start Classes & Track Progress",
    description:
      "Begin structured lessons, practice past papers, and watch your grades improve step by step.",
  },
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Sits clearly outside the photo's top-left corner rather than
              tucked behind it — the image wrapper below is positioned and
              comes later in the DOM, so anything overlapping it is painted
              over and the decoration reads as a stray 4px sliver. */}
          <div
            className="absolute -left-10 -top-10 h-44 w-36 text-amber/50"
            style={{
              backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)",
              backgroundSize: "14px 14px",
            }}
          />
          {/* Offset is smaller below lg on purpose: there the image spans the
              full content width, so a 32px nudge pushes this panel past the
              6-unit page gutter and puts a horizontal scrollbar on the whole
              document. At lg+ the image is only half the row, so there's room. */}
          <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-3xl bg-amber/10 lg:translate-x-8 lg:translate-y-8" />
          {/* Portrait only at lg, where the image is half the row and sits
              beside the text. Below that it spans the full content width, so
              4/5 would make it ~965px tall on a tablet and eat the viewport. */}
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl lg:aspect-4/5">
            <Image
              src="/how-it-works.jpg"
              alt="Study desk with O & A Level books, past papers and a goals notebook"
              fill
              sizes="(min-width: 1024px) 500px, 90vw"
              className="object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p
            variants={item}
            className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber"
          >
            <span className="h-px w-6 bg-amber" />
            How It Works
          </motion.p>
          <motion.h2 variants={item} className="max-w-md text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
            Three simple steps to getting started.
          </motion.h2>

          <ol className="mt-10 space-y-8">
            {steps.map((step) => (
              <motion.li key={step.number} variants={item} className="flex gap-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber/15 font-bold text-navy">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-bold text-navy">{step.title}</h3>
                  <p className="mt-1 leading-relaxed text-navy/60">{step.description}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
