"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { loginAdmin, refreshAdminSession, logoutAdmin, type AdminSession } from "@/lib/admin-api";

const STORAGE_KEY = "arifs-methods-admin-session";

// Refresh this long before the token actually expires, so a slow request or
// a bit of clock drift never lets it lapse mid-call. Supabase's default
// access-token lifetime is 3600s, so this leaves a wide margin.
const REFRESH_BUFFER_SECONDS = 120;

type AdminAuthContextValue = {
  token: string | null;
  // True until the initial localStorage read finishes — pages should not
  // decide "logged out, redirect to /admin/login" until this is false, or
  // every hard refresh would briefly bounce a logged-in admin to the login
  // screen before the token is read.
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function readSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Partial<AdminSession>;
    if (!session.token || !session.expiresAt) return null;
    // expiresAt is a Supabase session expiry: Unix seconds, not milliseconds.
    if (session.expiresAt * 1000 <= Date.now()) return null;
    return session as AdminSession;
  } catch {
    return null;
  }
}

function saveSession(session: AdminSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logout = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    // Fire-and-forget: the frontend can't clear the httpOnly refresh-token
    // cookie itself, so this just asks the backend to. Nothing here depends
    // on it finishing before logout() returns.
    logoutAdmin();
  }, []);

  // scheduleRefresh and doRefresh are mutually recursive (schedule fires
  // doRefresh later; a successful doRefresh calls scheduleRefresh again for
  // next time), which useCallback can't express as a dependency of itself.
  // Routing the call through a ref — reassigned fresh on every render, so it
  // always sees the current logout/scheduleRefresh — breaks that cycle
  // without needing either function to depend on the other.
  const doRefreshRef = useRef<() => void>(() => {});

  const scheduleRefresh = useCallback((session: AdminSession) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    const delayMs = Math.max((session.expiresAt - REFRESH_BUFFER_SECONDS) * 1000 - Date.now(), 0);
    refreshTimerRef.current = setTimeout(() => doRefreshRef.current(), delayMs);
  }, []);

  // Keeps the ref pointed at a closure over the latest logout/scheduleRefresh
  // after every render — a ref write belongs in an effect, not render itself.
  useEffect(() => {
    doRefreshRef.current = () => {
      // No token passed — the browser attaches the httpOnly refresh-token
      // cookie to this request on its own.
      refreshAdminSession().then((refreshed) => {
        if (!refreshed) {
          logout();
          return;
        }
        saveSession(refreshed);
        setToken(refreshed.token);
        scheduleRefresh(refreshed);
      });
    };
  });

  useEffect(() => {
    const session = readSession();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(session?.token ?? null);
    setIsLoading(false);
    if (session) scheduleRefresh(session);

    // A backgrounded tab can have its timers throttled well past the delay
    // above — if that happened, catch up the moment the tab is looked at
    // again instead of leaving a stale, about-to-expire token in place.
    function handleVisibilityChange() {
      if (document.visibilityState !== "visible") return;
      const current = readSession();
      if (!current) return;
      if (current.expiresAt * 1000 - Date.now() < REFRESH_BUFFER_SECONDS * 1000) {
        doRefreshRef.current();
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const session = await loginAdmin(email, password);
      saveSession(session);
      setToken(session.token);
      scheduleRefresh(session);
    },
    [scheduleRefresh]
  );

  return (
    <AdminAuthContext.Provider value={{ token, isLoading, login, logout }}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return ctx;
}
