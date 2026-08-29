"use client";

import { siteConfig } from "@/lib/site-config";
import { useHeaderTheme } from "./header-theme";

export default function HeaderLogo() {
  const { scrolled, onDarkBanner } = useHeaderTheme();
  const white = onDarkBanner && !scrolled;

  return (
    <div className="flex items-center gap-2">
      <img
        src="/logo-icon.svg"
        alt=""
        className={`h-9 w-auto transition-[filter] ${white ? "brightness-0 invert" : ""}`}
      />
      <span
        className={`text-lg font-bold tracking-tight transition-colors ${white ? "text-white" : "text-navy"}`}
      >
        {siteConfig.name}
      </span>
    </div>
  );
}
