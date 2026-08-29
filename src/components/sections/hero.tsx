"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useHeaderTheme } from "@/components/layout/header-theme";

export default function Hero({
  eyebrow,
  title,
  subtitle,
  image,
  ctaLabel = "Register Now",
  ctaHref = "/register",
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  image?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const { setOnDarkBanner } = useHeaderTheme();

  useEffect(() => {
    setOnDarkBanner(true);
    return () => setOnDarkBanner(false);
  }, [setOnDarkBanner]);

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy bg-cover bg-center"
      style={image ? { backgroundImage: `url(${image})` } : undefined}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        {eyebrow && (
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-amber">{eyebrow}</p>
        )}
        <h1 className="font-display text-4xl uppercase leading-[1.05] tracking-wide text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-white/80">{subtitle}</p>
        <Link
          href={ctaHref}
          className="mt-8 inline-block rounded-full bg-amber px-8 py-4 font-bold text-navy transition-colors hover:bg-amber/90"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
