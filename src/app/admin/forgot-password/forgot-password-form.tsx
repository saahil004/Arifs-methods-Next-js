"use client";

import { useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";

const inputClasses =
  "w-full rounded-xl border border-navy/15 px-4 py-3 text-navy placeholder:text-navy/40 focus:border-amber focus:outline-none";

type Status = "idle" | "submitting" | "sent" | "error";

export default function ForgotPasswordForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const email = new FormData(e.currentTarget).get("email") as string;

    const { error } = await supabaseBrowser.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });

    // Report success regardless of whether that email has an account —
    // surfacing the real result would let someone probe for which emails
    // are registered as admins.
    if (error) {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="mt-8 space-y-4">
        <p className="text-navy">
          If that email has an admin account, a password reset link is on its way. Check your inbox.
        </p>
        <Link href="/admin/login" className="inline-block text-sm font-bold text-navy hover:text-amber">
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
      <input type="email" name="email" required placeholder="Email" className={inputClasses} />

      {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-xl bg-navy px-8 py-4 font-bold text-white transition-transform duration-200 hover:scale-[1.02] hover:bg-navy/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send Reset Link"}
      </button>

      <Link href="/admin/login" className="block text-center text-sm font-bold text-navy/60 hover:text-navy">
        Back to Sign In
      </Link>
    </form>
  );
}
