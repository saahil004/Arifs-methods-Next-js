"use client";

import { ReactLenis } from "lenis/react";
import { useIsDesktop } from "@/lib/use-media-query";

// Desktop-only, home-page-only scroll smoothing — mounted inside the home
// page's own tree (not the root layout) so it's naturally active only while
// on "/", and automatically cleaned up (restoring native scroll) the moment
// the user navigates elsewhere. Gated behind useIsDesktop() for the same
// reason bg-fixed is: inertial scroll fights native momentum scrolling on
// touch devices rather than complementing it, and mobile browsers already
// have their own scroll physics users expect.
//
// root mode drives the actual window/document scroll rather than a wrapper
// div, so nothing else on the page (the header's scroll listener, Framer
// Motion's whileInView triggers, anchor links) needs to know this exists.
export default function SmoothScroll() {
  const isDesktop = useIsDesktop();
  if (!isDesktop) return null;
  return <ReactLenis root options={{ duration: 1.1 }} />;
}
