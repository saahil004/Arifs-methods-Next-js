"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Everything below is drawn from what the site already states about Sir
// Arif — Karachi-based, founder, Mathematics educator, known for a
// step-by-step approach, flagship subjects 4024 and 4037.
//
// What is deliberately NOT here: years of experience, previous schools,
// qualifications, examiner status, any named institution. Those are
// professional credentials belonging to a real, named person, and
// inventing them would be putting a fabricated CV on his own website.
// The AFFILIATIONS list below is a placeholder for exactly that reason —
// fill it in with the real ones (or delete the block) before launch.
const AFFILIATIONS = [
  { label: "Years teaching", value: "—" },
  { label: "Qualification", value: "—" },
  { label: "Affiliation", value: "—" },
];

export default function AboutArif() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-6xl text-3xl leading-[1.15] font-extrabold text-navy sm:text-4xl lg:text-5xl xl:text-6xl"
        >
          Every result on this page traces back to one classroom, one teacher, and a method built over years of
          watching where students actually get stuck.
        </motion.h2>

        <div className="mt-16 grid gap-10 lg:grid-cols-[10rem_1fr_auto]">
          <p className="text-navy/50">(About Sir Arif)</p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-xl"
          >
            <p className="leading-relaxed text-navy/70">
              Sir Arif founded Arif&apos;s Methods in Karachi to teach O &amp; A Level Mathematics the way he thought
              it should be taught — step by step, breaking a topic down until it genuinely clicks rather than rushing
              to cover the syllabus.
            </p>
            <p className="mt-4 leading-relaxed text-navy/70">
              Mathematics (4024) and Additional Mathematics (4037) remain his own subjects and the academy&apos;s
              flagship, and the same approach now runs across every subject and every tutor here.
            </p>

            <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-navy/10 pt-6">
              {AFFILIATIONS.map((item) => (
                <div key={item.label}>
                  <dt className="text-sm text-navy/50">{item.label}</dt>
                  <dd className="mt-1 text-xl font-extrabold text-navy">{item.value}</dd>
                </div>
              ))}
            </dl>

            <Link
              href="/about"
              className="mt-8 inline-block font-bold text-navy underline underline-offset-4 transition-colors hover:text-amber"
            >
              Meet the Teachers
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative aspect-4/5 w-full overflow-hidden rounded-3xl lg:w-72"
          >
            <Image
              src="/sir-arif.jpg"
              alt="Sir Arif, founder and Mathematics educator at Arif's Methods"
              fill
              sizes="(min-width: 1024px) 288px, 90vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
