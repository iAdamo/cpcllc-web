import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * No made-up numbers or credentials in the website's copy (FTC: claims must
 * be true and provable). Each pattern is one that shipped and was removed:
 * "Join 500+ verified professionals", "3× more responses", "Access thousands
 * of homeowners", "Technology & IT is trending today" (hardcoded),
 * "Background checked & licensed" (verification is a document review),
 * "same-day appointments", "Fast local matches, same day", a revenue tile in
 * the example dashboard. 2026-10-11 (against the Privacy Policy, sections 1,
 * 5.15 and 16): "Every provider goes through identity and business
 * verification", "Verified before they're visible", "browse hundreds of
 * verified professionals", "all major cities ... throughout Florida",
 * "automated checks" on reviews, "Join verified local professionals".
 * A real figure belongs in the API, not in the source.
 */
const BANNED: Array<[RegExp, string]> = [
  [/\b\d[\d,]*\+\s*(verified|professionals|providers|businesses|companies|clients|customers|users|homeowners)\b/i, "a head-count nobody measured"],
  [/\b\d+(\.\d+)?\s*[×x]\s*more\b/i, "an uplift nobody measured"],
  [/\bthousands of (homeowners|businesses|companies|clients|customers|users|providers|professionals)\b/i, "a head-count nobody measured"],
  [/\btrending today\b/i, "a hardcoded trend"],
  [/\bbackground[- ]checked\b/i, "a check the platform doesn't do"],
  [/\bsame[- ]day\b/i, "a speed the platform doesn't promise"],
  [/label: "Revenue"/, "an earnings figure in an illustration"],
  [/identity and business verification|verified before they're visible|identity[- ]checked/i, "an identity check the platform doesn't do (policy 5.15)"],
  [/\bverified (service )?(professionals|providers)\b(?!",? *(format|label))|\bjoin verified\b/i, "says every listed business is verified; only reviewed ones carry the badge"],
  [/\bhundreds of\b/i, "a head-count nobody measured"],
  [/\ball major cities\b|\b(across|throughout) Florida\b/i, "a service area wider than the policy's (Hillsborough County first)"],
  [/\bautomated checks?\b/i, "a review check the platform doesn't run"],
];

const ROOTS = ["app", "components", "screens"];
const root = join(__dirname, "..");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [full] : [];
  });
}

describe("marketing copy", () => {
  it("makes no claim the code can't back", () => {
    const found: string[] = [];
    for (const file of ROOTS.flatMap((r) => sourceFiles(join(root, r)))) {
      readFileSync(file, "utf8")
        .split("\n")
        .forEach((line, i) => {
          for (const [pattern, why] of BANNED) {
            if (pattern.test(line)) {
              found.push(`${relative(root, file)}:${i + 1} ${why}: ${line.trim()}`);
            }
          }
        });
    }
    expect(found).toEqual([]);
  });

  it("catches the claims it was written for", () => {
    const hits = (s: string) => BANNED.some(([p]) => p.test(s));
    expect(hits("Join 500+ verified\\nprofessionals.")).toBe(true);
    expect(hits("receive 3× more responses.")).toBe(true);
    expect(hits('{ Icon: Users, label: "Access thousands of homeowners" }')).toBe(true);
    expect(hits("is trending today")).toBe(true);
    expect(hits('description="Background checked & licensed"')).toBe(true);
    expect(hits("Book same-day appointments")).toBe(true);
    expect(hits("Fast local matches, same day")).toBe(true);
    expect(hits("homeowners with verified, background-checked providers")).toBe(true);
    expect(hits('{ label: "Revenue", value: "$8.4k" }')).toBe(true);
    expect(hits("goes through identity and business verification")).toBe(true);
    expect(hits('title: "Verified before they\'re visible",')).toBe(true);
    expect(hits('line: "Every company is identity-checked before it can take jobs.",')).toBe(true);
    expect(hits("browse hundreds of verified professionals in your area")).toBe(true);
    expect(hits("Search verified providers near you")).toBe(true);
    expect(hits('headline: "Join verified\\nlocal professionals.",')).toBe(true);
    expect(hits("all major cities and surrounding areas throughout Florida")).toBe(true);
    expect(hits("verified service professionals across Florida")).toBe(true);
    expect(hits("We use a combination of automated checks")).toBe(true);
    // Ordinary copy passes, including the badge itself and the real count.
    expect(hits("Serving the US and Nigeria")).toBe(false);
    expect(hits('{ Icon: Shield, label: "Verified Badges" }')).toBe(false);
    expect(hits('verifiedProviders: { label: "Verified providers", format: (v) => `${v}` },')).toBe(false);
    expect(hits("one we have reviewed carries a Verified badge")).toBe(false);
    expect(hits("starting in Tampa and the rest of Hillsborough County, Florida")).toBe(false);
    // Account deletion asks the person to prove it's them: not a provider check.
    expect(hits('{step === "form" && "Identity verification"}')).toBe(false);
  });
});
