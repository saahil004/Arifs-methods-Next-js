"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// A horizontally paged track built on native scroll-snap: swipe, wheel and
// scrollbar drag all work with no JavaScript at all, and the arrows and dots
// below only mirror and drive that same scroll position.
//
// Children size themselves (e.g. w-full sm:w-[calc(50%-0.75rem)]), so this
// component never needs to know how many fit on a page — it reads the page
// count off the DOM instead, which keeps working at any breakpoint without
// a matching media query here.
export default function SnapCarousel({
  children,
  label,
  className = "",
}: {
  children: ReactNode;
  label: string;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  // 0 means "not measured yet", which is distinct from a measured single
  // page — see the centring note on the track below.
  const [pageCount, setPageCount] = useState(0);

  // A page advances by one viewport *plus one gap*, not by the viewport
  // alone. The visible width holds N cards and the N-1 gaps between them,
  // but moving to the next page also has to clear the gap that follows the
  // last visible card — scrolling by clientWidth leaves that gap's width of
  // the previous card still on screen, and the error compounds page over
  // page (most visibly at one-card-per-page, where it desynced the dots).
  const strideOf = (el: HTMLElement) =>
    el.clientWidth + (parseFloat(getComputedStyle(el).columnGap) || 0);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;

    const stride = strideOf(el);
    // Adding one gap to the content width makes this exactly ceil(cards per
    // track / cards per page); the epsilon stops an exact fit from rounding
    // up to a phantom extra page on a sub-pixel width.
    const gap = stride - el.clientWidth;
    const count = Math.max(1, Math.ceil((el.scrollWidth + gap) / stride - 0.02));
    setPageCount(count);

    // The final page is short whenever the cards don't divide evenly, so the
    // browser clamps its scroll position — rounding alone would then report
    // the second-to-last page as current while the last one is on screen.
    const maxScroll = el.scrollWidth - el.clientWidth;
    const atEnd = maxScroll - el.scrollLeft < 2;
    setPage(atEnd ? count - 1 : Math.min(Math.round(el.scrollLeft / stride), count - 1));
  }, []);

  // Crossing a breakpoint changes how many cards make a page, which can
  // otherwise leave the track parked on a page that no longer exists.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  function goToPage(index: number) {
    const el = trackRef.current;
    if (!el) return;
    const target = Math.min(Math.max(index, 0), pageCount - 1);
    el.scrollTo({ left: target * strideOf(el), behavior: "smooth" });
  }

  const showControls = pageCount > 1;

  return (
    <div className={className}>
      <div
        ref={trackRef}
        onScroll={measure}
        // Focusable because it scrolls: a keyboard user needs to be able to
        // reach the track and pan it with the arrow keys, not just tab past
        // it to the buttons.
        tabIndex={0}
        role="group"
        aria-label={label}
        // py-4 gives card shadows somewhere to fall: overflow-x:auto forces
        // overflow-y to clip too, so without it a drop shadow is sliced off
        // flat at the top and bottom of the track. Vertical padding only —
        // horizontal padding counts toward clientWidth and would throw off
        // the page arithmetic above.
        //
        // Centring is applied only once a measurement has confirmed a single
        // page: justify-center on a track that does overflow pushes the
        // first item off to the left where scrolling can never reach it, so
        // it must never be on while there's more than one page's worth.
        className={`flex snap-x snap-mandatory gap-6 overflow-x-auto py-4 scrollbar-none ${
          pageCount === 1 ? "justify-center" : ""
        }`}
      >
        {children}
      </div>

      {showControls && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <Arrow direction="prev" disabled={page === 0} onClick={() => goToPage(page - 1)} />

          <div className="flex items-center gap-2">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToPage(i)}
                aria-label={`Go to page ${i + 1} of ${pageCount}`}
                aria-current={page === i}
                className={`h-2 rounded-full transition-all ${
                  page === i ? "w-6 bg-amber" : "w-2 bg-navy/20 hover:bg-navy/40"
                }`}
              />
            ))}
          </div>

          <Arrow direction="next" disabled={page >= pageCount - 1} onClick={() => goToPage(page + 1)} />
        </div>
      )}
    </div>
  );
}

function Arrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous page" : "Next page"}
      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-navy/15 text-navy transition-colors hover:border-navy/40 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-navy/15"
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
