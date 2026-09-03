"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useMediaQuery } from "@/lib/use-media-query";
import { useHeaderTheme } from "@/components/layout/header-theme";
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
    description:
      "Number, algebra, geometry, trigonometry, mensuration and statistics — the foundation every other subject leans on. We work through it topic by topic until the method is second nature, not memorised.",
  },
  {
    code: "4037",
    name: "Additional Mathematics",
    level: "O Level",
    image: "/courses/4037-additional-mathematics.png",
    description:
      "The step up from 4024: calculus, advanced algebra, trigonometric identities and vectors. Our flagship subject, and the one students most often arrive worried about and leave confident in.",
  },
  {
    code: "5054",
    name: "Physics",
    level: "O Level",
    image: "/courses/5054-physics.png",
    description:
      "Mechanics, waves, electricity, magnetism and atomic physics. The marks here go to students who can apply a formula to an unfamiliar situation, so that's exactly what we drill.",
  },
  {
    code: "5070",
    name: "Chemistry",
    level: "O Level",
    image: "/courses/5070-chemistry.png",
    description:
      "Atomic structure, bonding, stoichiometry and organic chemistry, alongside the practical paper. Plenty of past-paper work, because chemistry rewards knowing how questions are actually asked.",
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

      <CourseScrollCards />

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

// lg and up: the section is four viewports tall, with one viewport-sized
// panel pinned inside it. Scrolling down that height drives the card track
// sideways instead, so each subject swipes to the next as you scroll —
// hence h-400vh for four cards (three card-widths of travel over 300vh).
function CourseScrollCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const { setHeaderHidden } = useHeaderTheme();

  // Progress is strictly between 0 and 1 exactly while the section is
  // pinned, so that doubles as "a card currently fills the viewport" —
  // which is when a white header bar floating over it looks like a mistake.
  // Only writes state on the flip, not on every scroll frame.
  const pinnedRef = useRef(false);
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const pinned = progress > 0 && progress < 1;
    if (pinned === pinnedRef.current) return;
    pinnedRef.current = pinned;
    setHeaderHidden(pinned);
  });

  // Leaving the page mid-section would otherwise strand the header offscreen.
  useEffect(() => () => setHeaderHidden(false), [setHeaderHidden]);

  // The spring takes the edge off the last few pixels of scroll input. Lenis
  // already smooths the wheel itself, so this is deliberately stiff — enough
  // to kill jitter, not enough to make the cards lag behind the scroll.
  const smoothed = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  // Percentages of the track's own width, not vw: the track is 400% of the
  // pinned panel, so -75% of it is exactly three cards. Using vw here would
  // drift by the scrollbar's width.
  const x = useTransform(smoothed, [0, 1], ["0%", "-75%"]);

  return (
    <div ref={sectionRef} className="relative mt-14 hidden h-[400vh] lg:block">
      {/* Cards fill the pinned viewport rather than sitting shorter inside
          it — the subject artwork is square, and at a reduced card height it
          no longer had the room to sit at a sensible size beside the copy. */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ x }} className="flex h-full w-[400%]">
          {COURSES.map((course, i) => (
            <CourseCard key={course.code} course={course} index={i} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function CourseCard({ course, index }: { course: (typeof COURSES)[number]; index: number }) {
  // Alternating navy/amber rather than one colour per subject: the site only
  // has two brand colours, and alternating gives each swipe a visible change
  // of state without inventing a third or fourth hue.
  const isNavy = index % 2 === 0;

  return (
    <div
      className={`flex h-full w-1/4 shrink-0 items-center ${isNavy ? "bg-navy text-white" : "bg-amber text-navy"}`}
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-16 px-6 lg:grid-cols-2">
        <div>
          <p className={`font-display text-8xl leading-none ${isNavy ? "text-white/25" : "text-navy/25"}`}>
            {String(index + 1).padStart(2, "0")}
          </p>
          <p
            className={`mt-8 text-sm font-bold uppercase tracking-widest ${isNavy ? "text-amber" : "text-navy/60"}`}
          >
            {course.level} &middot; Syllabus {course.code}
          </p>
          <h3 className="mt-3 text-4xl font-extrabold leading-tight xl:text-5xl">{course.name}</h3>
          <p className={`mt-6 max-w-lg leading-relaxed ${isNavy ? "text-white/70" : "text-navy/70"}`}>
            {course.description}
          </p>
          <Link
            href={COURSES_HREF}
            className={`mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 font-bold transition-transform duration-200 hover:scale-105 active:scale-95 ${
              isNavy ? "bg-amber text-navy hover:bg-amber/90" : "bg-navy text-white hover:bg-navy/90"
            }`}
          >
            Explore the Course
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative aspect-square w-full overflow-hidden rounded-3xl shadow-2xl">
          <Image
            src={course.image}
            alt={`${course.level} ${course.name}`}
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
      </div>
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
