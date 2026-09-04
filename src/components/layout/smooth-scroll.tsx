"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, type LenisRef } from "lenis/react";
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
  const pathname = usePathname();
  const lenisRef = useRef<LenisRef>(null);

  // Next resets window.scrollY on navigation, but Lenis keeps its own
  // animatedScroll/targetScroll and is the thing actually driving the page.
  // Leaving the two to agree by luck is how you end up landing mid-page, or
  // sitting at the top until the first wheel event snaps you back down to
  // wherever the previous page was. Resetting Lenis itself makes where a
  // link lands deterministic.
  //
  // Skipped when there's a hash, so /terms#privacy still lands on the
  // Privacy section instead of being yanked to the top.
  useEffect(() => {
    if (!isDesktop) return;
    if (window.location.hash) return;
    lenisRef.current?.lenis?.scrollTo(0, { immediate: true });
  }, [pathname, isDesktop]);

  // Lenis caches how far the page can scroll and only recalculates it on a
  // window resize. A client-side navigation changes the page's height
  // without firing one, so it kept the previous page's limit — navigating
  // from a short page to a tall one left you unable to scroll past roughly
  // where the old page ended. Watching the body covers that plus anything
  // else that changes height after measuring: images finishing loading,
  // accordions opening, revalidated content swapping in.
  useEffect(() => {
    if (!isDesktop) return;
    const observer = new ResizeObserver(() => lenisRef.current?.lenis?.resize());
    observer.observe(document.body);
    return () => observer.disconnect();
  }, [isDesktop]);

  if (!isDesktop) return null;
  return <ReactLenis root options={{ duration: 1.1 }} ref={lenisRef} />;
}
