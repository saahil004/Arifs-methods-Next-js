export const siteConfig = {
  name: "Arif's Methods",
  tagline: "The Education You Need",
  description:
    "Arif's Methods is a coaching institute in Karachi offering expert O & A Level tuition across a range of subjects, taught with the same rigor and dedication as our flagship specialty — Mathematics (4024) and Additional Mathematics (4037) — led by Sir Arif, an experienced mathematics educator known for his step-by-step teaching approach.",
  contact: {
    email: "info@academy.com",
    phone: "+92 300 9245315",
    phoneHref: "tel:+923009245315",
    address: {
      line1: "Jason Luxury Condominium",
      line2: "Block 7, Zone C, Block 7 Clifton, Karachi 75600",
    },
    hours: "Mon–Sat: 3:00 PM – 7:00 PM (Sunday Closed)",
  },
  social: {
    twitter: "#",
    facebook: "#",
    dribbble: "#",
    instagram: "#",
    youtube: "#",
  },
  learnMoreLinks: [
    { label: "About Us", href: "/about" },
    { label: "Courses", href: "/courses" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Terms of Use", href: "/terms" },
    // Privacy Policy is a section on the Terms page, not its own route —
    // the hash takes the reader straight to it via terms-content.tsx's
    // scroll-mt-28 + id="privacy".
    { label: "Privacy Policy", href: "/terms#privacy" },
  ],
} as const;
