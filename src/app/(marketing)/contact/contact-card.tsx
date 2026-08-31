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
    <section className="mx-auto max-w-5xl px-6 pb-20">
      <div className="-mt-20 grid overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
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
