"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const MIN_VISIBLE_MS = 500;

export default function RouteTransition() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const shownAtRef = useRef<number | null>(null);
  const isNavigatingRef = useRef(false);
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

      shownAtRef.current = Date.now();
      isNavigatingRef.current = true;
      setIsNavigating(true);
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  useEffect(() => {
    if (!isNavigatingRef.current) return;
    const elapsed = shownAtRef.current ? Date.now() - shownAtRef.current : 0;
    const remaining = Math.max(MIN_VISIBLE_MS - elapsed, 0);

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      isNavigatingRef.current = false;
      setIsNavigating(false);
    }, remaining);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <AnimatePresence>
      {isNavigating && (
        <>
          <motion.div
            key="bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-x-0 top-0 z-100 h-1 overflow-hidden bg-amber/20"
          >
            <motion.div
              className="h-full bg-amber"
              initial={{ width: "0%" }}
              animate={{ width: "90%" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </motion.div>

          <motion.div
            key="badge"
            initial={{ opacity: 0, scale: 0.5, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="pointer-events-none fixed right-6 top-4 z-100 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md"
          >
            <motion.img
              src="/logo-icon.svg"
              alt=""
              className="h-5 w-5"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
