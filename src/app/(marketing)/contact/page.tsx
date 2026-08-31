import type { Metadata } from "next";
import ContactBanner from "./contact-banner";
import ContactCard from "./contact-card";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Arif's Methods — we'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactBanner title="Get in Touch" breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <ContactCard />
    </main>
  );
}
