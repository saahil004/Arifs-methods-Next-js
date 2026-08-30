"use client";

import { useEffect, useState } from "react";

// Defaults to false (the "not desktop" / mobile assumption) until the
// effect runs on mount, since matchMedia doesn't exist during SSR.
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // matchMedia doesn't exist during server rendering, so the real value
    // can only be read once mounted on the client — an effect is
    // unavoidable here, same as admin-auth.tsx's localStorage read.
    const mql = window.matchMedia(query);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMatches(mql.matches);

    function handleChange(e: MediaQueryListEvent) {
      setMatches(e.matches);
    }
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

// Matches the admin nav's own desktop breakpoint (lg), so "desktop" means
// the same thing everywhere in the admin panel.
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}
