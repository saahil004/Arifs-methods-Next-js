import type { Metadata } from "next";
import Image from "next/image";
import PageBanner from "@/components/ui/page-banner";
import RegisterForm from "@/components/sections/register/register-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Register your interest in Arif's Methods and we'll get in touch with you.",
};

export default function RegisterPage() {
  return (
    <main>
      <PageBanner title="Register" breadcrumb={[{ label: "Home", href: "/" }, { label: "Register" }]} />

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="-mt-20 grid overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
          <div className="relative hidden min-h-[420px] lg:block">
            <Image
              src="/register.jpg"
              alt="Two students studying together with O & A Level books"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 0px"
              className="object-cover"
            />
          </div>

          <div className="bg-white p-8 sm:p-12">
            <h2 className="text-2xl font-extrabold text-navy">Register Your Interest</h2>
            <p className="mt-2 text-navy/60">
              Tell us a bit about you and we&apos;ll get in touch to help you get started.
            </p>

            <RegisterForm />
          </div>
        </div>
      </section>
    </main>
  );
}
