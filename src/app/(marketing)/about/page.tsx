import type { Metadata } from "next";
import AboutHero from "@/components/sections/about/about-hero";
import WhoWeAre from "@/components/sections/about/who-we-are";
import OurMethod from "@/components/sections/about/our-method";
import FounderQuote from "@/components/sections/about/founder-quote";
import Faculty from "@/components/sections/about/faculty";
import AtAGlance from "@/components/sections/about/at-a-glance";
import ContactCta from "@/components/sections/home/contact-cta";
import { fetchCourses, fetchTeachers } from "@/lib/admin-api";

export const metadata: Metadata = {
  title: "About",
  description: "Meet Arif's Methods — the O & A Level academy and the teachers behind it.",
};

// Without this, Next prerenders the page once at build time and the fetches
// below get frozen into that static HTML — a teacher added or removed in the
// admin panel wouldn't show up here until the next deploy. This revalidates
// the static page in the background at most once an hour, which is fast
// enough for how often the roster actually changes without hitting the API
// on every request.
export const revalidate = 3600;

// Fetched here, server-side, rather than in the section components — both
// endpoints are public and already used unauthenticated elsewhere (the
// register form, the home Courses section), so there's no reason to ship a
// client-side loading state for content that can just be in the initial HTML.
export default async function AboutPage() {
  const [courses, teachers] = await Promise.all([
    fetchCourses().catch(() => []),
    fetchTeachers().catch(() => []),
  ]);

  return (
    <main>
      <AboutHero />
      <WhoWeAre />
      <OurMethod />
      <FounderQuote />
      <Faculty teachers={teachers} />
      <AtAGlance subjectCount={courses.length} />
      <ContactCta />
    </main>
  );
}
