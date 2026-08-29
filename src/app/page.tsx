import Hero from "@/components/sections/hero";
import Features from "@/components/sections/features";
import HowItWorks from "@/components/sections/how-it-works";
import WhyChooseUs from "@/components/sections/why-choose-us";
import QuoteBanner from "@/components/sections/quote-banner";
import ContactCta from "@/components/sections/contact-cta";

export default function Home() {
  return (
    <main>
      <Hero
        eyebrow="O & A Level Academy"
        title="Excel in O & A Levels with Arif's Methods"
        subtitle="Expert tutors and structured lessons across O & A Level subjects — with Mathematics and Additional Mathematics as our flagship specialty — built to help you achieve top grades."
        image="/hero.jpg"
      />
      <Features />
      <HowItWorks />
      <WhyChooseUs />
      <QuoteBanner />
      <ContactCta />
    </main>
  );
}
