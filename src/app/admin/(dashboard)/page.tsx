"use client";

import { useEffect, useState, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
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
import { fadeUpStagger } from "@/lib/motion";

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

      <Section index={0} title="Overview">
        <StatTile index={0} icon={ClipboardList} label="Registrations" value={stats?.registrations} accent="navy" />
        <StatTile index={1} icon={Mail} label="Newsletter Subscribers" value={stats?.subscribers} accent="navy" />
        <StatTile index={2} icon={BookOpen} label="Courses" value={stats?.courses} accent="navy" />
        <StatTile index={3} icon={GraduationCap} label="Teachers" value={stats?.teachers} accent="navy" />
      </Section>

      <Section index={1} title="Website Traffic" subtitle="Last 30 days, via Google Analytics">
        <StatTile index={0} icon={Users} label="Active Users" value={analytics?.activeUsers} accent="amber" />
        <StatTile index={1} icon={Activity} label="Sessions" value={analytics?.sessions} accent="amber" />
        <StatTile index={2} icon={Eye} label="Page Views" value={analytics?.screenPageViews} accent="amber" />
      </Section>
    </div>
  );
}

function Section({
  index,
  title,
  subtitle,
  children,
}: {
  index: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={fadeUpStagger}
      className="mt-8 rounded-3xl border border-navy/10 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-6">
        <h2 className="text-lg font-extrabold text-navy">{title}</h2>
        {subtitle && <p className="text-sm text-navy/50">{subtitle}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{children}</div>
    </motion.div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v).toLocaleString());
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 0.8, ease: "easeOut" });
    const unsubscribe = rounded.on("change", setDisplay);
    return () => {
      controls.stop();
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{display}</>;
}

function StatTile({
  index,
  icon: Icon,
  label,
  value,
  accent,
}: {
  index: number;
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number | undefined;
  accent: "navy" | "amber";
}) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={fadeUpStagger}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-2xl bg-cream p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          accent === "navy" ? "bg-navy/10 text-navy" : "bg-amber/20 text-navy"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm font-bold text-navy/50">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-navy">
        {value !== undefined ? <AnimatedNumber value={value} /> : "—"}
      </p>
    </motion.div>
  );
}
