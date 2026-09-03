"use client";

import { createContext, useContext, useEffect, useState } from "react";

type HeaderTheme = {
  scrolled: boolean;
  onDarkBanner: boolean;
  setOnDarkBanner: (value: boolean) => void;
  /**
   * Lets a section pull the header out of view for its own duration — used
   * by the home page's pinned subject cards, where a white bar floating
   * over a full-bleed coloured card reads as a mistake.
   */
  headerHidden: boolean;
  setHeaderHidden: (value: boolean) => void;
};

const HeaderThemeContext = createContext<HeaderTheme | null>(null);

export function HeaderThemeProvider({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [onDarkBanner, setOnDarkBanner] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > window.innerHeight - 100);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <HeaderThemeContext.Provider
      value={{ scrolled, onDarkBanner, setOnDarkBanner, headerHidden, setHeaderHidden }}
    >
      {children}
    </HeaderThemeContext.Provider>
  );
}

export function useHeaderTheme() {
  const ctx = useContext(HeaderThemeContext);
  if (!ctx) throw new Error("useHeaderTheme must be used within HeaderThemeProvider");
  return ctx;
}
