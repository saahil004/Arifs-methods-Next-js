import type { Metadata } from "next";
import { Geist, Geist_Mono, Anton } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import { HeaderThemeProvider } from "@/components/layout/header-theme";

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
  title: "Arif's Methods | O & A Level Tuition Academy",
  description:
    "Arif's Methods offers expert O & A Level tuition in Mathematics, Physics, Chemistry, Biology and Computer Science, with structured lessons and a proven track record. Register today.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <HeaderThemeProvider>
          <Header />
          {children}
        </HeaderThemeProvider>
      </body>
    </html>
  );
}
