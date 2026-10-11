/**
 * Companies Center's contact email, phone and postal address. Staff edit them
 * in Admin > Settings > Contact details; the API sends them with the public
 * app config (`contact`), and the footer, /contact and the app's Customer
 * Support screen show them. The rules match cpcllc-backend
 * src/modules/app-config/contact.ts.
 *
 * CONTACT is what shows before the config loads (and the API's own default
 * until staff first save): Adam, 2026-10-11, the gmail inbox until the
 * company-domain mailbox exists, and the Tampa address. The Privacy Policy
 * (section 35) lists the same; lib/legalDoc.test.ts checks it.
 */
export interface ContactDetails {
  email: string;
  /** Empty hides the phone. */
  phone: string;
  /** One line per entry. */
  address: string[];
}

export const CONTACT: ContactDetails = {
  email: "companiescenterserv@gmail.com",
  phone: "+1 (813) 897-1727",
  address: ["400 N Ashley Dr, Suite 1900", "Tampa, FL 33602", "United States"],
};

/** What staff saved, today's details for anything never saved. */
export function shownContact(saved: Partial<ContactDetails> | null | undefined): ContactDetails {
  return {
    email: saved?.email || CONTACT.email,
    phone: saved?.phone ?? CONTACT.phone,
    address: saved?.address?.length ? saved.address : CONTACT.address,
  };
}

/** A tel: link for a phone number as written. */
export const phoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** The address on Google Maps. */
export const mapsUrl = (address: string[]) =>
  `https://maps.google.com/?q=${encodeURIComponent(address.join(", "))}`;

export const MAX_ADDRESS_LINES = 4;
export const MAX_ADDRESS_LINE = 120;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9 ().-]{7,25}$/;

/** Why each field can't be saved (the API's words), empty when all are fine. */
export function contactProblems(c: ContactDetails): Partial<Record<keyof ContactDetails, string>> {
  const out: Partial<Record<keyof ContactDetails, string>> = {};
  const email = c.email.trim();
  if (!EMAIL.test(email) || email.length > 254) {
    out.email = "Contact email must be a full address, like name@example.com";
  }
  const phone = c.phone.trim();
  if (phone && (!PHONE.test(phone) || (phone.match(/\d/g) ?? []).length < 7)) {
    out.phone = "Phone must be a number, with an optional + and spaces, brackets or dashes";
  }
  const lines = c.address.map((l) => l.trim()).filter(Boolean);
  if (!lines.length) out.address = "The address needs at least one line";
  else if (lines.length > MAX_ADDRESS_LINES) out.address = `The address can have up to ${MAX_ADDRESS_LINES} lines`;
  else if (lines.some((l) => l.length > MAX_ADDRESS_LINE)) {
    out.address = `Each address line can be up to ${MAX_ADDRESS_LINE} characters`;
  }
  return out;
}
