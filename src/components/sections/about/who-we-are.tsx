"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const checklist = [
  "Cambridge & Edexcel-aligned lesson plans",
  "Small batches, more one-on-one attention",
  "Regular past-paper practice and mock exams",
  "Direct updates to parents on progress",
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function WhoWeAre() {
  return (
    <section id="who-we-are" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16 sm:py-20">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <motion.div
          className="order-2 lg:order-1"
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
            Who Are We
          </motion.p>
          <motion.h2 variants={item} className="text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
            An academy built on one teaching philosophy.
          </motion.h2>
          <motion.p variants={item} className="mt-6 leading-relaxed text-navy/70">
            Arif&apos;s Methods is a Karachi-based coaching institute offering expert O &amp; A Level tuition across a
            range of subjects, with Mathematics and Additional Mathematics as our flagship specialty.
          </motion.p>
          <motion.p variants={item} className="mt-4 leading-relaxed text-navy/60">
            It&apos;s led by Sir Arif, an experienced Mathematics educator known for a step-by-step teaching approach
            — breaking a topic down until it actually clicks, rather than rushing through the syllabus. That same
            approach now runs across every subject and every tutor we work with.
          </motion.p>

          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {checklist.map((point) => (
              <motion.li key={point} variants={item} className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber/15">
                  <Check className="h-3 w-3 text-navy" />
                </span>
                <span className="leading-relaxed text-navy/60">{point}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="order-1 lg:order-2"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Two placeholder study-desk photos, reused from elsewhere on the
              site — swap for real photos of the academy when available. */}
          <div className="flex flex-col gap-4 sm:relative sm:mx-auto sm:block sm:h-110 sm:max-w-md sm:gap-0 lg:mx-0 lg:max-w-none">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-16 left-4 hidden h-28 w-28 text-amber/50 sm:block"
              style={{
                backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)",
                backgroundSize: "14px 14px",
              }}
            />
            <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-lg sm:absolute sm:top-0 sm:right-0 sm:h-56 sm:w-72">
              <Image src="/who1.jpg" alt="" fill sizes="(min-width: 640px) 288px, 90vw" className="object-cover" />
            </div>
            <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-xl sm:absolute sm:bottom-0 sm:left-0 sm:h-72 sm:w-80">
              <Image
                src="/who2.jpg"
                alt=""
                fill
                sizes="(min-width: 640px) 320px, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
