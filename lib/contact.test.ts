import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { CONTACT } from "./contact";
import { DMCA_AGENT } from "./dmcaAgent";

/**
 * One contact email, phone and address for the whole site (Adam, 2026-10-11:
 * the Tampa address is the company's only one; email the gmail inbox for now).
 * Regression: the footer, /contact and /dmca published a Clearwater address and
 * support@companiescenter.com while the Privacy Policy said Tampa. The
 * policy's own check is in lib/legalDoc.test.ts.
 */
const root = join(__dirname, "..");

describe("company contact details", () => {
  it("the DMCA agent is at the company address, as the policy says", () => {
    expect(DMCA_AGENT.address).toEqual([...CONTACT.address]);
  });

  it("no page writes its own email, phone or the old address", () => {
    const dirs = ["app", "components", "screens", "lib", "hooks", "constants", "utils"];
    const files = dirs.flatMap((d) =>
      (readdirSync(join(root, d), { recursive: true }) as string[])
        .filter((f) => /\.(tsx?|jsx?)$/.test(f) && !/\.test\./.test(f))
        .map((f) => relative(root, join(root, d, f)).split("\\").join("/")),
    );
    const own = new Set(["lib/contact.ts", "lib/dmcaAgent.ts"]);
    const pattern =
      /support@companiescenter\.com|companiescenterserv@|897-1727|18138971727|30190 US Highway|Clearwater, Florida 33761/;
    const stray = files
      .filter((f) => !own.has(f))
      .filter((f) => pattern.test(readFileSync(join(root, f), "utf8")));
    expect(stray).toEqual([]);
  });
});
