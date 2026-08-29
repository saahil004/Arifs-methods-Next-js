"use client";

import { useHeaderTheme } from "./header-theme";

export default function HeaderShell({ children }: { children: React.ReactNode }) {
  const { scrolled } = useHeaderTheme();

  return (
    <header
      className={
        scrolled
          ? "fixed top-0 left-0 right-0 z-40 bg-white shadow-md transition-all"
          : "absolute top-0 left-0 right-0 z-40 transition-all"
      }
    >
      {children}
    </header>
  );
}
