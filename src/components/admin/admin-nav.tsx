"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";
import Drawer from "@/components/ui/drawer";
import AnimatedLink from "@/components/ui/animated-link";
import { fadeUpStagger } from "@/lib/motion";

type SubLink = { label: string; href: string };
type NavLink = { label: string; href: string; subLinks?: SubLink[] };

const links: NavLink[] = [
  { label: "Dashboard", href: "/admin" },
  {
    label: "Registrations",
    href: "/admin/registrations",
    subLinks: [
      { label: "Active", href: "/admin/registrations?view=active" },
      { label: "Archived", href: "/admin/registrations?view=archived" },
    ],
  },
  {
    label: "Newsletter",
    href: "/admin/newsletter",
    subLinks: [
      { label: "Send Newsletter", href: "/admin/newsletter?tab=send" },
      { label: "Queries", href: "/admin/newsletter?tab=queries" },
    ],
  },
  {
    label: "Courses",
    href: "/admin/courses",
    subLinks: [
      { label: "O Levels", href: "/admin/courses?level=O%20Level" },
      { label: "A Levels", href: "/admin/courses?level=A%20Level" },
    ],
  },
  { label: "Teachers", href: "/admin/teachers" },
];

export default function AdminNav() {
  const router = useRouter();
  const { logout } = useAdminAuth();
  const [isOpen, setIsOpen] = useState(false);

  function handleLogout() {
    if (!window.confirm("Are you sure you want to log out?")) return;
    setIsOpen(false);
    logout();
    router.push("/admin/login");
  }

  return (
    <header className="sticky top-0 z-40 bg-navy">
      <div className="relative mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <img src="/logo-icon.svg" alt="" className="h-9 w-auto brightness-0 invert" />
          <span className="text-lg font-bold tracking-tight text-white">Arif&apos;s Methods</span>
        </Link>

        <nav className="hidden lg:flex lg:gap-9">
          {links.map((link) => (
            <DesktopNavItem key={link.href} link={link} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="hidden rounded-full bg-amber px-5 py-2 text-[15px] font-bold text-navy transition-colors hover:bg-amber/90 lg:block"
          >
            Logout
          </button>

          <button
            className="lg:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>
        </div>

        <Drawer isOpen={isOpen} close={() => setIsOpen(false)} place="left">
          <nav>
            <ul className="space-y-6">
              {links.map((link, idx) => (
                <motion.li key={link.href} custom={idx} initial="hidden" animate="visible" variants={fadeUpStagger}>
                  <DrawerNavItem link={link} onNavigate={() => setIsOpen(false)} />
                </motion.li>
              ))}
              <motion.li
                custom={links.length}
                initial="hidden"
                animate="visible"
                variants={fadeUpStagger}
                className="pt-2"
              >
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-amber px-6 py-2.5 text-base font-bold text-navy transition-colors hover:bg-amber/90"
                >
                  Logout
                </button>
              </motion.li>
            </ul>
          </nav>
        </Drawer>
      </div>
    </header>
  );
}

// Hover-revealed dropdown — a mouse-driven pattern, which is a safe
// assumption here since touch/tablet widths get the drawer's tap-to-expand
// accordion instead (this nav only renders at all from lg/1024px up).
function DesktopNavItem({ link }: { link: NavLink }) {
  if (!link.subLinks) {
    return (
      <Link href={link.href} className="text-[17px] font-bold text-white transition-colors hover:text-amber">
        {link.label}
      </Link>
    );
  }

  return (
    <div className="group relative py-2">
      <Link
        href={link.href}
        className="flex items-center gap-1 text-[17px] font-bold text-white transition-colors hover:text-amber"
      >
        {link.label}
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
      </Link>
      <div className="invisible absolute left-0 top-full z-50 min-w-44 rounded-xl border border-navy/10 bg-white p-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        {link.subLinks.map((sub) => (
          <Link
            key={sub.href}
            href={sub.href}
            className="block rounded-lg px-3 py-2 text-sm font-bold text-navy transition-colors hover:bg-navy/5"
          >
            {sub.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

// Tap-to-expand accordion — the mobile-drawer counterpart to the desktop
// hover dropdown. The parent label still navigates directly; the chevron is
// a separate control just for revealing the sub-links.
function DrawerNavItem({ link, onNavigate }: { link: NavLink; onNavigate: () => void }) {
  const [expanded, setExpanded] = useState(false);

  if (!link.subLinks) {
    return (
      <AnimatedLink href={link.href} className="text-lg font-bold" onClick={onNavigate}>
        {link.label}
      </AnimatedLink>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <AnimatedLink href={link.href} className="text-lg font-bold" onClick={onNavigate}>
          {link.label}
        </AnimatedLink>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={expanded ? `Collapse ${link.label}` : `Expand ${link.label}`}
          className="p-1"
        >
          {/* Drawer's own background is dark (#1b1e27) — white, not navy,
              text/icon colors here, matching the rest of its theme. */}
          <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <ul className="mt-3 space-y-3 pl-4">
              {link.subLinks.map((sub) => (
                <li key={sub.href}>
                  <AnimatedLink href={sub.href} className="text-base font-bold text-white/60" onClick={onNavigate}>
                    {sub.label}
                  </AnimatedLink>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
