import type { Metadata } from "next";
import { Geist, Geist_Mono, Anton, Bodoni_Moda } from "next/font/google";
import "@/app/globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ScrollToTop from "@/components/layout/scroll-to-top";
import RouteTransition from "@/components/layout/route-transition";
import Analytics from "@/components/analytics";
import { HeaderThemeProvider } from "@/components/layout/header-theme";
import { siteConfig } from "@/lib/site-config";

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

// Both styles are loaded because the hero headline sets its second line in
// true italic — Bodoni's italic is a separate drawing, not a slant, and
// faux-italicising it would lose exactly the detail that makes it work.
const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const title = "Arif's Methods | O & A Level Tuition Academy in Karachi";
const description =
  "Arif's Methods is a Karachi-based coaching institute offering expert O & A Level tuition across a range of subjects, with Mathematics (4024) and Additional Mathematics (4037) as our flagship specialty led by Sir Arif.";

export const metadata: Metadata = {
  // TODO: replace with the real production domain once one is chosen
  metadataBase: new URL("https://example.com"),
  title: {
    default: title,
    template: `%s | ${siteConfig.name}`,
  },
  description,
  openGraph: {
    title,
    description,
    siteName: siteConfig.name,
    images: ["/hero.jpg"],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/hero.jpg"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: siteConfig.name,
  description: siteConfig.description,
  telephone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.contact.address.line1,
    addressLocality: "Karachi",
    addressRegion: "Sindh",
    addressCountry: "PK",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} ${bodoni.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <HeaderThemeProvider>
          <Header />
          {children}
        </HeaderThemeProvider>
        <Footer />
        <ScrollToTop />
        <RouteTransition />
        <div className="splash-overlay" aria-hidden="true">
          <img src="/logo-icon.svg" alt="" className="h-36 w-36" />
          <p className="font-display mt-4 text-2xl uppercase tracking-wide text-navy">{siteConfig.name}</p>
        </div>
      </body>
    </html>
  );
}
