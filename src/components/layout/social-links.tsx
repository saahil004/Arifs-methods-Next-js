import { FaTwitter, FaFacebookF, FaDribbble, FaInstagram, FaYoutube } from "react-icons/fa";
import { siteConfig } from "@/lib/site-config";

const socials = [
  { icon: FaTwitter, label: "Twitter", href: siteConfig.social.twitter },
  { icon: FaFacebookF, label: "Facebook", href: siteConfig.social.facebook },
  { icon: FaDribbble, label: "Dribbble", href: siteConfig.social.dribbble },
  { icon: FaInstagram, label: "Instagram", href: siteConfig.social.instagram },
  { icon: FaYoutube, label: "Youtube", href: siteConfig.social.youtube },
];

export default function SocialLinks({ className = "", onLinkClick }: { className?: string; onLinkClick?: () => void }) {
  return (
    <div className={className}>
      <h3 className="mb-4 text-xl font-bold text-white">Follow Us</h3>
      <div className="flex gap-3">
        {socials.map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            onClick={onLinkClick}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1b1e27] transition hover:bg-amber"
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>
    </div>
  );
}
