"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks } from "@/lib/nav";
import { useHeaderTheme } from "./header-theme";

export default function DesktopNav() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const { scrolled, onDarkBanner } = useHeaderTheme();
  const white = onDarkBanner && !scrolled;

  return (
    <nav className="hidden md:flex md:gap-8 lg:gap-9">
      {navLinks.map((link) => {
        const hasMega = !!link.groups?.length;
        const isOpen = openItem === link.label;
        const activeGroupData = link.groups?.find((g) => g.title === activeGroup);

        return (
          <div
            key={link.href}
            className="relative"
            onMouseEnter={() => hasMega && setOpenItem(link.label)}
            onMouseLeave={() => {
              if (hasMega) {
                setOpenItem(null);
                setActiveGroup(null);
              }
            }}
          >
            {hasMega ? (
              <Link
                className={`flex items-center gap-1 text-[17px] font-bold transition-colors ${isOpen ? "text-amber" : white ? "text-white hover:text-amber" : "text-navy hover:text-amber"
                  }`}
                aria-expanded={isOpen}
                href={link.href}
              >
                {link.label}
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                    }`}
                />
              </Link>
            ) : (
              <Link
                href={link.href}
                className={`flex items-center gap-1 text-[17px] font-bold transition-colors hover:text-amber ${white ? "text-white" : "text-navy"}`}
              >
                {link.label}
              </Link>
            )}

            {hasMega && (
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute left-0 top-full z-50 mt-4 flex items-start gap-4"
                  >
                    <div className="w-64 rounded-2xl bg-white p-6 shadow-xl">
                      <ul className="space-y-1">
                        {link.groups!.map((group) => (
                          <li key={group.title}>
                            <button
                              type="button"
                              onMouseEnter={() => setActiveGroup(group.title)}
                              className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] font-bold text-navy transition-colors hover:text-amber"
                            >
                              {group.title}
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <AnimatePresence mode="wait">
                      {activeGroupData && (
                        <motion.div
                          key={activeGroupData.title}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -6 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="w-56 rounded-2xl bg-white p-6 shadow-xl"
                        >
                          <ul className="space-y-3">
                            {activeGroupData.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  className="text-[15px] font-semibold text-navy hover:text-amber"
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        );
      })}
    </nav>
  );
}
