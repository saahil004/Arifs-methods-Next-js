"use client";

import { useState } from "react";
import type { Teacher } from "@/lib/admin-api";
import BottomSheet from "@/components/ui/bottom-sheet";
import SnapCarousel from "@/components/ui/snap-carousel";

export default function Faculty({ teachers }: { teachers: Teacher[] }) {
  const [selected, setSelected] = useState<Teacher | null>(null);
  if (teachers.length === 0) return null;

  return (
    <section id="faculty" className="relative scroll-mt-24 overflow-hidden bg-white py-16 sm:py-20">
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

        {/* relative z-10 is required here — the two decorative circles above
            are position: absolute, and CSS paints positioned elements above
            non-positioned siblings regardless of DOM order, even at the same
            (auto) z-index. Without this the circles painted on top of the
            cards despite coming first in the markup (the same bug fixed
            earlier on the Contact page's card).

            The roster is no longer capped: however many teachers an admin
            adds, four fill a page at lg and the rest page across. Arrows and
            dots only appear once there's a second page, so a small faculty
            still reads as a plain row of cards. */}
        <SnapCarousel label="Our teachers" className="relative z-10">
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} onReadMore={() => setSelected(teacher)} />
          ))}
        </SnapCarousel>
      </div>

      <BottomSheet isOpen={selected !== null} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && <TeacherDetails teacher={selected} />}
      </BottomSheet>
    </section>
  );
}

function TeacherCard({ teacher, onReadMore }: { teacher: Teacher; onReadMore: () => void }) {
  const subjects = teacher.courses.map((c) => c.name).join(", ");

  return (
    // No max-w cap on the base size: below sm there's one card per row, and
    // a fixed 288px cap left visible empty space on either side inside the
    // section's padding instead of the card actually filling the row.
    // flex flex-col + mt-auto on the button below keeps Read More aligned
    // to the same bottom edge across cards regardless of how long a given
    // teacher's name/subjects/bio preview runs.
    // shrink-0 + snap-start: the card is a page-sized item in a scroll-snap
    // track now, not a wrapping flex child, so it must hold its width and
    // offer itself as a snap point.
    <div className="flex w-full shrink-0 snap-start flex-col rounded-2xl bg-white p-8 shadow-[0_4px_30px_rgba(0,0,0,0.06)] sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]">
      <TeacherAvatar teacher={teacher} className="h-22 w-22 text-2xl" />
      <h3 className="mt-8 text-xl font-bold text-navy">{teacher.name}</h3>
      {subjects && <p className="mt-2 text-sm font-bold tracking-wide text-navy/40 uppercase">{subjects}</p>}
      {/* line-clamp-3, not the full bio — the untruncated version now lives
          in the sheet, so the card stays a predictable height regardless of
          how much an admin wrote for a given teacher. */}
      {teacher.bio && <p className="mt-4 line-clamp-3 leading-relaxed text-navy/60">{teacher.bio}</p>}
      <button
        type="button"
        onClick={onReadMore}
        className="mt-auto self-start pt-4 text-sm font-bold text-navy underline-offset-2 hover:text-amber hover:underline"
      >
        Read More
      </button>
    </div>
  );
}

function TeacherDetails({ teacher }: { teacher: Teacher }) {
  // No name label here — the sheet's own title bar already shows it, and
  // repeating it right below made the avatar row feel padded out rather
  // than purposeful.
  return (
    <div>
      <TeacherAvatar teacher={teacher} className="h-16 w-16 text-lg" />

      {teacher.courses.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {teacher.courses.map((c) => (
            <span key={c.id} className="rounded-full bg-navy/10 px-2.5 py-1 text-xs font-bold text-navy">
              {c.name}
            </span>
          ))}
        </div>
      )}

      {teacher.bio ? (
        <p className="mt-6 leading-relaxed text-navy/70">{teacher.bio}</p>
      ) : (
        <p className="mt-6 text-navy/40">No bio added yet.</p>
      )}
    </div>
  );
}

function TeacherAvatar({ teacher, className = "" }: { teacher: Teacher; className?: string }) {
  return (
    <div className={`flex items-center justify-center overflow-hidden rounded-full bg-navy/10 ${className}`}>
      {teacher.photoUrl ? (
        // A plain <img>, not next/image: photoUrl is an arbitrary URL an
        // admin pastes in, and next/image requires every remote host to be
        // allow-listed in next.config.ts up front — impractical here.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={teacher.photoUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="font-bold text-navy/40">{teacher.name.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}
