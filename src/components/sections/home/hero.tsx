"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useHeaderTheme } from "@/components/layout/header-theme";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero({
  eyebrow,
  title,
  subtitle,
  image,
  ctaLabel = "Register Now",
  ctaHref = "/register",
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  image?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const { setOnDarkBanner } = useHeaderTheme();

  useEffect(() => {
    setOnDarkBanner(true);
    return () => setOnDarkBanner(false);
  }, [setOnDarkBanner]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy">
      {image && (
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/50" />

      <motion.div
        className="relative z-10 mx-auto max-w-3xl px-6 text-center"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {eyebrow && (
          <motion.p variants={item} className="mb-4 text-sm font-bold uppercase tracking-widest text-amber">
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          variants={item}
          className="font-display text-4xl uppercase leading-[1.05] tracking-wide text-white sm:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>
        <motion.p variants={item} className="mt-6 text-lg leading-relaxed text-white/80">
          {subtitle}
        </motion.p>
        <motion.div variants={item} className="mt-8">
          <Link
            href={ctaHref}
            className="inline-block rounded-full bg-amber px-8 py-4 font-bold text-navy transition-transform duration-200 hover:scale-105 hover:bg-amber/90 active:scale-95"
          >
            {ctaLabel}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
