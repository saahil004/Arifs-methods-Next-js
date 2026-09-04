import type { Metadata } from "next";
import ContactBanner from "@/components/sections/contact/contact-banner";
import ContactCard from "@/components/sections/contact/contact-card";
import ContactForm from "@/components/sections/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Arif's Methods — we'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactBanner title="Get in Touch" breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <ContactCard />

      <section className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="mb-3 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest text-amber">
          <span className="h-px w-6 bg-amber" />
          Get In Touch
          <span className="h-px w-6 bg-amber" />
        </p>
        <h2 className="text-3xl font-extrabold text-navy sm:text-4xl">Send Us a Message</h2>
        <p className="mt-3 text-navy/60">
          Have a question about our courses or admissions? Fill out the form below and we&apos;ll get back to you
          shortly.
        </p>

        <ContactForm />
      </section>
    </main>
  );
}
