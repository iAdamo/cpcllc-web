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
 * the example dashboard.
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
    // Ordinary copy passes.
    expect(hits("Search verified providers near you")).toBe(false);
    expect(hits("Serving the US and Nigeria")).toBe(false);
  });
});
