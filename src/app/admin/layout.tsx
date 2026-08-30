import type { Metadata } from "next";
import { Geist, Geist_Mono, Anton } from "next/font/google";
import "@/app/globals.css";
import { AdminAuthProvider } from "@/lib/admin-auth";
import AdminRouteTransition from "@/components/admin/admin-route-transition";

// This is its own root layout — deliberately independent from the public
// site's app/(marketing)/layout.tsx (no shared Header/Footer/nav). The admin
// panel is meant to be reachable only by a direct URL, with no link to it
// from the public site and no link back from here to the public site either.
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
  title: {
    default: "Admin",
    template: "%s | Arif's Methods Admin",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AdminAuthProvider>{children}</AdminAuthProvider>
        <AdminRouteTransition />
        <div className="admin-splash-overlay" aria-hidden="true">
          <img src="/logo-icon.svg" alt="" className="h-48 w-48" />
          <div className="admin-splash-text font-display mt-4 flex text-5xl uppercase tracking-wide text-navy">
            <span style={{ animationDelay: "300ms" }}>A</span>
            <span style={{ animationDelay: "370ms" }}>D</span>
            <span style={{ animationDelay: "440ms" }}>M</span>
            <span style={{ animationDelay: "510ms" }}>I</span>
            <span style={{ animationDelay: "580ms" }}>N</span>
            <span style={{ animationDelay: "650ms" }}>S</span>
          </div>
        </div>
      </body>
    </html>
  );
}
