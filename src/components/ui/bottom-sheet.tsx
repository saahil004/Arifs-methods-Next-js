"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { X } from "lucide-react";

// Public-site equivalent of the admin panel's AdminModal/AdminDrawer pair —
// light navy/white, but this site has no need for the modal/drawer split by
// breakpoint those use, since there's only one "card -> full detail" flow
// here so far. Slides up from the bottom at every width instead.
export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  // undefined wherever there's no Lenis (mobile, and the admin panel).
  const lenis = useLenis();

  useEffect(() => {
    if (!isOpen) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    // Lenis drives the scroll itself via rAF and ignores the overflow lock
    // above, so it has to be stopped explicitly or the page keeps moving
    // behind the sheet.
    lenis?.stop();
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [isOpen, onClose, lenis]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-navy/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            // Lets wheel events inside the sheet scroll it natively rather
            // than being swallowed by Lenis and moving the page underneath.
            data-lenis-prevent
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:p-8"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
          >
            {/* Grab-handle affordance — signals "this slides," matches the
                convention mobile bottom sheets use even though this one
                isn't draggable, just tap-to-close via the button/backdrop. */}
            <div className="mx-auto -mt-2 mb-4 h-1.5 w-12 rounded-full bg-navy/10" />

            <div className="mb-6 flex items-center justify-between">
              {title && <h2 className="text-lg font-extrabold text-navy">{title}</h2>}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-navy/40 transition-colors hover:bg-navy/10 hover:text-navy"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
