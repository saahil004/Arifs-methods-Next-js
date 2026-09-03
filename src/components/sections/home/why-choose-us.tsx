"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const reasons = [
  {
    title: "Years of Proven Experience",
    description:
      "We've spent years teaching O & A Level students exactly what it takes to succeed — from mastering tricky concepts to walking into the exam room with confidence.",
  },
  {
    title: "Trusted by Parents",
    description:
      "Parents stay in the loop with regular progress updates, so they always know exactly how their child is doing — not just at report card time.",
  },
  {
    title: "A Consistent Track Record",
    description:
      "Term after term, our students move up grade boundaries and hit the scores they're aiming for.",
  },
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function WhyChooseUs() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <motion.p
            variants={item}
            className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber"
          >
            <span className="h-px w-6 bg-amber" />
            Why Choose Us
          </motion.p>
          <motion.h2 variants={item} className="max-w-md text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
            A few reasons parents trust Arif&apos;s Methods.
          </motion.h2>

          <div className="mt-8 divide-y divide-navy/10 border-y border-navy/10">
            {reasons.map((reason, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div key={reason.title} variants={item}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    className={`flex w-full items-center justify-between py-5 text-left font-bold transition-colors ${isOpen ? "text-amber" : "text-navy"}`}
                  >
                    {reason.title}
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 transition-transform ${isOpen ? "rotate-180 text-amber" : "text-navy/40"}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 leading-relaxed text-navy/60">{reason.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div
            className="absolute -right-4 -top-4 h-32 w-32 text-amber/50"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, currentColor 0, currentColor 2px, transparent 2px, transparent 10px)",
            }}
          />
          <div className="absolute inset-0 -z-10 -translate-x-6 translate-y-6 rounded-3xl bg-amber/10" />
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl lg:aspect-4/5">
            <Image
              src="/why-choose-us.jpg"
              alt="A tidy study desk with subject books, a notebook and a plant"
              fill
              sizes="(min-width: 1024px) 500px, 90vw"
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
