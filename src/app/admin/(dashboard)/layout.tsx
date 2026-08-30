"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth";
import AdminNav from "@/components/admin/admin-nav";
import AdminFooter from "@/components/admin/admin-footer";

// Scoped to this route group only — /admin/login sits outside it and
// deliberately doesn't get this nav or auth guard, since a visitor without a
// session needs to reach the login form itself.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, isLoading } = useAdminAuth();

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace("/admin/login");
    }
  }, [isLoading, token, router]);

  if (isLoading || !token) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <AdminNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</main>
      <AdminFooter />
    </div>
  );
}
