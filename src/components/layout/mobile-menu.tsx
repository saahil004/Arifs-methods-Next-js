"use client";

import { useState } from "react";
import { Menu, ChevronDown, X } from "lucide-react";
import { navLinks } from "@/lib/nav";
import Drawer from "../ui/drawer";
import AnimatedLink from "../ui/animated-link";
import SocialLinks from "./social-links";
import { siteConfig } from "@/lib/site-config";
import { motion, AnimatePresence } from "framer-motion";
import { useHeaderTheme } from "./header-theme";
import { useCourseNavGroups } from "@/lib/use-course-nav-groups";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const { scrolled, onDarkBanner } = useHeaderTheme();
  const white = onDarkBanner && !scrolled && !isOpen;
  const courseGroups = useCourseNavGroups();
  const links = navLinks.map((link) => (link.label === "Courses" ? { ...link, groups: courseGroups } : link));

  return (
    <>
      <button
        className="md:hidden"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6 text-navy" /> : <Menu className={`h-6 w-6 transition-colors ${white ? "text-white" : "text-navy"}`} />}
      </button>

      <Drawer isOpen={isOpen} close={() => setIsOpen(false)} place="left">
        <nav>
          <ul className="space-y-6">
            {links.map((link) => (
              <li key={link.href}>
                {link.groups?.length ? (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <AnimatedLink href={link.href} className="text-lg font-bold" onClick={() => setIsOpen(false)}>
                        {link.label}
                      </AnimatedLink>
                      <button
                        onClick={() => setOpenItem(openItem === link.label ? null : link.label)}
                        aria-expanded={openItem === link.label}
                        aria-label={`Toggle ${link.label} submenu`}
                        className="p-2"
                      >
                        <ChevronDown className={`h-5 w-5 transition-transform ${openItem === link.label ? "rotate-180" : ""}`} />
                      </button>
                    </div>

                    <AnimatePresence>
                      {openItem === link.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="ml-2 space-y-4 overflow-hidden"
                        >
                          {link.groups!.map((group) => (
                            <div key={group.title}>
                              <p className="text-sm font-bold uppercase tracking-wide text-white/40">{group.title}</p>
                              <ul className="mt-2 space-y-3">
                                {group.items.map((item) => (
                                  <li key={item.label}>
                                    <AnimatedLink href={item.href} className="text-white/60" onClick={() => setIsOpen(false)}>
                                      {item.label}
                                    </AnimatedLink>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : link.children ? (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <AnimatedLink href={link.href} className="text-lg font-bold" onClick={() => setIsOpen(false)}>
                        {link.label}
                      </AnimatedLink>
                      <button
                        onClick={() => setOpenItem(openItem === link.label ? null : link.label)}
                        aria-expanded={openItem === link.label}
                        aria-label={`Toggle ${link.label} submenu`}
                        className="p-2"
                      >
                        <ChevronDown className={`h-5 w-5 transition-transform ${openItem === link.label ? "rotate-180" : ""}`} />
                      </button>
                    </div>

                    <AnimatePresence>
                      {openItem === link.label && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="ml-2 space-y-3 overflow-hidden"
                        >{link.children.map((child) => (
                          <li key={child.href}>
                            <AnimatedLink href={child.href} className="text-white/60" onClick={() => setIsOpen(false)}>
                              {child.label}
                            </AnimatedLink>
                          </li>
                        ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <AnimatedLink href={link.href} className="text-lg font-bold" onClick={() => setIsOpen(false)}>
                    {link.label}
                  </AnimatedLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-12 space-y-1 text-white/60">
          <a href={`mailto:${siteConfig.contact.email}`} className="block hover:text-white">
            {siteConfig.contact.email}
          </a>
          <a href={siteConfig.contact.phoneHref} className="block hover:text-white">
            {siteConfig.contact.phone}
          </a>
        </div>

        <SocialLinks className="mt-6" />
      </Drawer>
    </>
  );
}
