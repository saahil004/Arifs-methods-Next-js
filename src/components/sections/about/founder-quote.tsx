import Image from "next/image";

// Draft copy, not Sir Arif's actual words — written to show the shape and
// tone of the section. Swap in a real quote from him (or have him approve
// this one) before treating it as final.
const QUOTE =
  "I got into teaching because I remember what it felt like to be stuck on a concept that just needed to be explained differently. That's still what every lesson here is built around — meeting a student exactly where they are, not where the syllabus assumes they should be.";

export default function FounderQuote() {
  return (
    // navy/5, not amber/10: this sits directly under OurMethod's bg-cream,
    // and two warm pale-yellow tones back to back had almost no contrast
    // between them. A cool tint reads as a clean, deliberate break instead.
    <section className="relative overflow-hidden bg-navy/5">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-16 bg-cream [clip-path:polygon(0_0,100%_0,100%_100%,0_12px)]"
      />

      <div className="relative z-10 mx-auto grid max-w-5xl items-center gap-16 px-6 py-16 sm:py-20 md:grid-cols-2">
        <div className="relative mx-auto w-full max-w-sm lg:mx-0">
          {/* amber/15, not navy/5: that circle would now be the same color
              as the section behind it and vanish. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/15"
          />
          {/* This is a background-removed cutout, not a rectangular photo —
              no card/overflow-hidden/rounded-corners treatment (there's no
              rectangle to round) and drop-shadow (which follows the actual
              silhouette alpha) instead of shadow-xl (a box-shadow, which
              would draw a shadow for the invisible bounding rectangle
              rather than the person). */}
          <div className="relative mx-auto aspect-350/416 w-72 drop-shadow-xl">
            <Image
              src="/sir-arif-cutout.png"
              alt="Sir Arif, founder and Mathematics educator at Arif's Methods"
              fill
              sizes="(min-width: 768px) 288px, 70vw"
              className="object-contain"
            />
          </div>
        </div>

        <div>
          <p className="text-lg leading-relaxed text-navy/70">&ldquo;{QUOTE}&rdquo;</p>
          <p className="mt-6 font-bold text-navy">Sir Arif</p>
          <p className="text-sm text-navy/50">Founder &amp; Mathematics Educator</p>
        </div>
      </div>
    </section>
  );
}
