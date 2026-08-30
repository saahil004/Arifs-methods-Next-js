import type { Metadata } from "next";
import Image from "next/image";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image src="/login.png" alt="" fill sizes="50vw" className="object-cover" />
      </div>

      <div className="flex flex-col justify-center bg-white px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex items-center gap-2">
            {/* Brand mark only — deliberately not a link. Nothing on this
                page should offer a way back to the public site. */}
            <img src="/logo-icon.svg" alt="" className="h-8 w-auto" />
            <span className="text-lg font-bold tracking-tight text-navy">Arif&apos;s Methods</span>
          </div>

          <h1 className="mt-10 text-2xl font-extrabold text-navy">Welcome Back</h1>
          <p className="mt-2 text-navy/60">Sign in with your admin email and password to continue.</p>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
