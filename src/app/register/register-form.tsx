"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { courses } from "@/lib/courses";

const inputClasses =
  "w-full rounded-xl border border-navy/15 px-4 py-3 text-navy placeholder:text-navy/40 focus:border-amber focus:outline-none";

type Status = "idle" | "submitting" | "success" | "error";

export default function RegisterForm() {
  const [level, setLevel] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const levelLabel = level === "o-level" ? "O Level" : level === "a-level" ? "A Level" : null;
  const visibleCourses = courses.filter((c) => c.level === levelLabel);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      level: levelLabel,
      subjects: formData.getAll("subjects"),
      message: formData.get("message"),
      website: formData.get("website"),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/registrations`, {
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
      form.reset();
      setLevel("");
    } catch {
      setErrorMessage("Couldn't reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-8 rounded-xl bg-amber/10 p-6 text-center">
        <p className="font-bold text-navy">Thanks for registering!</p>
        <p className="mt-2 text-navy/60">We&apos;ve received your details and will get in touch soon.</p>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
      />
      <input type="text" name="name" required placeholder="Full Name" className={inputClasses} />
      <input
        type="tel"
        name="phone"
        required
        placeholder="Phone Number"
        pattern="\+?[0-9\s-]{7,20}"
        title="Please enter a valid phone number"
        className={inputClasses}
      />
      <input type="email" name="email" placeholder="Email (optional)" className={inputClasses} />
      <select
        name="level"
        required
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        className={inputClasses}
      >
        <option value="" disabled>
          Select Level
        </option>
        <option value="o-level">O Level</option>
        <option value="a-level">A Level</option>
      </select>

      <AnimatePresence initial={false}>
        {levelLabel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="mb-2 text-sm font-bold text-navy">Subjects of Interest</p>
            <div className="rounded-xl border border-navy/15 p-4">
              {visibleCourses.map((course) => (
                <label key={course.code} className="flex items-center gap-2 py-1 text-sm text-navy/70">
                  <input
                    type="checkbox"
                    name="subjects"
                    value={`${course.name} (${course.code})`}
                    className="h-4 w-4 rounded border-navy/30 text-amber focus:ring-amber"
                  />
                  {course.name}
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <textarea
        name="message"
        rows={4}
        placeholder="Anything else we should know? (optional)"
        className={inputClasses}
      />

      {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-amber px-8 py-4 font-bold text-navy transition-transform duration-200 hover:scale-[1.02] hover:bg-amber/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting..." : "Register Now"}
      </button>
    </form>
  );
}
