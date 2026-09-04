"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const HEADING =
  "We believe a grade comes from understanding a subject, not from memorising it. Our approach keeps every student moving with the syllabus, never past a topic they haven't finished.";

const POINTS = [
  {
    title: "Clarity Over Cramming",
    description:
      "Every topic is taught until the method genuinely makes sense, so revision in April is a refresher rather than a first attempt at half the syllabus.",
  },
  {
    title: "Progress You Can Actually See",
    description:
      "Marked work, timed papers and honest feedback through the term. Nobody finds out how a student is doing for the first time on results day.",
  },
  {
    title: "Problems Solved, Not Recited",
    description:
      "Students learn to read an unfamiliar question and know where to start — which is where the marks in these papers actually go.",
  },
];

// TODO: placeholder photography reused from elsewhere on the site — swap for
// real shots of the academy when they exist. These two are the only portrait
// assets with enough resolution for the crops below (who1/who2 are ~400px and
// go soft at this size), which is why they repeat from the What We Do panels.
const PHOTO_LARGE = "/why-choose-us.jpg";
const PHOTO_SMALL = "/how-it-works.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const, delay: i * 0.1 },
  }),
};

export default function OurApproach() {
  return (
    <section id="our-approach" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.p
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="text-3xl leading-tight font-normal text-navy sm:text-4xl lg:text-5xl"
        >
          {HEADING}
        </motion.p>

        {/* Both photos and the copy hang from a shared bottom edge, which is
            what gives the pair its staggered top line — the small photo is
            simply shorter, not offset. items-end does that; a fixed margin
            on the small photo wouldn't survive a change of text length. */}
        <div className="mt-16 grid grid-cols-3 items-end gap-x-6 gap-y-12 lg:mt-24 lg:grid-cols-12">
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="relative col-span-2 aspect-3/4 w-full overflow-hidden rounded-3xl lg:col-span-4"
          >
            <Image
              src={PHOTO_LARGE}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, 66vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="relative col-span-1 aspect-3/4 w-full overflow-hidden rounded-3xl lg:col-span-2"
          >
            <Image
              src={PHOTO_SMALL}
              alt=""
              fill
              sizes="(min-width: 1024px) 17vw, 33vw"
              className="object-cover"
            />
          </motion.div>

          {/* Starts at column 9, not immediately after the photos: the empty
              columns between them are the whitespace the layout is built on. */}
          <div className="col-span-3 space-y-10 lg:col-span-4 lg:col-start-9">
            {POINTS.map((point, i) => (
              <motion.div
                key={point.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={fadeUp}
              >
                <h3 className="text-xl font-normal text-navy">{point.title}</h3>
                <p className="mt-3 leading-relaxed text-navy/60">{point.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
