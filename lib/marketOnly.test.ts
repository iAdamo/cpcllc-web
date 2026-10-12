import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The marketplace is US only (2026-10-12; the API scopes every listing to it,
 * cpcllc-backend src/common/market.ts). Nigeria was taken out the same day:
 * the +234 phone option (sign-up and business onboarding, which defaulted to
 * it), naira amounts, the Paystack checkout, the region in privacy requests,
 * the address-search bias, the account-country search seeding, the "Countries
 * served" stat, and the copy that named it. This keeps it out of the code.
 *
 * Only .ts/.tsx files are scanned. The legal documents (policy.md, terms.md)
 * are checked in lib/legalDoc.test.ts, which has to name what it forbids.
 */
const ROOT = fileURLToPath(new URL("../", import.meta.url));
const DIRS = ["app", "components", "screens", "hooks", "axios", "lib", "context", "types", "utils", "stores", "constants"];
const SELF = fileURLToPath(import.meta.url);
const NAMES_THE_WORDS = /[\\/]lib[\\/]legalDoc\.test\.ts$/;

const FORBIDDEN =
  /nigeria|naira|\bngn\b|paystack|flutterwave|\+234|234\\d|₦|\bndpa\b|\bndpc\b|africa\/lagos|us_ng|usorng|["']ng["']/i;

function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return filesUnder(path);
    return /\.(ts|tsx)$/.test(name) && path !== SELF && !NAMES_THE_WORDS.test(path) ? [path] : [];
  });
}

export function offenders(file: string, text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line, i) => ({ line: line.trim(), n: i + 1 }))
    .filter(({ line }) => FORBIDDEN.test(line))
    .map(({ line, n }) => `${file}:${n}: ${line}`);
}

const files = DIRS.flatMap((d) => filesUnder(join(ROOT, d)));

describe("US only", () => {
  it("scans the code (guards a broken walk)", () => {
    expect(files.length).toBeGreaterThan(200);
  });

  it("the detector catches each kind of trace", () => {
    for (const line of [
      "Serving the US and Nigeria",
      'currency === "NGN"',
      'import { payWithPaystack } from "@/lib/paystack";',
      'dialCode: "+234",',
      "/^\\+(1\\d{10}|234\\d{10})$/",
      "isValidUsOrNgPhoneNumber",
      "US_NG_PHONE_REGEX",
      '<option value="ng">',
      'code: "NG" as const,',
      "`₦${amount}`",
    ]) {
      expect([line, offenders("x.ts", line)]).toEqual([line, [`x.ts:1: ${line}`]]);
    }
    // Ordinary words and US copy pass.
    expect(offenders("x.ts", "Starting in Hillsborough County, FL; isFetchingNextPage; angle")).toEqual([]);
  });

  it("no other country is left in the code", () => {
    const found = files.flatMap((f) =>
      offenders(relative(ROOT, f).split(sep).join("/"), readFileSync(f, "utf8")),
    );
    expect(found).toEqual([]);
  });
});
