"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";
import Drawer from "@/components/ui/drawer";
import AnimatedLink from "@/components/ui/animated-link";

const links = [
  { label: "Dashboard", href: "/admin" },
  { label: "Registrations", href: "/admin/registrations" },
  { label: "Newsletter", href: "/admin/newsletter" },
  { label: "Courses", href: "/admin/courses" },
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
            <Link key={link.href} href={link.href} className="text-[17px] font-bold text-white transition-colors hover:text-amber">
              {link.label}
            </Link>
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
              {links.map((link) => (
                <li key={link.href}>
                  <AnimatedLink href={link.href} className="text-lg font-bold" onClick={() => setIsOpen(false)}>
                    {link.label}
                  </AnimatedLink>
                </li>
              ))}
              <li className="pt-2">
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-amber px-6 py-2.5 text-base font-bold text-navy transition-colors hover:bg-amber/90"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </Drawer>
      </div>
    </header>
  );
}
