"use client";

const inputClasses =
  "w-full rounded-xl border border-navy/15 px-4 py-3 text-navy placeholder:text-navy/40 focus:border-amber focus:outline-none";

export default function RegisterForm() {
  return (
    <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
      <input type="text" name="name" required placeholder="Full Name" className={inputClasses} />
      <input type="tel" name="phone" required placeholder="Phone Number" className={inputClasses} />
      <input type="email" name="email" placeholder="Email (optional)" className={inputClasses} />
      <select name="level" required defaultValue="" className={inputClasses}>
        <option value="" disabled>
          Select Level
        </option>
        <option value="o-level">O Level</option>
        <option value="a-level">A Level</option>
      </select>
      <textarea
        name="message"
        rows={4}
        placeholder="Anything else we should know? (optional)"
        className={inputClasses}
      />

      <button
        type="submit"
        className="w-full rounded-full bg-amber px-8 py-4 font-bold text-navy transition-transform duration-200 hover:scale-[1.02] hover:bg-amber/90 active:scale-95"
      >
        Register Now
      </button>
    </form>
  );
}
