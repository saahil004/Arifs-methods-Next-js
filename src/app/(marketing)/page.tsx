import Hero from "@/components/sections/home/hero";
import SmoothScroll from "@/components/sections/home/smooth-scroll";
import Features from "@/components/sections/home/features";
import HowItWorks from "@/components/sections/home/how-it-works";
import WhyChooseUs from "@/components/sections/home/why-choose-us";
import QuoteBanner from "@/components/sections/home/quote-banner";
import Courses from "@/components/sections/home/courses";
import ContactCta from "@/components/sections/home/contact-cta";

export default function Home() {
  return (
    <main>
      <SmoothScroll />
      <Hero
        eyebrow="O & A Level Academy"
        title="Excel in O & A Levels"
        titleItalic="with Arif's Methods"
        subtitle="Expert tutors and structured lessons across O & A Level subjects — with Mathematics and Additional Mathematics as our flagship specialty — built to help you achieve top grades."
        image="/hero.jpg"
      />
      <Features />
      <HowItWorks />
      <WhyChooseUs />
      <QuoteBanner />
      <Courses />
      <ContactCta />
    </main>
  );
}
