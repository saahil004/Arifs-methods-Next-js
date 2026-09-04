"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import CountUp from "@/components/ui/count-up";

// UNVERIFIED FIGURES: the years and student count below were filled in on
// request as plausible placeholders, not from any record of the academy's
// actual numbers. They are public claims about a real business — confirm
// them with Sir Arif and correct them before launch. "Cambridge" is real:
// every course code on the site is a Cambridge syllabus.
const FACTS = [
  { label: "Years teaching", value: 17, suffix: "+" },
  { label: "Students taught", value: 1200, suffix: "+" },
  { label: "Curriculum", text: "Cambridge" },
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
          // Regular weight and the full container width, per the reference —
          // the statement carries at that size without being bold, and
          // spanning the container keeps its left edge flush with the
          // "(About Sir Arif)" label and body copy below it.
          className="text-3xl leading-[1.15] font-normal text-navy sm:text-4xl lg:text-5xl xl:text-6xl"
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
              Sir Arif has spent his career teaching O &amp; A Level Mathematics, and founded Arif&apos;s Methods in
              Karachi to teach it the way he thought it should be taught — step by step, breaking a topic down until
              it genuinely clicks rather than racing to cover the syllabus before the exam.
            </p>
            <p className="mt-4 leading-relaxed text-navy/70">
              Mathematics (4024) and Additional Mathematics (4037) are still his own subjects and the academy&apos;s
              flagship. Years of teaching the same two syllabuses is what the method is built on: he knows which
              topics students reliably get stuck on, which questions examiners keep returning to, and how to close
              the gap between the two.
            </p>
            <p className="mt-4 leading-relaxed text-navy/70">
              The academy teaches the Cambridge O &amp; A Level syllabuses, and the tutors he has brought in across
              Physics, Chemistry and Computer Science all teach to the same approach.
            </p>

            <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-navy/10 pt-6">
              {FACTS.map((item) => (
                <div key={item.label}>
                  <dt className="text-sm text-navy/50">{item.label}</dt>
                  <dd className="mt-1 text-xl font-extrabold text-navy">
                    {item.text ?? <CountUp value={item.value!} suffix={item.suffix} />}
                  </dd>
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
