"use client";

import { motion, type Variants } from "framer-motion";
import { GraduationCap, BookOpen, ClipboardCheck, TrendingUp } from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Expert Teachers",
    description:
      "Learn from experienced O & A Level educators, including Sir Arif, our Mathematics specialist known for his step-by-step teaching approach.",
  },
  {
    icon: BookOpen,
    title: "Structured Curriculum",
    description:
      "Topic-by-topic lesson plans aligned with Cambridge and Edexcel syllabuses — nothing skipped, nothing wasted.",
  },
  {
    icon: ClipboardCheck,
    title: "Past Paper Practice",
    description:
      "Regular mock exams and past paper drills so you walk into the real thing with confidence.",
  },
  {
    icon: TrendingUp,
    title: "Proven Results",
    description:
      "A track record of students moving up grade boundaries and hitting their target scores.",
  },
];

// Column rules, as in the reference. A grid can't just use divide-x — that
// draws on DOM order, not grid position, so the first item of every wrapped
// row would get a stray leading rule. These nth-child variants drop the rule
// (and its indent) on whichever item starts a row at each breakpoint: every
// item at 1-up, odd items at 2-up, and every 4th at 4-up.
const columnRule =
  "border-navy/10 sm:border-l sm:pl-8 sm:[&:nth-child(2n+1)]:border-l-0 sm:[&:nth-child(2n+1)]:pl-0 " +
  "lg:[&:nth-child(2n+1)]:border-l lg:[&:nth-child(2n+1)]:pl-8 lg:[&:nth-child(4n+1)]:border-l-0 lg:[&:nth-child(4n+1)]:pl-0";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5 }}
        className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber"
      >
        <span className="h-px w-6 bg-amber" />
        What We Offer
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-3xl text-4xl font-extrabold leading-tight text-navy sm:text-5xl"
      >
        Everything you need to excel in O &amp; A Levels.
      </motion.h2>

      <motion.div
        className="mt-14 grid gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {features.map(({ icon: Icon, title, description }) => (
          <motion.div key={title} variants={item} className={`flex flex-col ${columnRule}`}>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber/15">
              <Icon className="h-6 w-6 text-navy" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-navy">{title}</h3>
            <p className="mt-2 leading-relaxed text-navy/60">{description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
