"use client";

import { useEffect, useState, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, Mail, BookOpen, GraduationCap, Users, Activity, Eye } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  fetchRegistrations,
  fetchSubscribers,
  fetchCourses,
  fetchTeachers,
  fetchAnalyticsOverview,
  UnauthorizedError,
} from "@/lib/admin-api";

type Stats = {
  registrations: number;
  subscribers: number;
  courses: number;
  teachers: number;
};

type Analytics = {
  activeUsers: number;
  sessions: number;
  screenPageViews: number;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { token, logout } = useAdminAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    // A session that expired between login and now surfaces here as a 401 on
    // the first real request — treat that as a sign-out rather than showing
    // a generic error the admin can't act on.
    function handleUnauthorized() {
      if (cancelled) return;
      logout();
      router.replace("/admin/login");
    }

    async function load() {
      if (!token) return;

      try {
        const [registrations, subscribers, courses, teachers] = await Promise.all([
          fetchRegistrations(token),
          fetchSubscribers(token),
          fetchCourses(),
          fetchTeachers(),
        ]);
        if (!cancelled) {
          setStats({
            registrations: registrations.length,
            subscribers: subscribers.length,
            courses: courses.length,
            teachers: teachers.length,
          });
        }
      } catch (err) {
        if (err instanceof UnauthorizedError) {
          handleUnauthorized();
          return;
        }
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      }

      try {
        const overview = await fetchAnalyticsOverview(token);
        if (!cancelled) setAnalytics(overview);
      } catch (err) {
        if (err instanceof UnauthorizedError) {
          handleUnauthorized();
          return;
        }
        // Analytics is otherwise supplementary — don't block the rest of the
        // dashboard if GA4 is slow or unavailable for a non-auth reason.
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [token, logout, router]);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div>
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Welcome back</h1>
        <p className="mt-1 text-navy/50">{today}</p>
      </div>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      <Section title="Overview">
        <StatTile icon={ClipboardList} label="Registrations" value={stats?.registrations} accent="navy" />
        <StatTile icon={Mail} label="Newsletter Subscribers" value={stats?.subscribers} accent="navy" />
        <StatTile icon={BookOpen} label="Courses" value={stats?.courses} accent="navy" />
        <StatTile icon={GraduationCap} label="Teachers" value={stats?.teachers} accent="navy" />
      </Section>

      <Section title="Website Traffic" subtitle="Last 30 days, via Google Analytics">
        <StatTile icon={Users} label="Active Users" value={analytics?.activeUsers} accent="amber" />
        <StatTile icon={Activity} label="Sessions" value={analytics?.sessions} accent="amber" />
        <StatTile icon={Eye} label="Page Views" value={analytics?.screenPageViews} accent="amber" />
      </Section>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 rounded-3xl border border-navy/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-extrabold text-navy">{title}</h2>
        {subtitle && <p className="text-sm text-navy/50">{subtitle}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{children}</div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number | undefined;
  accent: "navy" | "amber";
}) {
  return (
    <div className="rounded-2xl bg-cream p-5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          accent === "navy" ? "bg-navy/10 text-navy" : "bg-amber/20 text-navy"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm font-bold text-navy/50">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-navy">{value ?? "—"}</p>
    </div>
  );
}
