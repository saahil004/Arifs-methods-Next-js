export type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
  groups?: { title: string; items: { label: string; href: string }[] }[];
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Courses", href: "/courses" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
