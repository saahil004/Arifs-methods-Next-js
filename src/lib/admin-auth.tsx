"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { loginAdmin } from "@/lib/admin-api";

const STORAGE_KEY = "arifs-methods-admin-session";

type Session = { token: string; expiresAt: number };

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

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Partial<Session>;
    if (!session.token || !session.expiresAt) return null;
    // expiresAt is a Supabase session expiry: Unix seconds, not milliseconds.
    if (session.expiresAt * 1000 <= Date.now()) return null;
    return session as Session;
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // localStorage doesn't exist during server rendering, so the session can
    // only be read once mounted on the client — an effect is unavoidable here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(readSession()?.token ?? null);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, expiresAt } = await loginAdmin(email, password);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, expiresAt } satisfies Session));
    setToken(token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ token, isLoading, login, logout }}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return ctx;
}
