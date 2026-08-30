"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  fetchTeachers,
  fetchCourses,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  UnauthorizedError,
  type Teacher,
  type TeacherInput,
  type Course,
} from "@/lib/admin-api";
import AdminModal from "@/components/admin/admin-modal";

const inputClasses =
  "w-full rounded-xl border border-navy/15 px-4 py-3 text-navy placeholder:text-navy/40 focus:border-amber focus:outline-none";

export default function AdminTeachersPage() {
  const router = useRouter();
  const { token, logout } = useAdminAuth();
  const [teachers, setTeachers] = useState<Teacher[] | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState("");
  const [modalTeacher, setModalTeacher] = useState<Teacher | "new" | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleUnauthorized() {
    logout();
    router.replace("/admin/login");
  }

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchTeachers(), fetchCourses()])
      .then(([teacherData, courseData]) => {
        if (cancelled) return;
        setTeachers(teacherData);
        setCourses(courseData);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load teachers");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete(teacher: Teacher) {
    if (!token) return;
    if (!window.confirm(`Delete ${teacher.name}? This can't be undone.`)) return;

    setDeletingId(teacher.id);
    try {
      await deleteTeacher(token, teacher.id);
      setTeachers((prev) => prev?.filter((t) => t.id !== teacher.id) ?? prev);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        handleUnauthorized();
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to delete teacher");
    } finally {
      setDeletingId(null);
    }
  }

  function handleSaved(saved: Teacher) {
    setTeachers((prev) => {
      if (!prev) return [saved];
      const exists = prev.some((t) => t.id === saved.id);
      const next = exists ? prev.map((t) => (t.id === saved.id ? saved : t)) : [...prev, saved];
      return next.sort((a, b) => a.name.localeCompare(b.name));
    });
    setModalTeacher(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Teachers</h1>
          <p className="mt-1 text-navy/50">{teachers ? `${teachers.length} total` : "Loading..."}</p>
        </div>
        <button
          type="button"
          onClick={() => setModalTeacher("new")}
          className="flex items-center gap-2 rounded-full bg-amber px-5 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-amber/90"
        >
          <Plus className="h-4 w-4" />
          Add Teacher
        </button>
      </div>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {teachers && teachers.length === 0 && <p className="mt-8 text-center text-navy/40">No teachers yet.</p>}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teachers?.map((t) => (
          <TeacherCard
            key={t.id}
            teacher={t}
            deleting={deletingId === t.id}
            onEdit={() => setModalTeacher(t)}
            onDelete={() => handleDelete(t)}
          />
        ))}
      </div>

      <AdminModal
        isOpen={modalTeacher !== null}
        onClose={() => setModalTeacher(null)}
        title={modalTeacher === "new" ? "Add Teacher" : "Edit Teacher"}
      >
        {modalTeacher !== null && (
          <TeacherForm
            key={modalTeacher === "new" ? "new" : modalTeacher.id}
            token={token}
            teacher={modalTeacher === "new" ? null : modalTeacher}
            allCourses={courses}
            onSaved={handleSaved}
            onUnauthorized={handleUnauthorized}
          />
        )}
      </AdminModal>
    </div>
  );
}

function TeacherCard({
  teacher,
  deleting,
  onEdit,
  onDelete,
}: {
  teacher: Teacher;
  deleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy/10">
          {teacher.photoUrl ? (
            // A plain <img>, not next/image: photoUrl is an arbitrary URL an
            // admin pastes in, and next/image requires every remote host to
            // be allow-listed in next.config.ts up front — impractical here.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={teacher.photoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-navy/40">{teacher.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-extrabold text-navy">{teacher.name}</p>
          {teacher.bio && <p className="mt-1 line-clamp-2 text-sm text-navy/50">{teacher.bio}</p>}
        </div>
      </div>

      {teacher.courses.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {teacher.courses.map((c) => (
            <span key={c.id} className="rounded-full bg-navy/10 px-2.5 py-1 text-xs font-bold text-navy">
              {c.name}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 border-t border-navy/5 pt-4">
        <button
          type="button"
          onClick={onEdit}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-navy/10 px-4 py-2 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-white"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          aria-label={`Delete ${teacher.name}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy transition-colors hover:bg-red-600 hover:text-white disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function TeacherForm({
  token,
  teacher,
  allCourses,
  onSaved,
  onUnauthorized,
}: {
  token: string | null;
  teacher: Teacher | null;
  allCourses: Course[];
  onSaved: (teacher: Teacher) => void;
  onUnauthorized: () => void;
}) {
  const [name, setName] = useState(teacher?.name ?? "");
  const [bio, setBio] = useState(teacher?.bio ?? "");
  const [photoUrl, setPhotoUrl] = useState(teacher?.photoUrl ?? "");
  const [courseIds, setCourseIds] = useState<string[]>(teacher?.courses.map((c) => c.id) ?? []);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  function toggleCourse(id: string) {
    setCourseIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    setFormError("");
    const input: TeacherInput = {
      name: name.trim(),
      bio: bio.trim() || undefined,
      photoUrl: photoUrl.trim() || undefined,
      courseIds,
    };

    try {
      const saved = teacher ? await updateTeacher(token, teacher.id, input) : await createTeacher(token, input);
      onSaved(saved);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        onUnauthorized();
        return;
      }
      setFormError(err instanceof Error ? err.message : "Failed to save teacher");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1.5 block text-sm font-bold text-navy">Name</label>
        <input
          type="text"
          required
          maxLength={200}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Arif Khan"
          className={inputClasses}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-bold text-navy">Bio</label>
        <textarea
          rows={3}
          maxLength={2000}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Short bio (optional)"
          className={inputClasses}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-bold text-navy">Photo URL</label>
        <input
          type="url"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          placeholder="https://... (optional)"
          className={inputClasses}
        />
      </div>

      {allCourses.length > 0 && (
        <div>
          <label className="mb-1.5 block text-sm font-bold text-navy">Courses Taught</label>
          <div className="max-h-48 space-y-1.5 overflow-y-auto rounded-xl border border-navy/15 p-3">
            {allCourses.map((c) => (
              <label key={c.id} className="flex cursor-pointer items-center gap-2 text-sm text-navy">
                <input
                  type="checkbox"
                  checked={courseIds.includes(c.id)}
                  onChange={() => toggleCourse(c.id)}
                  className="h-4 w-4 rounded border-navy/30 text-amber focus:ring-amber"
                />
                {c.name} <span className="text-navy/40">({c.level})</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-full bg-amber px-8 py-3.5 font-bold text-navy transition-transform duration-200 hover:scale-[1.02] hover:bg-amber/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving..." : teacher ? "Save Changes" : "Add Teacher"}
      </button>
    </form>
  );
}
