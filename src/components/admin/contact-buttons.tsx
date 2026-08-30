import { Phone, Mail } from "lucide-react";
import { formatPhoneForTel, isValidEmail } from "@/lib/contact-utils";

export default function ContactButtons({
  name,
  phone,
  email,
}: {
  name: string;
  phone: string | null | undefined;
  email: string | null | undefined;
}) {
  const tel = formatPhoneForTel(phone);
  const validEmail = isValidEmail(email) ? email : null;

  if (!tel && !validEmail) return null;

  return (
    <div className="flex items-center gap-2">
      {tel && (
        <a
          href={`tel:${tel}`}
          aria-label={`Call ${name}`}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/10 text-navy transition-colors hover:bg-navy hover:text-white"
        >
          <Phone className="h-4 w-4" />
        </a>
      )}
      {validEmail && (
        <a
          href={`mailto:${validEmail}`}
          aria-label={`Email ${name}`}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/10 text-navy transition-colors hover:bg-navy hover:text-white"
        >
          <Mail className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
