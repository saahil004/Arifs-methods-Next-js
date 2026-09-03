// Every value here is a real, checkable fact about the academy rather than
// an invented headline number (the livebits page this is adapted from used
// stats like "7,518 Completed Projects" — figures we have no basis for and
// that would misrepresent a real business if guessed at).
export default function AtAGlance({ subjectCount }: { subjectCount: number }) {
  const facts = [
    { icon: "/icons/books.svg", value: String(subjectCount), label: "Subjects Offered" },
    { icon: "/icons/degree.svg", value: "O & A Level", label: "Levels Taught" },
    { icon: "/icons/math.svg", value: "Mathematics", label: "Flagship Specialty" },
    { icon: "/icons/calendar.svg", value: "Mon–Sat", label: "Classes Held" },
  ];

  return (
    <section className="relative bg-white">
      {/* amber, not navy/5 or cream: Faculty (between this and FounderQuote)
          hides itself entirely when there are no teachers yet — which is
          the site's actual state right now — so this and FounderQuote can
          end up touching directly. Amber stays visually distinct from
          FounderQuote's navy/5 either way, where a blue tint here would
          re-merge them into one undifferentiated block. */}
      <div className="relative bg-amber/10 pt-16 pb-16 [clip-path:polygon(0_0,100%_0,100%_88%,0_100%)] sm:pt-20 sm:pb-20">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-12 px-6 text-center sm:grid-cols-4">
          {facts.map(({ icon, value, label }) => (
            <div key={label}>
              {/* Plain <img>, not next/image: these are small (4-18KB),
                  self-hosted decorative SVGs with baked-in colors — none of
                  next/image's remote-host allowlisting or responsive-size
                  generation applies here. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={icon} alt="" className="mx-auto h-12 w-12" />
              <p className="mt-4 text-2xl font-extrabold text-navy sm:text-3xl">{value}</p>
              <p className="mt-2 text-sm text-navy/60">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
