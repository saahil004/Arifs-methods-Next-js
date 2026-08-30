"use client";

import { useEffect, useState } from "react";
import type { NavLink } from "@/lib/nav";

type Course = { id: string; code: string; name: string; level: "O Level" | "A Level" };

// Fetched live rather than hardcoded — courses are managed via the admin
// panel, so a static list here would go stale the moment one gets added or
// removed, same reason the register form fetches instead of a fixed list.
export function useCourseNavGroups(): NavLink["groups"] {
  const [groups, setGroups] = useState<NavLink["groups"]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadCourses() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`);
        const data = await res.json();
        if (cancelled || !data.success) return;

        const courses: Course[] = data.courses;
        const toItems = (level: Course["level"]) =>
          courses
            .filter((c) => c.level === level)
            .map((c) => ({ label: `${c.name} (${c.code})`, href: "/register" }));

        const oLevelItems = toItems("O Level");
        const aLevelItems = toItems("A Level");
        const result: NonNullable<NavLink["groups"]> = [];
        if (oLevelItems.length) result.push({ title: "O Levels", items: oLevelItems });
        if (aLevelItems.length) result.push({ title: "A Levels", items: aLevelItems });
        setGroups(result);
      } catch {
        // Leave groups empty — the "Courses" link still works as a plain
        // link to /courses, it just won't show the dropdown.
      }
    }

    loadCourses();
    return () => {
      cancelled = true;
    };
  }, []);

  return groups;
}
