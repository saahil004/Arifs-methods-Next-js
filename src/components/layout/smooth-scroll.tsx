"use client";

import { ReactLenis } from "lenis/react";
import { useIsDesktop } from "@/lib/use-media-query";

// Desktop-only scroll smoothing across the public site — mounted in the
// (marketing) layout, so it covers every public page but deliberately not
// the admin panel, which is a working tool where inertial scroll would just
// slow down scanning long registration/newsletter tables.
//
// Gated behind useIsDesktop() for the same reason bg-fixed is: inertial
// scroll fights native momentum scrolling on touch devices rather than
// complementing it, and mobile browsers already have their own scroll
// physics users expect.
//
// root mode drives the actual window/document scroll rather than a wrapper
// div, so nothing else on the page (the header's scroll listener, Framer
// Motion's whileInView triggers, anchor links, the terms page's scrollspy)
// needs to know this exists.
export default function SmoothScroll() {
  const isDesktop = useIsDesktop();
  if (!isDesktop) return null;
  return <ReactLenis root options={{ duration: 1.1 }} />;
}
