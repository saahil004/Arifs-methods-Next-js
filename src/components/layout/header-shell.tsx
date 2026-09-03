"use client";

import { useHeaderTheme } from "./header-theme";

export default function HeaderShell({ children }: { children: React.ReactNode }) {
  const { scrolled, headerHidden } = useHeaderTheme();

  return (
    <header
      // Hidden by moving `top`, never by translate: a translate (or any
      // transform) on this element makes it the containing block for the
      // position:fixed drawers rendered inside it, which collapses them
      // from the full viewport down to the header's own 80px-tall box.
      className={`${scrolled ? "fixed bg-white shadow-md" : "absolute"} right-0 left-0 z-40 transition-all ${
        headerHidden ? "-top-20" : "top-0"
      }`}
    >
      {children}
    </header>
  );
}
