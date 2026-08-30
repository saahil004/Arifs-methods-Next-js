"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  UnauthorizedError,
  type Course,
  type CourseInput,
  type Level,
} from "@/lib/admin-api";
import AdminModal from "@/components/admin/admin-modal";
import { fadeUpStagger } from "@/lib/motion";

const inputClasses =
  "w-full rounded-xl border border-navy/15 px-4 py-3 text-navy placeholder:text-navy/40 focus:border-amber focus:outline-none";

const LEVELS: Level[] = ["O Level", "A Level"];

type LevelFilter = "all" | Level;

function sortCourses(courses: Course[]): Course[] {
  return [...courses].sort((a, b) => a.level.localeCompare(b.level) || a.name.localeCompare(b.name));
}

export default function AdminCoursesPage() {
  const router = useRouter();
  const { token, logout } = useAdminAuth();
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [error, setError] = useState("");
  const [modalCourse, setModalCourse] = useState<Course | "new" | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // Lets the admin nav's "O Levels"/"A Levels" dropdown links deep-link
  // straight into a filtered view (?level=O%20Level) instead of always
  // showing both. Reads window directly rather than useSearchParams() to
  // avoid that hook's Suspense-boundary requirement for a value this page
  // only needs once, at mount.
  const [levelFilter, setLevelFilter] = useState<LevelFilter>(() => {
    if (typeof window === "undefined") return "all";
    const level = new URLSearchParams(window.location.search).get("level");
    return level === "O Level" || level === "A Level" ? level : "all";
  });

  function handleUnauthorized() {
    logout();
    router.replace("/admin/login");
  }

  useEffect(() => {
    let cancelled = false;

    fetchCourses()
      .then((data) => {
        if (!cancelled) setCourses(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load courses");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete(course: Course) {
    if (!token) return;
    if (!window.confirm(`Delete "${course.name}"? This can't be undone.`)) return;

    setDeletingId(course.id);
    try {
      await deleteCourse(token, course.id);
      setCourses((prev) => prev?.filter((c) => c.id !== course.id) ?? prev);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        handleUnauthorized();
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to delete course");
    } finally {
      setDeletingId(null);
    }
  }

  function handleSaved(saved: Course) {
    setCourses((prev) => {
      if (!prev) return [saved];
      const exists = prev.some((c) => c.id === saved.id);
      return sortCourses(exists ? prev.map((c) => (c.id === saved.id ? saved : c)) : [...prev, saved]);
    });
    setModalCourse(null);
  }

  const groups = LEVELS.filter((level) => levelFilter === "all" || levelFilter === level).map((level) => ({
    level,
    items: (courses ?? []).filter((c) => c.level === level),
  }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Courses</h1>
          <p className="mt-1 text-navy/50">{courses ? `${courses.length} total` : "Loading..."}</p>
        </div>
        <button
          type="button"
          onClick={() => setModalCourse("new")}
          className="flex items-center gap-2 rounded-full bg-amber px-5 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-amber/90"
        >
          <Plus className="h-4 w-4" />
          Add Course
        </button>
      </div>

      <div className="mt-4 inline-flex rounded-xl border border-navy/15 bg-white p-1">
        {(["all", "O Level", "A Level"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setLevelFilter(option)}
            className={`rounded-lg px-4 py-1.5 text-sm font-bold transition-colors ${
              levelFilter === option ? "bg-navy text-white" : "text-navy/50 hover:text-navy"
            }`}
          >
            {option === "all" ? "All" : option}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {groups.map(({ level, items }, idx) => (
        <motion.div
          key={level}
          custom={idx}
          initial="hidden"
          animate="visible"
          variants={fadeUpStagger}
          className="mt-6 rounded-3xl border border-navy/10 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-navy">{level}</h2>
            <span className="rounded-full bg-navy/10 px-3 py-1 text-sm font-bold text-navy">
              {items.length} course{items.length === 1 ? "" : "s"}
            </span>
          </div>

          {courses && items.length === 0 && <p className="py-4 text-center text-navy/40">No courses yet.</p>}

          {items.length > 0 && (
            <>
              {/* Desktop: table. Below sm, code + name + two action buttons
                  is cramped — a card list takes over instead. */}
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-navy/10 text-sm text-navy/50">
                      <th className="py-3 pr-3 font-bold">Code</th>
                      <th className="px-3 py-3 font-bold">Name</th>
                      <th className="py-3 pl-3 font-bold">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((c) => (
                      <tr key={c.id} className="border-b border-navy/5 last:border-0">
                        <td className="py-3 pr-3 text-navy/70">{c.code}</td>
                        <td className="px-3 py-3 text-navy">{c.name}</td>
                        <td className="py-3 pl-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setModalCourse(c)}
                              aria-label={`Edit ${c.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/10 text-navy transition-colors hover:bg-navy hover:text-white"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(c)}
                              disabled={deletingId === c.id}
                              aria-label={`Delete ${c.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/10 text-navy transition-colors hover:bg-red-600 hover:text-white disabled:opacity-40"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 sm:hidden">
                {items.map((c) => (
                  <div key={c.id} className="flex items-center justify-between gap-3 rounded-2xl border border-navy/10 p-4">
                    <div className="min-w-0">
                      <p className="truncate font-bold text-navy">{c.name}</p>
                      <p className="text-sm text-navy/50">{c.code}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setModalCourse(c)}
                        aria-label={`Edit ${c.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/10 text-navy transition-colors hover:bg-navy hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c)}
                        disabled={deletingId === c.id}
                        aria-label={`Delete ${c.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/10 text-navy transition-colors hover:bg-red-600 hover:text-white disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      ))}

      <AdminModal
        isOpen={modalCourse !== null}
        onClose={() => setModalCourse(null)}
        title={modalCourse === "new" ? "Add Course" : "Edit Course"}
      >
        {modalCourse !== null && (
          <CourseForm
            key={modalCourse === "new" ? "new" : modalCourse.id}
            token={token}
            course={modalCourse === "new" ? null : modalCourse}
            onSaved={handleSaved}
            onUnauthorized={handleUnauthorized}
          />
        )}
      </AdminModal>
    </div>
  );
}

function CourseForm({
  token,
  course,
  onSaved,
  onUnauthorized,
}: {
  token: string | null;
  course: Course | null;
  onSaved: (course: Course) => void;
  onUnauthorized: () => void;
}) {
  const [code, setCode] = useState(course?.code ?? "");
  const [name, setName] = useState(course?.name ?? "");
  const [level, setLevel] = useState<Level>(course?.level ?? "O Level");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    setFormError("");
    const input: CourseInput = { code: code.trim(), name: name.trim(), level };

    try {
      const saved = course ? await updateCourse(token, course.id, input) : await createCourse(token, input);
      onSaved(saved);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        onUnauthorized();
        return;
      }
      setFormError(err instanceof Error ? err.message : "Failed to save course");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1.5 block text-sm font-bold text-navy">Level</label>
        <select value={level} onChange={(e) => setLevel(e.target.value as Level)} className={inputClasses}>
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-bold text-navy">Course Code</label>
        <input
          type="text"
          required
          maxLength={50}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. 4024"
          className={inputClasses}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-bold text-navy">Course Name</label>
        <input
          type="text"
          required
          maxLength={200}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Mathematics"
          className={inputClasses}
        />
      </div>

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-full bg-amber px-8 py-3.5 font-bold text-navy transition-transform duration-200 hover:scale-[1.02] hover:bg-amber/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving..." : course ? "Save Changes" : "Add Course"}
      </button>
    </form>
  );
}
