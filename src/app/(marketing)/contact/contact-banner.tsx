"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useHeaderTheme } from "@/components/layout/header-theme";

export default function ContactBanner({
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
    <section
      // The slope is a fixed percentage of the section's own height, but the
      // section is much narrower on mobile — the same percentage drop then
      // happens over far less horizontal distance, turning an elegant slope
      // into a sharp wedge. Shallower on small screens, fuller on desktop
      // where the extra width carries it well.
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy pt-20 [clip-path:polygon(0_0,100%_0,100%_100%,0_94%)] sm:[clip-path:polygon(0_0,100%_0,100%_100%,0_88%)] lg:[clip-path:polygon(0_0,100%_0,100%_100%,0_85%)]"
    >
      {/* TODO: swap for a real banner photo — reusing hero.jpg as a
          placeholder for now, per request. A plain CSS background (not
          next/image) is required here specifically so bg-fixed works — an
          <img> has no "background" to attach. */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      />
      <div className="absolute inset-0 bg-navy/75" />

      {/* Decorative wave shapes, layered over the photo+overlay. */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 1440 440"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0,260 C280,340 520,180 820,240 C1120,300 1280,140 1440,200 L1440,0 L0,0 Z"
          fill="#ffffff"
          fillOpacity="0.05"
        />
        <path
          d="M0,440 C260,360 560,420 860,360 C1160,300 1300,380 1440,340 L1440,440 L0,440 Z"
          fill="#ffffff"
          fillOpacity="0.06"
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <h1 className="font-display text-4xl uppercase tracking-wide text-white sm:text-5xl">{title}</h1>
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
