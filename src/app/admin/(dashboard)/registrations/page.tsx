"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Archive, ArchiveRestore } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  fetchRegistrations,
  archiveRegistration,
  unarchiveRegistration,
  UnauthorizedError,
  type Registration,
  type Level,
} from "@/lib/admin-api";
import { fadeUp, fadeUpStagger } from "@/lib/motion";
import { formatDate } from "@/lib/format";
import ContactButtons from "@/components/admin/contact-buttons";

type LevelFilter = "all" | Level;
const UNSPECIFIED_GROUP = "No subject selected";

function ArchiveButton({
  registration,
  isArchived,
  onArchive,
  onUnarchive,
}: {
  registration: Registration;
  isArchived: boolean;
  onArchive: (r: Registration) => void;
  onUnarchive: (r: Registration) => void;
}) {
  if (isArchived) {
    return (
      <button
        type="button"
        onClick={() => onUnarchive(registration)}
        aria-label={`Restore ${registration.name}`}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/10 text-navy transition-colors hover:bg-navy hover:text-white"
      >
        <ArchiveRestore className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onArchive(registration)}
      aria-label={`Archive ${registration.name}`}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/10 text-navy transition-colors hover:bg-navy hover:text-white"
    >
      <Archive className="h-4 w-4" />
    </button>
  );
}

