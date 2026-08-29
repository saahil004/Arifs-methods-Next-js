"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useHeaderTheme } from "@/components/layout/header-theme";

export default function PageBanner({
  title,
  breadcrumb,
}: {
  title: string;
  breadcrumb: { label: string; href?: string }[];
}) {
  const { setOnDarkBanner } = useHeaderTheme();

  useEffect(() => {
    setOnDarkBanner(true);
    return () => setOnDarkBanner(false);
  }, [setOnDarkBanner]);

  return (
    <section className="flex min-h-[280px] items-center justify-center bg-navy pt-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h1 className="font-display text-3xl uppercase tracking-wide text-white sm:text-4xl">{title}</h1>
        <nav className="mt-4 flex items-center justify-center gap-2 text-sm text-white/60">
          {breadcrumb.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-amber">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-amber">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
