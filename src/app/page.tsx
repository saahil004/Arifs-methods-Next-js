import Hero from "@/components/sections/hero";
import Features from "@/components/sections/features";
import HowItWorks from "@/components/sections/how-it-works";

export default function Home() {
  return (
    <main>
      <Hero
        eyebrow="O & A Level Academy"
        title="Excel in O & A Levels with Arif's Methods"
        subtitle="Expert tutors and structured lessons in Mathematics, Physics, Chemistry, Biology and Computer Science — built to help you achieve top grades."
        image="/hero.jpg"
      />
      <Features />
      <HowItWorks />
    </main>
  );
}
