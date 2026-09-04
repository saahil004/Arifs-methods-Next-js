import type { Metadata } from "next";
import PortfolioBanner from "./portfolio-banner";
import AboutArif from "./about-arif";
import Testimonials from "./testimonials";
import ScrollReveal from "./scroll-reveal";

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
