import type { Metadata } from "next";
import { Geist, Geist_Mono, Anton } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ScrollToTop from "@/components/layout/scroll-to-top";
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
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
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
      </body>
    </html>
  );
}
