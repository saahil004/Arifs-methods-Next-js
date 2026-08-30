const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string | null | undefined): email is string {
  return !!email && EMAIL_REGEX.test(email);
}

// Submitted phone numbers are validated on the way in (the backend rejects
// anything that doesn't match its own phone regex), but that just confirms
// the raw text is plausible — it doesn't produce a dialable format. This
// normalizes for the tel: link specifically and returns null if the result
// still doesn't look like a real number, so a malformed or legacy record
// doesn't render a broken Call button.
//
// Known, accepted limitation: a number given in another country's LOCAL
// format (a bare leading 0, no country code — e.g. a UK number written as
// "07911123456") is indistinguishable from a Pakistani local number and
// gets assumed to be Pakistani, since that's this business's near-exclusive
// market. A number that already includes a country code (via "+" or "00")
// is always handled correctly regardless of country.
export function formatPhoneForTel(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digitsAndPlus = phone.replace(/[^\d+]/g, "");

  let normalized: string;
  if (digitsAndPlus.startsWith("+")) {
    normalized = digitsAndPlus;
  } else if (digitsAndPlus.startsWith("00")) {
    // "00" is the common alternative to "+" for dialing internationally.
    normalized = `+${digitsAndPlus.slice(2)}`;
  } else if (digitsAndPlus.startsWith("0")) {
    normalized = `+92${digitsAndPlus.slice(1)}`;
  } else {
    normalized = `+${digitsAndPlus}`;
  }

  const digitCount = normalized.replace(/\D/g, "").length;
  if (digitCount < 8 || digitCount > 15) return null;
  return normalized;
}
