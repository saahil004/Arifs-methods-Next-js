"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function QuoteBanner() {
  return (
    <section
      className="relative flex min-h-[520px] items-center overflow-hidden bg-navy bg-cover bg-center bg-scroll md:bg-fixed"
      style={{
        backgroundImage: "url(/quote-banner.jpg)",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 88%)",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <motion.div
        className="relative z-10 mx-auto max-w-3xl px-6 py-24"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.p
          variants={item}
          className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber"
        >
          <span className="h-px w-6 bg-amber" />
          Our Philosophy
        </motion.p>
        <motion.blockquote variants={item} className="text-2xl font-bold leading-snug text-white sm:text-3xl">
          &ldquo;Train up a child in the way he should go; even when he is old he will not depart from
          it.&rdquo;
        </motion.blockquote>
        <motion.p variants={item} className="mt-4 text-white/70">
          — Proverbs 22:6 (ESV)
        </motion.p>
        <motion.div variants={item} className="mt-8">
          <Link
            href="/register"
            className="inline-block rounded-full bg-amber px-8 py-4 font-bold text-navy transition-transform duration-200 hover:scale-105 hover:bg-amber/90 active:scale-95"
          >
            Register Now
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
