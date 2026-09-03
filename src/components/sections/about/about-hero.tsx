"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function AboutHero() {
  // No useHeaderTheme call needed: onDarkBanner defaults to false and every
  // page that sets it true (Hero, ContactBanner) resets it on unmount, so
  // this light (bg-white) banner already gets the header's normal navy text.
  // White (not cream) specifically so it matches about-banner.png's own
  // white background with no visible seam where the photo begins.
  return (
    <section className="relative overflow-hidden bg-white pt-40 [clip-path:polygon(0_0,100%_0,100%_100%,0_86%)] sm:[clip-path:polygon(0_0,100%_0,100%_100%,0_90%)]">
      <motion.div
        className="mx-auto max-w-3xl px-6 text-center"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.p variants={item} className="mb-4 text-sm font-bold uppercase tracking-widest text-amber">
          About Us
        </motion.p>
        <motion.h1 variants={item} className="text-4xl font-extrabold leading-tight text-navy sm:text-5xl lg:text-6xl">
          Hello! We&apos;re Arif&apos;s Methods.
        </motion.h1>
        <motion.p variants={item} className="mt-6 text-lg font-medium text-navy/60">
          An O &amp; A Level academy built around one thing: helping students actually understand a subject, not just
          memorize it.
        </motion.p>
      </motion.div>

      <motion.div
        className="mt-16 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Image
          src="/about-banner.png"
          alt="Students of Arif's Methods"
          width={1717}
          height={916}
          priority
          sizes="100vw"
          className="h-auto w-full"
        />
      </motion.div>
    </section>
  );
}
