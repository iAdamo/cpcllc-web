import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  orderRequired,
  reachedEnd,
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

  it("both policy pages render through LegalLayout, which carries the end marker", () => {
    // components/legal/LegalLayout.test.tsx proves the marker follows the text.
    for (const page of ["app/privacy-policy/page.tsx", "app/terms-of-service/page.tsx"]) {
      expect(readFileSync(join(__dirname, "..", page), "utf8")).toContain("<LegalLayout");
    }
  });
});
