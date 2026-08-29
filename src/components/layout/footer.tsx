"use client";

import Link from "next/link";
import { FaTwitter, FaFacebookF, FaDribbble, FaInstagram, FaYoutube } from "react-icons/fa";
import { siteConfig } from "@/lib/site-config";

const socials = [
  { icon: FaTwitter, label: "Twitter", href: siteConfig.social.twitter },
  { icon: FaFacebookF, label: "Facebook", href: siteConfig.social.facebook },
  { icon: FaDribbble, label: "Dribbble", href: siteConfig.social.dribbble },
  { icon: FaInstagram, label: "Instagram", href: siteConfig.social.instagram },
  { icon: FaYoutube, label: "Youtube", href: siteConfig.social.youtube },
];

export default function Footer() {
  return (
    <footer
      className="relative bg-navy pb-16 pt-28 text-white"
      style={{ clipPath: "polygon(0 6%, 100% 0, 100% 100%, 0 100%)" }}
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl uppercase">{siteConfig.name}</p>
          <p className="mt-4 text-sm text-white/60">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="mt-6 flex gap-4">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-white/80 transition-colors hover:text-amber"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold">Get in Touch</h3>
          <div className="mt-4 space-y-1 text-white/60">
            <p>{siteConfig.contact.address.line1}</p>
            <p>{siteConfig.contact.address.line2}</p>
          </div>
          <div className="mt-4 space-y-1 text-white/60">
            <a href={`mailto:${siteConfig.contact.email}`} className="block hover:text-amber">
              {siteConfig.contact.email}
            </a>
            <a href={siteConfig.contact.phoneHref} className="block hover:text-amber">
              {siteConfig.contact.phone}
            </a>
          </div>
          <p className="mt-4 text-white/60">{siteConfig.contact.hours}</p>
        </div>

        <div>
          <h3 className="font-bold">Learn More</h3>
          <ul className="mt-4 space-y-2 text-white/60">
            {siteConfig.learnMoreLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-amber">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold">Our Newsletter</h3>
          <p className="mt-4 text-white/60">
            Subscribe to get updates on new courses and results delivered to you.
          </p>
          <form className="mt-4 flex" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              required
              placeholder="Email Address"
              className="w-full min-w-0 rounded-l-full bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-r-full bg-amber px-6 py-3 text-sm font-bold text-navy transition-colors hover:bg-amber/90"
            >
              Join
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
