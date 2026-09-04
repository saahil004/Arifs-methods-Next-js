import { MapPin, Phone, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

// The classic no-API-key Google Maps embed pattern (?q=...&output=embed) —
// no billing/API key setup needed, unlike the newer Maps Embed API.
const MAP_QUERY = encodeURIComponent(`${siteConfig.contact.address.line1}, ${siteConfig.contact.address.line2}`);

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-bold text-navy">{label}</h3>
        <div className="mt-1 text-navy/60">{children}</div>
      </div>
    </div>
  );
}

export default function ContactCard() {
  return (
    // relative (not static, the default) is required here — the banner
    // above is position: relative, and CSS paints positioned elements above
    // non-positioned siblings regardless of DOM order, even at the same
    // (auto) z-index. Without this, the banner painted on top of this card
    // in the overlapping region, despite coming first in the markup.
    <section className="relative z-10 mx-auto max-w-5xl px-6 pb-20">
      {/* The "Find Us" nav anchor sits on the card, not the <section>: the
          section's flow position is 160px below where the card actually
          starts (-mt-40 pulls it up over the banner), so anchoring the
          section would leave the card off the top of the screen. */}
      <div
        id="find-us"
        className="-mt-40 grid scroll-mt-24 overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2"
      >
        <div className="relative min-h-80 lg:min-h-full">
          <iframe
            src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Arif's Methods location"
          />
        </div>

        <div className="space-y-8 p-8 sm:p-12">
          <InfoRow icon={MapPin} label="Address">
            <p>{siteConfig.contact.address.line1}</p>
            <p>{siteConfig.contact.address.line2}</p>
          </InfoRow>

          <InfoRow icon={Phone} label="Phone">
            <a href={siteConfig.contact.phoneHref} className="block hover:text-amber">
              {siteConfig.contact.phone}
            </a>
          </InfoRow>

          <InfoRow icon={Mail} label="E-mail">
            <a href={`mailto:${siteConfig.contact.email}`} className="block hover:text-amber">
              {siteConfig.contact.email}
            </a>
          </InfoRow>
        </div>
      </div>
    </section>
  );
}
