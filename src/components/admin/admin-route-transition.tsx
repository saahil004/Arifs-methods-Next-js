"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// Longer than the marketing RouteTransition's 800ms — the letter-stagger
// below finishes revealing "ADMINS" at ~1000ms (300ms delayChildren + 5 gaps
// of 80ms + the last letter's own 300ms fade-in), so this needs enough
// runway to hold the completed word visible for a moment before hiding.
const VISIBLE_MS = 1300;
const TEXT = "ADMINS";

// Same click-triggered pattern as the marketing site's RouteTransition —
// deliberately doesn't fire on initial mount, since that case is handled by
// the pure-CSS .admin-splash-overlay baked into admin/layout.tsx, which
// appears instantly at first paint with no hydration delay. Kept as its own
// component (not shared with the marketing one) since the admin shell has no
// dependency on marketing's context, by design.
const letterContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};

const letterVariant: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function AdminRouteTransition() {
  const [isNavigating, setIsNavigating] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      // Scheduled unconditionally rather than waiting for a route-change
      // event — see route-transition.tsx's identical reasoning: a fixed
      // timer can't get stuck the way pathname-watching did on back/forward.
      setIsNavigating(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => setIsNavigating(false), VISIBLE_MS);
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white"
        >
          <motion.img
            src="/logo-icon.svg"
            alt=""
            className="h-48 w-48"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: [0.7, 1.1, 1], opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          <motion.div
            className="font-display mt-4 flex text-5xl uppercase tracking-wide text-navy"
            variants={letterContainer}
            initial="hidden"
            animate="visible"
          >
            {TEXT.split("").map((letter, i) => (
              <motion.span key={i} variants={letterVariant}>
                {letter}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
