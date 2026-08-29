import { GraduationCap, BookOpen, ClipboardCheck, TrendingUp } from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Expert Teachers",
    description:
      "Learn from experienced O & A Level educators who know exactly what examiners look for.",
  },
  {
    icon: BookOpen,
    title: "Structured Curriculum",
    description:
      "Topic-by-topic lesson plans aligned with Cambridge and Edexcel syllabuses — nothing skipped, nothing wasted.",
  },
  {
    icon: ClipboardCheck,
    title: "Past Paper Practice",
    description:
      "Regular mock exams and past paper drills so you walk into the real thing with confidence.",
  },
  {
    icon: TrendingUp,
    title: "Proven Results",
    description:
      "A track record of students moving up grade boundaries and hitting their target scores.",
  },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber">
        <span className="h-px w-6 bg-amber" />
        What We Offer
      </p>
      <h2 className="max-w-2xl text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
        Everything you need to excel in O &amp; A Levels.
      </h2>

      <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title}>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber/15">
              <Icon className="h-6 w-6 text-navy" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-navy">{title}</h3>
            <p className="mt-2 leading-relaxed text-navy/60">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
