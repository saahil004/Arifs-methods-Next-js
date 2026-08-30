"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";
import { fetchRegistrations, UnauthorizedError, type Registration, type Level } from "@/lib/admin-api";

type LevelFilter = "all" | Level;
const UNSPECIFIED_GROUP = "No subject selected";

export default function AdminRegistrationsPage() {
  const router = useRouter();
  const { token, logout } = useAdminAuth();
  const [registrations, setRegistrations] = useState<Registration[] | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    fetchRegistrations(token)
      .then((data) => {
        if (!cancelled) setRegistrations(data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof UnauthorizedError) {
          logout();
          router.replace("/admin/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load registrations");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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

      {error && <p className="mt-4 text-red-600">{error}</p>}

      <div className="mt-8 rounded-3xl border border-navy/10 bg-white p-6 shadow-sm sm:p-8">
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
      </div>

      {registrations && groups.length === 0 && (
        <p className="mt-8 text-center text-navy/40">No registrations match your filters.</p>
      )}

      {groups.map(([subject, group]) => (
        <div key={subject} className="mt-6 rounded-3xl border border-navy/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-navy">{subject}</h2>
            <span className="rounded-full bg-navy/10 px-3 py-1 text-sm font-bold text-navy">
              {group.length} student{group.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-navy/10 text-sm text-navy/50">
                  <th className="pb-3 font-bold">Name</th>
                  <th className="pb-3 font-bold">Phone</th>
                  <th className="pb-3 font-bold">Email</th>
                  <th className="pb-3 font-bold">Level</th>
                  <th className="pb-3 font-bold">Registered</th>
                </tr>
              </thead>
              <tbody>
                {group.map((r) => (
                  <tr key={r.id} className="border-b border-navy/5 last:border-0">
                    <td className="py-3 text-navy">{r.name}</td>
                    <td className="py-3 text-navy/70">{r.phone}</td>
                    <td className="py-3 text-navy/70">{r.email || "—"}</td>
                    <td className="py-3 text-navy/70">{r.level}</td>
                    <td className="py-3 text-navy/60">
                      {new Date(r.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
