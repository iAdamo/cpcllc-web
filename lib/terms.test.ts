import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  acceptedTermsFor,
  marketingOptInField,
  orderRequired,
  reachedEnd,
  sendsToTermsPage,
  termsPageFor,
  TERMS_DOCS,
} from "./terms";

describe("website Terms acceptance", () => {
  it("shows Privacy first, then Terms, and only what the site has a page for", () => {
    expect(
      orderRequired([
        { termsType: "service", version: "v1.0" },
        { termsType: "payments", version: "v1.0" },
        { termsType: "privacy", version: "v2.0" },
      ]).map((t) => t.termsType),
    ).toEqual(["privacy", "service"]);
    expect(orderRequired(undefined)).toEqual([]);
  });

  it("the documents are the site's own policy pages", () => {
    expect(TERMS_DOCS.privacy.path).toBe("/privacy-policy");
    expect(TERMS_DOCS.service.path).toBe("/terms-of-service");
  });

  it("comes back to where the person was", () => {
    expect(termsPageFor("/onboarding?step=3")).toBe(
      "/auth/terms?next=%2Fonboarding%3Fstep%3D3",
    );
  });

  it("Accept unlocks once the end of the document is in view", () => {
    expect(reachedEnd(5000, 600)).toBe(false); // end is far below
    expect(reachedEnd(620, 600)).toBe(true); // within the slack
    expect(reachedEnd(300, 600)).toBe(true); // short document, end already showing
  });

  it("REGRESSION: a page that hasn't rendered the document yet is not read", () => {
    // The frame first loads the site's empty shell (540px, no text). By
    // height alone that is "at the bottom", which unlocked Accept before the
    // policy appeared. With no end marker there is nothing to have read.
    expect(reachedEnd(null, 540)).toBe(false);
    expect(reachedEnd(undefined, 540)).toBe(false);
  });

  it("the sign-up checkbox sends the versions the form showed, as the website", () => {
    expect(
      acceptedTermsFor({
        terms: [
          { termsType: "privacy", version: "v1.0" },
          { termsType: "service", version: "v2.0" },
          { termsType: "payments", version: "v1.0" },
        ],
      }),
    ).toEqual({ service: "v2.0", privacy: "v1.0", platform: "web" });
  });

  it("sends nothing when the versions couldn't load (an older API refuses the field)", () => {
    expect(acceptedTermsFor(undefined)).toBeUndefined();
    expect(acceptedTermsFor(null)).toBeUndefined();
    expect(acceptedTermsFor({ terms: [] })).toBeUndefined();
  });

  it("both policy pages render through LegalLayout, which carries the end marker", () => {
    // components/legal/LegalLayout.test.tsx proves the marker follows the text.
    for (const page of [
      "app/privacy-policy/page.tsx",
      "app/terms-of-service/page.tsx",
    ]) {
      expect(readFileSync(join(__dirname, "..", page), "utf8")).toContain(
        "<LegalLayout",
      );
    }
  });
});

// The unticked marketing box (2026-10-11): marketing is opt-in. An older API
// refuses unknown fields, so it goes only to an API that lists it.
describe("sign-up marketing box", () => {
  const terms = [{ termsType: "privacy", version: "v1.0" }] as never;
  it("sends the answer, ticked or not, to an API that takes it", () => {
    const newer = { terms, signup: { marketingOptIn: true } };
    expect(marketingOptInField(newer, true)).toEqual({ marketingOptIn: true });
    expect(marketingOptInField(newer, false)).toEqual({ marketingOptIn: false });
  });
  it("sends nothing to an older API or before the versions load", () => {
    expect(marketingOptInField({ terms }, true)).toEqual({});
    expect(marketingOptInField(undefined, true)).toEqual({});
  });
});

/**
 * REGRESSION (2026-10-20): with a new Terms version on, the acceptance page
 * "kept on loading". Its frame shows the policy page; that page's own API call
 * got TERMS_NOT_ACCEPTED and the API client moved the frame to /auth/terms,
 * which framed the policy again, and so on. The outer page never saw the text.
 */
describe("which pages a TERMS_NOT_ACCEPTED answer moves", () => {
  it("never a page inside a frame (the policies shown on the acceptance page)", () => {
    expect(sendsToTermsPage("/privacy-policy", true)).toBe(false);
    expect(sendsToTermsPage("/providers", true)).toBe(false);
  });

  it("never a legal page, nor the acceptance page itself", () => {
    for (const p of ["/privacy-policy", "/terms-of-service", "/terms-of-service/", "/dmca", "/contact"]) {
      expect([p, sendsToTermsPage(p, false)]).toEqual([p, false]);
    }
    expect(sendsToTermsPage("/auth/terms", false)).toBe(false);
  });

  it("any other page of the site still goes to accept", () => {
    expect(sendsToTermsPage("/admin", false)).toBe(true);
    expect(sendsToTermsPage("/providers/abc", false)).toBe(true);
  });

  it("the API client asks it, with the frame check", () => {
    const src = readFileSync(join(__dirname, "..", "axios", "conf.ts"), "utf8");
    expect(src).toContain("sendsToTermsPage(window.location.pathname, window.self !== window.top)");
  });
});
