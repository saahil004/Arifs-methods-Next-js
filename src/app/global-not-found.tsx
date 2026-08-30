import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Anton } from "next/font/google";
import "@/app/globals.css";

// Handles genuinely unmatched URLs across the whole app (e.g. a mistyped
// path). Required once there are multiple root layouts — Next.js can't tell
// which one (marketing vs admin) should render a fallback for a path that
// belongs to neither, so this bypasses both and provides its own complete
// document instead. See next.config.ts's `experimental.globalNotFound`.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
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
      </body>
    </html>
  );
}
