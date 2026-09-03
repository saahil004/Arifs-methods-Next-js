import { BookOpen, GraduationCap, Sparkles, CalendarDays } from "lucide-react";

// Every value here is a real, checkable fact about the academy rather than
// an invented headline number (the livebits page this is adapted from used
// stats like "7,518 Completed Projects" — figures we have no basis for and
// that would misrepresent a real business if guessed at).
export default function AtAGlance({ subjectCount }: { subjectCount: number }) {
  const facts = [
    { icon: BookOpen, value: String(subjectCount), label: "Subjects Offered" },
    { icon: GraduationCap, value: "O & A Level", label: "Levels Taught" },
    { icon: Sparkles, value: "Mathematics", label: "Flagship Specialty" },
    { icon: CalendarDays, value: "Mon–Sat", label: "Classes Held" },
  ];

  return (
    <section className="relative bg-white">
      <div className="relative bg-navy/5 pt-16 pb-16 [clip-path:polygon(0_0,100%_0,100%_88%,0_100%)] sm:pt-20 sm:pb-20">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-12 px-6 text-center sm:grid-cols-4">
          {facts.map(({ icon: Icon, value, label }) => (
            <div key={label}>
              <Icon className="mx-auto h-9 w-9 text-amber" />
              <p className="mt-4 text-2xl font-extrabold text-navy sm:text-3xl">{value}</p>
              <p className="mt-2 text-sm text-navy/60">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
