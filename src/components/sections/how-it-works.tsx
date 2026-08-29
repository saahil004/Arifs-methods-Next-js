import Image from "next/image";

const steps = [
  {
    number: "1",
    title: "Book a Free Assessment",
    description:
      "Tell us your subjects, target grades, and current level so we can build the right plan for you.",
  },
  {
    number: "2",
    title: "Get Matched With a Tutor",
    description:
      "We pair you with an expert tutor experienced in your exact syllabus and subjects.",
  },
  {
    number: "3",
    title: "Start Classes & Track Progress",
    description:
      "Begin structured lessons, practice past papers, and watch your grades improve step by step.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div className="relative">
          <div
            className="absolute -left-4 -top-4 h-32 w-32 text-amber/50"
            style={{
              backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)",
              backgroundSize: "14px 14px",
            }}
          />
          <div className="absolute inset-0 -z-10 translate-x-6 translate-y-6 rounded-3xl bg-amber/10" />
          <div className="relative overflow-hidden rounded-3xl">
            <Image
              src="/hero.jpg"
              alt="Student studying with a tutor"
              width={860}
              height={459}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>

        <div>
          <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber">
            <span className="h-px w-6 bg-amber" />
            How It Works
          </p>
          <h2 className="max-w-md text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
            Three simple steps to getting started.
          </h2>

          <ol className="mt-10 space-y-8">
            {steps.map((step) => (
              <li key={step.number} className="flex gap-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber/15 font-bold text-navy">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-bold text-navy">{step.title}</h3>
                  <p className="mt-1 leading-relaxed text-navy/60">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
