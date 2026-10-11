/**
 * The company's one contact email, phone and postal address, shown by the
 * footer, /contact and /dmca. The Privacy Policy (section 35) and the API's
 * SUPPORT_EMAIL and COMPANY_ADDRESS must say the same; lib/contact.test.ts
 * checks the policy and that no page writes its own copy.
 *
 * The email is the gmail inbox until the company-domain mailbox exists
 * (Adam, 2026-10-11); change it here, in the policy and in the API's env.
 */
export const CONTACT = {
  email: "companiescenterserv@gmail.com",
  phone: "+1 (813) 897-1727",
  phoneHref: "tel:+18138971727",
  address: ["400 N Ashley Dr, Suite 1900", "Tampa, FL 33602", "United States"],
} as const;

/** The address on Google Maps. */
export const CONTACT_MAPS_URL = `https://maps.google.com/?q=${encodeURIComponent(CONTACT.address.join(", "))}`;
