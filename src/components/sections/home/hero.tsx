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
  titleItalic,
  subtitle,
  image,
  ctaLabel = "Register Now",
  ctaHref = "/register",
}: {
  eyebrow?: string;
  title: string;
  /** Optional second headline line, set in italic beneath the first. */
  titleItalic?: string;
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
        className="relative z-10 mx-auto max-w-5xl px-6 text-center"
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
          className="font-[family-name:var(--font-editorial)] text-4xl font-normal uppercase leading-[1.05] tracking-[0.04em] text-white sm:text-5xl lg:text-6xl xl:text-7xl"
        >
          {title}
          {titleItalic && (
            <>
              {/* A block span rather than <br>, so the italic line can carry
                  its own slightly tighter tracking — italics read too airy
                  at the roman line's spacing. */}
              <span className="block italic tracking-[0.02em]">{titleItalic}</span>
            </>
          )}
        </motion.h1>
        {/* Kept narrower than the headline above it — the wide measure that
            suits a display line is an uncomfortable read for body copy. */}
        <motion.p variants={item} className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
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
