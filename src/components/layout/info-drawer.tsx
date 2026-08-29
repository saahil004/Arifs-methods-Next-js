"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import Drawer from "../ui/drawer";
import SocialLinks from "./social-links";
import { siteConfig } from "@/lib/site-config";
import AnimatedLink from "../ui/animated-link";
import { useHeaderTheme } from "./header-theme";

const learnMoreLinks = siteConfig.learnMoreLinks;

export default function InfoDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrolled, onDarkBanner } = useHeaderTheme();
  const white = onDarkBanner && !scrolled;

  return (
    <>
      <button aria-label="More information" onClick={() => setIsOpen(true)}>
        <Info className={`h-5 w-5 transition-colors hover:text-amber ${white ? "text-white" : "text-navy"}`} />
      </button>

      <Drawer isOpen={isOpen} close={() => setIsOpen(false)} place="right">
        <p className="mb-10 leading-relaxed text-white/60">
          {siteConfig.tagline}
        </p>

        <div className="mb-10">
          <h3 className="mb-4 text-xl font-bold">Contact Info</h3>
          <div className="space-y-1 text-white/60">
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
        </div>

        <div className="mb-10">
          <h3 className="mb-4 text-xl font-bold">Learn More</h3>
          <ul className="space-y-2 text-white/60">
            {
              learnMoreLinks.map((link) => (
                <li key={link.label}>
                  <AnimatedLink href={link.href}>
                   {link.label}
                  </AnimatedLink>
                </li>
              ))
            }
          </ul>
        </div>

          <SocialLinks />
      </Drawer>
    </>
  );
}
