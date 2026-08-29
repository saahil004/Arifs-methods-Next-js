"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/lib/site-config";

const VISIBLE_MS = 800;

export default function RouteTransition() {
  // Deliberately does NOT show on initial mount — that case (opening the
  // site fresh, including a hard-reloaded 404) is handled by the pure-CSS
  // .splash-overlay baked directly into the server-rendered HTML in
  // layout.tsx, which appears instantly with no hydration delay. This
  // component only handles click-triggered client-side navigation.
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

      // Scheduled unconditionally, independent of whether the destination
      // page actually finishes loading or the router fires any particular
      // event afterward. That's deliberate: this used to clear itself by
      // watching for the pathname to change, but browser back/forward
      // navigation doesn't reliably trigger that in every case, which left
      // the overlay stuck on screen forever. A fixed timer can't get stuck —
      // worst case it just doesn't line up perfectly with a slow navigation,
      // which isn't a concern on a fully static, near-instant site like this.
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
            className="h-36 w-36"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: [0.7, 1.1, 1], opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          <motion.p
            className="font-display mt-4 text-2xl uppercase tracking-wide text-navy"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
          >
            {siteConfig.name}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
