import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center px-6 pt-40 pb-24 text-center">
      <img src="/logo-icon.svg" alt="" className="h-16 w-16" />
      <p className="font-display mt-6 text-7xl text-amber sm:text-8xl">404</p>
      <h1 className="mt-4 text-2xl font-extrabold text-navy sm:text-3xl">Page Not Found</h1>
      <p className="mt-3 max-w-md text-navy/60">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-amber px-8 py-4 font-bold text-navy transition-transform duration-200 hover:scale-105 hover:bg-amber/90 active:scale-95"
      >
        Back to Home
      </Link>
    </main>
  );
}
