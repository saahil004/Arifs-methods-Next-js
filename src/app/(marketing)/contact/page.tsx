import type { Metadata } from "next";
import ContactBanner from "./contact-banner";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Arif's Methods — we'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactBanner title="Get in Touch" breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      {/* Contact card (map + address/phone/email, matching the reference
          design) comes next. */}
    </main>
  );
}