function MobileRegistrationRow({
  registration,
  isArchived,
  onArchive,
  onUnarchive,
}: {
  registration: Registration;
  isArchived: boolean;
  onArchive: (r: Registration) => void;
  onUnarchive: (r: Registration) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-navy/5 py-3 last:border-0">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-bold text-navy">{registration.name}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-navy/40 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2 text-sm">
              <p>
                <span className="text-navy/50">Phone: </span>
                <span className="text-navy">{registration.phone}</span>
              </p>
              <p>
                <span className="text-navy/50">Email: </span>
                <span className="text-navy">{registration.email || "—"}</span>
              </p>
              <p>
                <span className="text-navy/50">Level: </span>
                <span className="text-navy">{registration.level}</span>
              </p>
              <p>
                <span className="text-navy/50">Registered: </span>
                <span className="text-navy">{formatDate(registration.created_at)}</span>
              </p>
              <div className="flex items-center gap-2 pt-1">
                <ContactButtons name={registration.name} phone={registration.phone} email={registration.email} />
                <ArchiveButton
                  registration={registration}
                  isArchived={isArchived}
                  onArchive={onArchive}
                  onUnarchive={onUnarchive}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type View = "active" | "archived";

export default function AdminRegistrationsPage() {
  // useSearchParams() requires a Suspense boundary — this is what makes
  // `view` genuinely reactive to the admin nav's "Active"/"Archived"
  // dropdown links. A one-time read of window.location at mount (the
  // earlier approach) looked right locally but silently failed to update
  // when clicking a different link while already on this page: Next.js
  // reuses the same page instance for a query-string-only navigation, so a
  // value only read once at mount never sees the change.
  return (
    <Suspense fallback={null}>
      <AdminRegistrationsPageInner />
    </Suspense>
  );
}

function AdminRegistrationsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, logout } = useAdminAuth();
  const [registrations, setRegistrations] = useState<Registration[] | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  // The URL is the source of truth for which view is showing, not local
  // state — so both the nav dropdown's links and the in-page toggle below
  // (which now navigates instead of calling a setter) always agree.
  const view: View = searchParams.get("view") === "archived" ? "archived" : "active";
  const [loadedView, setLoadedView] = useState<View>(view);

  function setView(next: View) {
    router.replace(`/admin/registrations?view=${next}`, { scroll: false });
  }

  // Reset the stale list the instant `view` changes, during render rather
  // than in the effect below — this is React's supported pattern for
  // "adjust state when a prop changes" and avoids the cascading-render
  // warning that a synchronous setState inside an effect body triggers.
  if (view !== loadedView) {
    setLoadedView(view);
    setRegistrations(null);
  }

  function handleUnauthorized() {
    logout();
    router.replace("/admin/login");
  }

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    fetchRegistrations(token, { archived: view === "archived" })
      .then((data) => {
        if (!cancelled) setRegistrations(data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof UnauthorizedError) {
          handleUnauthorized();
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load registrations");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, view]);

  async function handleArchive(registration: Registration) {
    if (!token) return;
    if (!window.confirm(`Archive ${registration.name}'s registration? It will be permanently deleted after 14 days.`))
      return;

    try {
      await archiveRegistration(token, registration.id);
      setRegistrations((prev) => prev?.filter((r) => r.id !== registration.id) ?? prev);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        handleUnauthorized();
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to archive registration");
    }
  }

  async function handleUnarchive(registration: Registration) {
    if (!token) return;

    try {
      await unarchiveRegistration(token, registration.id);
      setRegistrations((prev) => prev?.filter((r) => r.id !== registration.id) ?? prev);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        handleUnauthorized();
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to restore registration");
    }
  }

  const filtered = useMemo(() => {
    if (!registrations) return [];
    const query = search.trim().toLowerCase();
    return registrations.filter((r) => {
      const matchesLevel = levelFilter === "all" || r.level === levelFilter;
      const matchesSearch =
        !query ||
        r.name.toLowerCase().includes(query) ||
        r.phone.toLowerCase().includes(query) ||
        (r.email ?? "").toLowerCase().includes(query);
      return matchesLevel && matchesSearch;
    });
  }, [registrations, search, levelFilter]);

  // Groups by subject — a registration with multiple subjects appears once
  // per subject it listed, which is the expected behavior for grouping by a
  // multi-select tag rather than a single category.
  const groups = useMemo(() => {
    const map = new Map<string, Registration[]>();
    for (const r of filtered) {
      const subjects = r.subjects.length > 0 ? r.subjects : [UNSPECIFIED_GROUP];
      for (const subject of subjects) {
        if (!map.has(subject)) map.set(subject, []);
        map.get(subject)!.push(r);
      }
    }
    return Array.from(map.entries()).sort(([a], [b]) => {
      if (a === UNSPECIFIED_GROUP) return 1;
      if (b === UNSPECIFIED_GROUP) return -1;
      return a.localeCompare(b);
    });
  }, [filtered]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy">Registrations</h1>
      <p className="mt-1 text-navy/50">
        {registrations ? `${registrations.length} total` : "Loading..."}
        {registrations && filtered.length !== registrations.length ? ` — ${filtered.length} matching filters` : ""}
      </p>

      <div className="mt-4 inline-flex rounded-xl border border-navy/15 bg-white p-1">
        <button
          type="button"
          onClick={() => setView("active")}
          className={`rounded-lg px-4 py-1.5 text-sm font-bold transition-colors ${
            view === "active" ? "bg-navy text-white" : "text-navy/50 hover:text-navy"
          }`}
        >
          Active
        </button>
        <button
          type="button"
          onClick={() => setView("archived")}
          className={`rounded-lg px-4 py-1.5 text-sm font-bold transition-colors ${
            view === "archived" ? "bg-navy text-white" : "text-navy/50 hover:text-navy"
          }`}
        >
          Archived
        </button>
      </div>

      {view === "archived" && (
        <p className="mt-3 text-sm text-navy/50">Archived registrations are permanently deleted after 14 days.</p>
      )}

      {error && <p className="mt-4 text-red-600">{error}</p>}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mt-8 rounded-3xl border border-navy/10 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-navy/30" />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-navy/15 py-2 pr-4 pl-9 text-navy placeholder:text-navy/40 focus:border-amber focus:outline-none"
            />
          </div>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as LevelFilter)}
            className="rounded-xl border border-navy/15 px-4 py-2 text-navy focus:border-amber focus:outline-none"
          >
            <option value="all">All levels</option>
            <option value="O Level">O Level</option>
            <option value="A Level">A Level</option>
          </select>
        </div>
      </motion.div>

      {registrations && groups.length === 0 && (
        <p className="mt-8 text-center text-navy/40">No registrations match your filters.</p>
      )}

      {groups.map(([subject, group], idx) => (
        <motion.div
          key={subject}
          custom={idx}
          initial="hidden"
          animate="visible"
          variants={fadeUpStagger}
          className="mt-6 rounded-3xl border border-navy/10 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-navy">{subject}</h2>
            <span className="rounded-full bg-navy/10 px-3 py-1 text-sm font-bold text-navy">
              {group.length} student{group.length === 1 ? "" : "s"}
            </span>
          </div>

          {/* Desktop: full table, matching the admin nav's own lg breakpoint
              for when a screen is genuinely "desktop-sized." Below that, six
              columns plus contact/archive buttons has no room to breathe —
              a collapsible card list takes over instead. */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-navy/10 text-sm text-navy/50">
                  <th className="py-3 pr-3 font-bold">Name</th>
                  <th className="px-3 py-3 font-bold">Phone</th>
                  <th className="px-3 py-3 font-bold">Email</th>
                  <th className="px-3 py-3 font-bold">Level</th>
                  <th className="px-3 py-3 font-bold">Registered</th>
                  <th className="py-3 pl-3 font-bold">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.map((r) => (
                  <tr key={r.id} className="border-b border-navy/5 last:border-0">
                    <td className="py-3 pr-3 text-navy">{r.name}</td>
                    <td className="px-3 py-3 text-navy/70">{r.phone}</td>
                    <td className="px-3 py-3 text-navy/70">{r.email || "—"}</td>
                    <td className="px-3 py-3 text-navy/70">{r.level}</td>
                    <td className="px-3 py-3 text-navy/60">{formatDate(r.created_at)}</td>
                    <td className="py-3 pl-3">
                      <div className="flex items-center gap-2">
                        <ContactButtons name={r.name} phone={r.phone} email={r.email} />
                        <ArchiveButton
                          registration={r}
                          isArchived={view === "archived"}
                          onArchive={handleArchive}
                          onUnarchive={handleUnarchive}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden">
            {group.map((r) => (
              <MobileRegistrationRow
                key={r.id}
                registration={r}
                isArchived={view === "archived"}
                onArchive={handleArchive}
                onUnarchive={handleUnarchive}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
