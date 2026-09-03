import type { Teacher } from "@/lib/admin-api";

// The layout below is built for a 4-up row (see the flex-basis calc on each
// card) — capping here rather than in the page keeps that assumption next to
// the component that actually depends on it.
const MAX_TEACHERS = 4;

export default function Faculty({ teachers: allTeachers }: { teachers: Teacher[] }) {
  const teachers = allTeachers.slice(0, MAX_TEACHERS);
  if (teachers.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/teams.svg" alt="" className="mx-auto h-14 w-auto" />
        <h2 className="mt-6 px-10 text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
          Meet the teachers behind the results.
        </h2>
      </div>

      <div className="relative mx-auto mt-16 max-w-6xl px-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 -left-10 hidden h-28 w-28 rounded-full bg-[repeating-linear-gradient(45deg,#fec90a4d_0px,#fec90a4d_2px,transparent_2px,transparent_12px)] lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-amber/15"
        />

        {/* flex-wrap + fixed card widths, not a grid: a grid with fewer
            teachers than columns leaves the last row lopsided against the
            left edge — this centers whatever number of cards there are
            instead of assuming the roster is always a multiple of 4.
            relative z-10 is required here — the two decorative circles
            above are position: absolute, and CSS paints positioned
            elements above non-positioned siblings regardless of DOM order,
            even at the same (auto) z-index. Without this the circles
            painted on top of the cards despite coming first in the markup
            (the same bug fixed earlier on the Contact page's card). */}
        <div className="relative z-10 flex flex-wrap justify-center gap-6">
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeacherCard({ teacher }: { teacher: Teacher }) {
  const subjects = teacher.courses.map((c) => c.name).join(", ");

  return (
    <div className="w-full max-w-72 rounded-2xl bg-white p-8 shadow-[0_4px_30px_rgba(0,0,0,0.06)] sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]">
      <div className="flex h-22 w-22 items-center justify-center overflow-hidden rounded-full bg-navy/10">
        {teacher.photoUrl ? (
          // A plain <img>, not next/image: photoUrl is an arbitrary URL an
          // admin pastes in, and next/image requires every remote host to
          // be allow-listed in next.config.ts up front — impractical here.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={teacher.photoUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-2xl font-bold text-navy/40">{teacher.name.charAt(0).toUpperCase()}</span>
        )}
      </div>
      <h3 className="mt-8 text-xl font-bold text-navy">{teacher.name}</h3>
      {subjects && <p className="mt-2 text-sm font-bold tracking-wide text-navy/40 uppercase">{subjects}</p>}
      {teacher.bio && <p className="mt-4 leading-relaxed text-navy/60">{teacher.bio}</p>}
    </div>
  );
}
