import type { Metadata } from "next";
import PageBanner from "@/components/ui/page-banner";
import TermsContent from "@/components/sections/terms/terms-content";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "The terms and conditions for enrolling in and attending classes at Arif's Methods.",
};

export default function TermsPage() {
  return (
    <main>
      <PageBanner
        title="Terms and Conditions"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Terms and Conditions" }]}
      />
      <TermsContent />
    </main>
  );
}
