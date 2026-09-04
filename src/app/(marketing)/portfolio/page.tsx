import type { Metadata } from "next";
import PortfolioBanner from "@/components/sections/portfolio/portfolio-banner";
import AboutArif from "@/components/sections/portfolio/about-arif";
import Testimonials from "@/components/sections/portfolio/testimonials";
import ScrollReveal from "@/components/sections/portfolio/scroll-reveal";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Results, achievements and student work from Arif's Methods.",
};

export default function PortfolioPage() {
  return (
    <main>
      <PortfolioBanner />
      <AboutArif />
      <Testimonials />
      <ScrollReveal />
    </main>
  );
}
