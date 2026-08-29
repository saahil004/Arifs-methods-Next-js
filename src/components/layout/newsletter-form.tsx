"use client";

import { useState } from "react";
import { trackEvent, trackMetaEvent } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

export default function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("submitting");
    setMessage("");

    const formData = new FormData(form);
    const payload = {
      email: formData.get("email"),
      website: formData.get("website"),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setMessage(data.alreadySubscribed ? "You're already subscribed!" : "Thanks for subscribing!");
      if (!data.alreadySubscribed) {
        trackEvent("newsletter_signup");
        trackMetaEvent("Subscribe");
      }
      form.reset();
    } catch {
      setMessage("Couldn't reach the server. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="mt-4">
      <form className="flex" onSubmit={handleSubmit}>
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Email Address"
          className="w-full min-w-0 rounded-l-full bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="shrink-0 rounded-r-full bg-amber px-6 py-3 text-sm font-bold text-navy transition-colors hover:bg-amber/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "..." : "Join"}
        </button>
      </form>
      {message && (
        <p className={`mt-2 text-sm ${status === "error" ? "text-red-400" : "text-amber"}`}>{message}</p>
      )}
    </div>
  );
}
