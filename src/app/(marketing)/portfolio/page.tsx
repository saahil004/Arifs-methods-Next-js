import type { Metadata } from "next";
import PortfolioBanner from "./portfolio-banner";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Results, achievements and student work from Arif's Methods.",
};

export default function PortfolioPage() {
  return (
    <main>
      <PortfolioBanner />
    </main>
  );
}
