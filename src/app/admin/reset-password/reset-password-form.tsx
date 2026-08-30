"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";

const inputClasses =
  "w-full rounded-xl border border-navy/15 px-4 py-3 text-navy placeholder:text-navy/40 focus:border-amber focus:outline-none";

type Status = "verifying" | "ready" | "invalid" | "submitting" | "success";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Supabase's client detects the recovery tokens in the URL (hash or
    // PKCE `code`, whichever format this project uses) on its own and fires
    // this event once a recovery session is established — no manual URL
    // parsing needed here.
    const { data: listener } = supabaseBrowser.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setStatus("ready");
      }
    });

    // If the link was already used or has expired, that event never fires —
    // fall back to "invalid" rather than leaving the page stuck verifying.
    const timeout = setTimeout(() => {
      setStatus((current) => (current === "verifying" ? "invalid" : current));
    }, 3000);

    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords don't match.");
      return;
    }

    setStatus("submitting");
    const { error } = await supabaseBrowser.auth.updateUser({ password: newPassword });
    if (error) {
      setErrorMessage(error.message || "Failed to reset password.");
      setStatus("ready");
      return;
    }

    // Don't leave a lingering recovery session behind — the admin should
    // sign in fresh with the new password.
    await supabaseBrowser.auth.signOut();
    setStatus("success");
    setTimeout(() => router.push("/admin/login"), 2000);
  }

  if (status === "verifying") {
    return <p className="mt-8 text-navy/60">Verifying your reset link...</p>;
  }

  if (status === "invalid") {
    return (
      <div className="mt-8 space-y-4">
        <p className="text-navy">This reset link is invalid or has expired.</p>
        <Link href="/admin/forgot-password" className="inline-block text-sm font-bold text-navy hover:text-amber">
          Request a new link
        </Link>
      </div>
    );
  }

  if (status === "success") {
    return <p className="mt-8 text-navy">Password updated. Redirecting you to sign in...</p>;
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
      <input
        type="password"
        name="password"
        required
        minLength={8}
        placeholder="New password"
        className={inputClasses}
      />
      <input
        type="password"
        name="confirmPassword"
        required
        minLength={8}
        placeholder="Confirm new password"
        className={inputClasses}
      />

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-xl bg-navy px-8 py-4 font-bold text-white transition-transform duration-200 hover:scale-[1.02] hover:bg-navy/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
