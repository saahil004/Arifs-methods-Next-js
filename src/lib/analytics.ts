declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

// No-ops until NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_META_PIXEL_ID are set and the
// scripts in <Analytics /> have actually loaded — safe to call unconditionally
// from anywhere without checking whether tracking is configured.
export function trackEvent(name: string, params?: Record<string, unknown>) {
  window.gtag?.("event", name, params);
}

export function trackMetaEvent(name: string, params?: Record<string, unknown>) {
  window.fbq?.("track", name, params);
}
