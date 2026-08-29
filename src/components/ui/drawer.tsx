"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function Drawer({
  isOpen,
  close,
  place = "right",
  title = siteConfig.name,
  children,
}: {
  isOpen: boolean;
  close: () => void;
  place?: "left" | "right";
  title?: string;
  children: React.ReactNode;
}) {
  const offset = place === "right" ? "100%" : "-100%";

  useEffect(() => {
    if (!isOpen) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => close()}
          />

          <motion.aside
            className={`fixed z-50 h-full w-full max-w-sm overflow-y-auto bg-[#1b1e27] p-8 text-white shadow-2xl ${
              place === "right" ? "top-0 right-0" : "top-0 left-0"
            }`}
            initial={{ x: offset }}
            animate={{ x: 0 }}
            exit={{ x: offset }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.35 }}
          >
            <div className="mb-8 flex items-start justify-between">
              <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
              <button
                onClick={() => close()}
                aria-label="Close"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/5 text-xl text-white transition hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
