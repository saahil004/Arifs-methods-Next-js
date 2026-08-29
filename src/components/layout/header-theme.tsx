"use client";

import { createContext, useContext, useEffect, useState } from "react";

type HeaderTheme = {
  scrolled: boolean;
  onDarkBanner: boolean;
  setOnDarkBanner: (value: boolean) => void;
};

const HeaderThemeContext = createContext<HeaderTheme | null>(null);

export function HeaderThemeProvider({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [onDarkBanner, setOnDarkBanner] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > window.innerHeight - 100);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <HeaderThemeContext.Provider value={{ scrolled, onDarkBanner, setOnDarkBanner }}>
      {children}
    </HeaderThemeContext.Provider>
  );
}

export function useHeaderTheme() {
  const ctx = useContext(HeaderThemeContext);
  if (!ctx) throw new Error("useHeaderTheme must be used within HeaderThemeProvider");
  return ctx;
}
