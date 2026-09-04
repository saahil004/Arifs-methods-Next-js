export type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
  groups?: { title: string; items: { label: string; href: string }[] }[];
};

// Children pointing at "#section" hashes are in-page jumps: each href's
// fragment must match an id rendered on that page, and those sections carry
// a scroll-mt so the fixed header doesn't sit over the heading on arrival.
export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Portfolio",
    href: "/portfolio",
    children: [
      { label: "About Sir Arif", href: "/portfolio#about-arif" },
      { label: "What We Do", href: "/portfolio#what-we-do" },
      { label: "Our Approach", href: "/portfolio#our-approach" },
      { label: "By the Numbers", href: "/portfolio#by-the-numbers" },
      { label: "Testimonials", href: "/portfolio#testimonials" },
    ],
  },
  { label: "Courses", href: "/courses" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Who We Are", href: "/about#who-we-are" },
      { label: "Our Method", href: "/about#our-method" },
      { label: "Our Teachers", href: "/about#faculty" },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
    children: [
      { label: "Find Us", href: "/contact#find-us" },
      { label: "Send a Message", href: "/contact#send-a-message" },
    ],
  },
];
