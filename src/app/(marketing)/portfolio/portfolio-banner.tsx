"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useHeaderTheme } from "@/components/layout/header-theme";

const MARQUEE_TEXT = "Book a Free Assessment";
// Repeated enough to fill a wide viewport twice over; the track below is
// rendered twice and animated by exactly half its width, so the seam lands
// back at the start and the loop is invisible.
const MARQUEE_ITEMS = Array.from({ length: 6 }, (_, i) => i);

export default function PortfolioBanner() {
  const { setOnDarkBanner } = useHeaderTheme();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setOnDarkBanner(true);
    return () => setOnDarkBanner(false);
  }, [setOnDarkBanner]);

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-navy">
      {/* A plain CSS background rather than next/image, because an <img>
          has no "background" for bg-fixed to attach to. Desktop-only for
          the same reason as the other banners: background-attachment is
          unreliable on mobile and repaints every scroll frame there.
          TODO: swap for a real photo of the academy — reusing the study
          scene from the home quote banner as a placeholder for now. */}
      <div
        className="absolute inset-0 bg-cover bg-center lg:bg-fixed"
        style={{ backgroundImage: "url('/quote-banner.jpg')" }}
      />
      <div className="absolute inset-0 bg-navy/75" />

      {/* pt-20 clears the fixed header, which sits above this. */}
      <div className="relative z-10 flex min-h-screen flex-col pt-20">
        {/* <Marquee reduceMotion={reduceMotion} /> */}

        {/* items-end, not items-center: in the reference the headline sits
            directly on the rule below it rather than floating in the middle
            of the banner. leading-[0.8] pulls the line box in tight to the
            glyphs so the gap is optical, not the font's descender space. */}
        <div className="flex flex-1 items-end px-6">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            // nowrap only from lg: the headline is sized to span the width
            // on one line there, but forcing that on a phone would push it
            // wider than the viewport.
            className="font-[family-name:var(--font-editorial)] w-full text-center text-[13vw] leading-[0.8] font-normal text-white lg:text-left lg:text-[11.4vw] lg:whitespace-nowrap"
          >
            Results in Focus
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
          className="border-t border-white/20"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-8 lg:grid-cols-[auto_1fr_auto]">
            <div className="flex items-center gap-4 rounded-2xl bg-black/40 p-3 backdrop-blur-sm">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                <Image src="/why-choose-us.jpg" alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div>
                <p className="max-w-56 text-sm leading-snug text-white">
                  Expert O &amp; A Level tuition in Clifton, Karachi.
                </p>
                <Link
                  href="/register"
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-white py-2 pr-2 pl-4 text-sm font-bold text-navy transition-transform duration-200 hover:scale-105 active:scale-95"
                >
                  Book a Free Assessment
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
              <p className="text-white/60">(O &amp; A Levels)</p>
              <p className="max-w-md text-lg leading-snug text-white">
                The grades our students walk away with — and the work that got them there.
              </p>
            </div>

            <ArrowDown className="hidden h-6 w-6 text-white lg:block" aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Marquee({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div className="mx-4 overflow-hidden rounded-full bg-amber py-3 sm:mx-6">
      <motion.div
        className="flex w-max"
        // Exactly -50% because the row below is rendered twice: at the
        // halfway point the second copy sits precisely where the first
        // started, so the reset is invisible.
        animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 24, ease: "linear", repeat: Infinity }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {MARQUEE_ITEMS.map((i) => (
              <span key={i} className="flex items-center gap-8 pr-8 font-bold whitespace-nowrap text-navy">
                {MARQUEE_TEXT}
                <span aria-hidden="true">&#10022;</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
