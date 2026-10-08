import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { LEGAL_PAGES } from "@/lib/legalPages";

/**
 * Legal pages must open for everyone. Regression: /privacy-request and
 * /dmca were built as pages but not added to the route guards, so a
 * signed-out visitor was sent to the home page instead.
 */
const root = fileURLToPath(new URL("../", import.meta.url));

describe("legal pages", () => {
  it("each one is a real page", () => {
    for (const p of LEGAL_PAGES) {
      expect(existsSync(`${root}app${p}/page.tsx`), p).toBe(true);
    }
  });

  it("every route guard opens them (signed out, unverified, on a phone)", () => {
    for (const guard of ["context/SessionContext.tsx", "components/AuthGate.tsx", "components/MobileGate.tsx"]) {
      const src = readFileSync(`${root}${guard}`, "utf8");
      expect(src, guard).toContain('import { LEGAL_PAGES } from "@/lib/legalPages"');
      expect(src, guard).toContain("...LEGAL_PAGES");
    }
  });
});
