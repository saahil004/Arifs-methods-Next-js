"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/lib/use-media-query";
import { fadeUpStagger } from "@/lib/motion";

// Deliberately static: these four are the academy's core O Level offering and
// each has its own artwork in public/courses, so there's nothing for the
// courses API to usefully vary here. Codes/names match the live course records.
const COURSES = [
  {
    code: "4024",
    // The course record is "Mathematics (Syllabus D)", but the syllabus number
    // is already in the caption and the parenthetical only forces a truncation
    // in the narrow accordion panels.
    name: "Mathematics",
    level: "O Level",
    image: "/courses/4024-mathematics.png",
  },
  {
    code: "4037",
    name: "Additional Mathematics",
    level: "O Level",
    image: "/courses/4037-additional-mathematics.png",
  },
  {
    code: "5054",
    name: "Physics",
    level: "O Level",
    image: "/courses/5054-physics.png",
  },
  {
    code: "5070",
    name: "Chemistry",
    level: "O Level",
    image: "/courses/5070-chemistry.png",
  },
];

// The nav already points at /courses; that page isn't built yet, so these
// links 404 until it is.
const COURSES_HREF = "/courses";

export default function Courses() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-6">
        {/* On lg the heading and a link to the full listing share a row —
            below that, Enrol Now/View All Courses do the same job as a
            centered button pair further down, so this link is redundant
            there and hidden. */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <motion.p
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
              variants={fadeUpStagger}
              className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber"
            >
              <span className="h-px w-6 bg-amber" />
              Our Courses
            </motion.p>
            <motion.h2
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
              variants={fadeUpStagger}
              className="max-w-3xl text-4xl font-extrabold leading-tight text-navy sm:text-5xl"
            >
              Subjects we teach across O &amp; A Levels.
            </motion.h2>
          </div>

          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={fadeUpStagger}
            className="hidden lg:block"
          >
            <Link
              href={COURSES_HREF}
              className="inline-flex items-center gap-2 font-bold text-navy transition-colors hover:text-amber"
            >
              View All Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Full-bleed on desktop: the band reads as one continuous strip edge
          to edge, so it deliberately escapes the page container the heading
          above it sits in. */}
      <CourseAccordion />

      <div className="mx-auto max-w-6xl px-6">
        <CourseCarousel />

        {/* Desktop panels are themselves the call to action, and the "View
            All Courses" link sits in the heading row instead — so this pair
            is only for the breakpoints that show the carousel. */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:hidden">
          <Link
            href="/register"
            className="inline-block rounded-full bg-amber px-8 py-4 font-bold text-navy transition-transform duration-200 hover:scale-105 hover:bg-amber/90 active:scale-95"
          >
            Enrol Now
          </Link>
          <Link
            href={COURSES_HREF}
            className="inline-block rounded-full border-2 border-navy/15 px-8 py-4 font-bold text-navy transition-colors duration-200 hover:border-navy/40"
          >
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  );
}

// lg and up: panels sit flush in one band and the hovered subject widens while
// the rest give up space. object-left keeps each artwork's title in frame even
// at a collapsed panel's width, so every subject stays identifiable.
function CourseAccordion() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="mt-14 hidden h-130 overflow-hidden lg:flex">
      {COURSES.map((course, i) => (
        <Link
          key={course.code}
          href={COURSES_HREF}
          onMouseEnter={() => setActive(i)}
          onMouseLeave={() => setActive(null)}
          onFocus={() => setActive(i)}
          onBlur={() => setActive(null)}
          // basis-0 + flexGrow means the panels share the band by ratio, so
          // one expanding necessarily shrinks the others without any width maths.
          style={{ flexGrow: active === i ? 2.6 : active === null ? 1 : 0.8 }}
          className="group relative min-w-0 basis-0 outline-none transition-[flex-grow] duration-500 ease-out focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-amber"
        >
          <Image
            src={course.image}
            alt={`${course.level} ${course.name}`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            // Anchored to the top because the artwork is square and the panel
            // is wider than tall once expanded: centring the crop would cut
            // the logo and subject title off the top edge.
            className="object-cover object-top"
          />

          {/* Every panel but the hovered one is covered. The artwork carries
              its own subject title, which at a collapsed panel's width would
              otherwise be sliced mid-word and clash with the caption below;
              covering it means only the expanded panel shows artwork, and the
              caption is the single label everywhere else. */}
          <div
            className={`absolute inset-0 bg-navy transition-opacity duration-500 ${
              active === i ? "opacity-0" : "opacity-90"
            }`}
          />

          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-navy via-navy/80 to-transparent p-6 pt-16">
            <p className="truncate text-sm font-bold uppercase tracking-widest text-amber">{course.level}</p>
            <div className="mt-1 flex items-center justify-between gap-3">
              <h3 className="truncate text-lg font-bold text-white">{course.name}</h3>
              <ArrowRight className="h-5 w-5 shrink-0 text-white transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// Below lg: one card per page on small screens, two at md, paged with dots.
function CourseCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

  const isMd = useMediaQuery("(min-width: 768px)");
  const perPage = isMd ? 2 : 1;
  const pageCount = Math.max(Math.ceil(COURSES.length / perPage), 1);

  // Native scroll-snap does the paging, so a touch swipe works with no JS —
  // the dots only mirror scroll position and drive it on click.
  const handleScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  // Crossing the md breakpoint changes how many cards make a page, which can
  // leave the track parked on a page that no longer exists.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    setPage(0);
  }, [perPage]);

  function goToPage(index: number) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="lg:hidden">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto scrollbar-none"
      >
        {COURSES.map((course) => (
          <article key={course.code} className="w-full shrink-0 snap-start md:w-[calc(50%-0.75rem)]">
            <Link href={COURSES_HREF} className="group block">
              {/* Square container matching the artwork's own 1:1, so cover
                  fills it exactly and nothing is cropped. */}
              <div className="relative aspect-square overflow-hidden rounded-3xl">
                <Image
                  src={course.image}
                  alt={`${course.level} ${course.name}`}
                  fill
                  sizes="(min-width: 768px) 50vw, 90vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-5 text-lg font-bold text-navy group-hover:text-amber">{course.name}</h3>
              <p className="mt-2 flex items-center gap-2 text-sm text-navy/50">
                <span>{course.level}</span>
                <span aria-hidden="true">•</span>
                <span>Syllabus {course.code}</span>
              </p>
            </Link>
          </article>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToPage(i)}
              aria-label={`Go to slide ${i + 1} of ${pageCount}`}
              aria-current={page === i}
              className={`h-2 rounded-full transition-all ${
                page === i ? "w-6 bg-amber" : "w-2 bg-navy/20 hover:bg-navy/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
