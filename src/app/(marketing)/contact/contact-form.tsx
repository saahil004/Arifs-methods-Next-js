"use client";

import { useState } from "react";
import { trackEvent, trackMetaEvent } from "@/lib/analytics";

const inputClasses =
  "w-full rounded-xl border border-navy/15 px-4 py-3 text-navy placeholder:text-navy/40 focus:border-amber focus:outline-none";

const SUBJECTS = ["Admissions", "Course Information", "Fees & Payments", "General Inquiry", "Other"];

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(form);
    const payload = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      website: formData.get("website"),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/queries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      trackEvent("generate_lead", { method: "contact_form" });
      trackMetaEvent("Lead");
      form.reset();
    } catch {
      setErrorMessage("Couldn't reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-10 rounded-xl bg-amber/10 p-6 text-center">
        <p className="font-bold text-navy">Message sent!</p>
        <p className="mt-2 text-navy/60">Thanks for reaching out — we&apos;ll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form className="mt-10 space-y-4 text-left" onSubmit={handleSubmit}>
      {/* Honeypot — real visitors never see or fill this in. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          name="firstName"
          required
          placeholder="First Name"
          className={inputClasses}
          data-clarity-mask="true"
        />
        <input
          type="text"
          name="lastName"
          required
          placeholder="Last Name"
          className={inputClasses}
          data-clarity-mask="true"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          className={inputClasses}
          data-clarity-mask="true"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number (optional)"
          pattern="\+?[0-9\s-]{7,20}"
          title="Please enter a valid phone number"
          className={inputClasses}
          data-clarity-mask="true"
        />
      </div>

      <select name="subject" required defaultValue="" className={inputClasses}>
        <option value="" disabled>
          Subject
        </option>
        {SUBJECTS.map((subject) => (
          <option key={subject} value={subject}>
            {subject}
          </option>
        ))}
      </select>

      <textarea
        name="message"
        required
        rows={6}
        placeholder="Message"
        className={inputClasses}
        data-clarity-mask="true"
      />

      {status === "error" && <p className="text-center text-sm text-red-600">{errorMessage}</p>}

      <div className="pt-2 text-center">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-full bg-amber px-10 py-4 font-bold text-navy transition-transform duration-200 hover:scale-[1.02] hover:bg-amber/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
}
