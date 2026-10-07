/**
 * The website's Terms and Privacy acceptance (screens/auth/TermsAcceptancePage).
 * Pure, so the rules are unit-tested. Mirrors the app: the sign-up checkbox
 * records acceptance with the account; otherwise (older sign-ups, a newly
 * published version) Privacy Policy first, then Terms of Service, each read
 * to the end before Accept.
 */

export interface RequiredTerms {
  termsType: string;
  version: string;
  effectiveFrom?: string;
}

export const TERMS_DOCS = {
  privacy: { title: "Privacy Policy", path: "/privacy-policy" },
  service: { title: "Terms of Service", path: "/terms-of-service" },
} as const;

export type ShownTermsType = keyof typeof TERMS_DOCS;

export const TERMS_PAGE = "/auth/terms";

/** The policies to show, Privacy first. Types the website has no page for
 *  are left to the server (it only requires these two). */
export function orderRequired(
  required: RequiredTerms[] | undefined,
): Array<RequiredTerms & { termsType: ShownTermsType }> {
  const order: ShownTermsType[] = ["privacy", "service"];
  return (required ?? [])
    .filter((t): t is RequiredTerms & { termsType: ShownTermsType } =>
      (order as string[]).includes(t.termsType),
    )
    .sort((a, b) => order.indexOf(a.termsType) - order.indexOf(b.termsType));
}

/** GET terms/current: the version of each policy in force now. */
export interface CurrentTerms {
  terms: RequiredTerms[];
}

/** What the sign-up checkbox sends ("I agree to the Terms of Service and
 *  have read the Privacy Policy"): the versions the form showed. */
export interface AcceptedTerms {
  service?: string;
  privacy?: string;
  platform: "web";
}

/** The `acceptedTerms` field for the sign-up body, or undefined to leave it
 *  out: an API older than the checkbox has no terms/current and would refuse
 *  the unknown field. Those accounts, and any whose versions couldn't load,
 *  are shown the documents after the email code instead. */
export function acceptedTermsFor(
  current: CurrentTerms | null | undefined,
): AcceptedTerms | undefined {
  const version = (type: ShownTermsType) =>
    current?.terms?.find((t) => t.termsType === type)?.version;
  const service = version("service");
  const privacy = version("privacy");
  if (!service && !privacy) return undefined;
  return {
    ...(service ? { service } : {}),
    ...(privacy ? { privacy } : {}),
    platform: "web",
  };
}

/** The acceptance page, coming back to `currentPath` afterwards. */
export function termsPageFor(currentPath: string): string {
  return `${TERMS_PAGE}?next=${encodeURIComponent(currentPath)}`;
}

/** Marks the end of a legal document (components/legal/LegalLayout). It is
 *  rendered in the same commit as the text, so finding it proves the text is
 *  on the page. */
export const LEGAL_END_ATTR = "data-legal-end";

/** Read to the end? `endTop` is the end marker's top edge relative to the
 *  frame's viewport, or null when the marker isn't there yet. The site renders
 *  its pages after hydration, so the frame first loads an empty shell; an empty
 *  page is "at the bottom" by height alone, which once unlocked Accept before a
 *  word of the policy had appeared. No marker means not read. A document short
 *  enough to show its end without scrolling counts as read. */
export function reachedEnd(
  endTop: number | null | undefined,
  viewportHeight: number,
  slack = 24,
): boolean {
  return typeof endTop === "number" && endTop <= viewportHeight + slack;
}
