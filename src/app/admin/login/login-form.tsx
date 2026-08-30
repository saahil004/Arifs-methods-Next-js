"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";

const inputClasses =
  "w-full rounded-xl border border-navy/15 px-4 py-3 text-navy placeholder:text-navy/40 focus:border-amber focus:outline-none";

type Status = "idle" | "submitting" | "error";

export default function LoginForm() {
  const router = useRouter();
  const { token, isLoading, login } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isLoading && token) {
      router.replace("/admin");
    }
  }, [isLoading, token, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
      router.push("/admin");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  // Avoid flashing the login form for an admin who's already signed in —
  // isLoading is only true for the instant it takes to check localStorage.
  if (isLoading || token) return null;

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
      <input type="email" name="email" required placeholder="Email" className={inputClasses} />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          required
          placeholder="Password"
          className={`${inputClasses} pr-12`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      <div className="text-right">
        <Link href="/admin/forgot-password" className="text-sm font-bold text-navy/60 hover:text-navy">
          Forgot password?
        </Link>
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-xl bg-navy px-8 py-4 font-bold text-white transition-transform duration-200 hover:scale-[1.02] hover:bg-navy/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
