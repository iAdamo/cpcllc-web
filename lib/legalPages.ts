/**
 * Legal and contact pages: open to everyone, signed in or not, verified or
 * not, on a phone or a computer. The three route guards (SessionContext,
 * AuthGate, MobileGate) each spread this list into their own, so a new
 * legal page is added once. Regression: /privacy-request and /dmca were
 * added as pages but not to the guards, and a signed-out visitor was sent
 * to the home page.
 */
export const LEGAL_PAGES = [
  "/privacy-policy",
  "/terms-of-service",
  "/contact",
  "/privacy-request",
  "/dmca",
] as const;
