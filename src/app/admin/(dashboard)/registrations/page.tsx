"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Phone, Mail, ChevronDown } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";
import { fetchRegistrations, UnauthorizedError, type Registration, type Level } from "@/lib/admin-api";

type LevelFilter = "all" | Level;
const UNSPECIFIED_GROUP = "No subject selected";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string | null): email is string {
  return !!email && EMAIL_REGEX.test(email);
}

// Registrations are validated on submission (the backend rejects anything
// that doesn't match its own phone regex), but that just confirms the raw
// text is plausible — it doesn't produce a dialable format. This normalizes
// for the tel: link specifically and returns null if the result still
// doesn't look like a real number, so a malformed or legacy record doesn't
// render a broken Call button.
//
// Known, accepted limitation: a number given in another country's LOCAL
// format (a bare leading 0, no country code — e.g. a UK number written as
// "07911123456") is indistinguishable from a Pakistani local number and
// gets assumed to be Pakistani, since that's this business's near-exclusive
// market. A number that already includes a country code (via "+" or "00")
// is always handled correctly regardless of country.
function formatPhoneForTel(phone: string): string | null {
  const digitsAndPlus = phone.replace(/[^\d+]/g, "");

  let normalized: string;
  if (digitsAndPlus.startsWith("+")) {
    normalized = digitsAndPlus;
  } else if (digitsAndPlus.startsWith("00")) {
    // "00" is the common alternative to "+" for dialing internationally.
    normalized = `+${digitsAndPlus.slice(2)}`;
  } else if (digitsAndPlus.startsWith("0")) {
    normalized = `+92${digitsAndPlus.slice(1)}`;
  } else {
    normalized = `+${digitsAndPlus}`;
  }

  const digitCount = normalized.replace(/\D/g, "").length;
  if (digitCount < 8 || digitCount > 15) return null;
  return normalized;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function ContactButtons({ registration }: { registration: Registration }) {
  const tel = formatPhoneForTel(registration.phone);
  const email = isValidEmail(registration.email) ? registration.email : null;

  return (
    <div className="flex items-center gap-2">
      {tel && (
        <a
          href={`tel:${tel}`}
          aria-label={`Call ${registration.name}`}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/10 text-navy transition-colors hover:bg-navy hover:text-white"
        >
          <Phone className="h-4 w-4" />
        </a>
      )}
      {email && (
        <a
          href={`mailto:${email}`}
          aria-label={`Email ${registration.name}`}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/10 text-navy transition-colors hover:bg-navy hover:text-white"
        >
          <Mail className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}

function MobileRegistrationRow({ registration }: { registration: Registration }) {
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

      {expanded && (
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
          <div className="pt-1">
            <ContactButtons registration={registration} />
          </div>
        </div>
      )}
    </div>
  );
}

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

          {/* Desktop: full table. Below sm, five columns plus contact
              buttons doesn't fit — a collapsible card list takes over instead. */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-navy/10 text-sm text-navy/50">
                  <th className="pb-3 font-bold">Name</th>
                  <th className="pb-3 font-bold">Phone</th>
                  <th className="pb-3 font-bold">Email</th>
                  <th className="pb-3 font-bold">Level</th>
                  <th className="pb-3 font-bold">Registered</th>
                  <th className="pb-3 font-bold">
                    <span className="sr-only">Contact</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.map((r) => (
                  <tr key={r.id} className="border-b border-navy/5 last:border-0">
                    <td className="py-3 text-navy">{r.name}</td>
                    <td className="py-3 text-navy/70">{r.phone}</td>
                    <td className="py-3 text-navy/70">{r.email || "—"}</td>
                    <td className="py-3 text-navy/70">{r.level}</td>
                    <td className="py-3 text-navy/60">{formatDate(r.created_at)}</td>
                    <td className="py-3">
                      <ContactButtons registration={r} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden">
            {group.map((r) => (
              <MobileRegistrationRow key={r.id} registration={r} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
