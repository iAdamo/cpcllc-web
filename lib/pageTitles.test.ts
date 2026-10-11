import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The root layout's title template is "%s | Companies Center", so a page's
 * own title must not end with the name again. Regression (2026-10-11): the
 * Terms tab read "Terms of Service | Companies Center | Companies Center",
 * and eleven more pages did the same with "— CompaniesCenter".
 */
const root = fileURLToPath(new URL("../", import.meta.url));

function pages(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) pages(p, out);
    else if (name === "page.tsx") out.push(p);
  }
  return out;
}

/** The plain string titles a page's metadata sets. */
const titlesIn = (source: string) =>
  [...source.matchAll(/^\s*title:\s*(["'])(.*?)\1,?\s*$/gm)].map((m) => m[2]);

const endsWithName = (title: string) => /[|—–-]\s*Companies\s?Center(?:\s?LLC)?\s*$/i.test(title);

describe("page titles", () => {
  it("the layout adds the name to every page title", () => {
    const layout = readFileSync(join(root, "app/layout.tsx"), "utf8");
    expect(layout).toContain('template: "%s | Companies Center"');
  });

  it("finds the titles it checks", () => {
    expect(titlesIn('  title: "Sign in",\n')).toEqual(["Sign in"]);
    expect(endsWithName("Sign in — CompaniesCenter")).toBe(true);
    expect(endsWithName("Terms of Service | Companies Center")).toBe(true);
    expect(endsWithName("Your Favorites — CompaniesCenterLLC")).toBe(true);
    expect(endsWithName("Job on CompaniesCenter")).toBe(false);
  });

  it("no page repeats the name the template adds", () => {
    const repeated = pages(join(root, "app")).flatMap((p) =>
      titlesIn(readFileSync(p, "utf8"))
        .filter(endsWithName)
        .map((t) => `${relative(root, p)}: ${t}`),
    );
    expect(repeated).toEqual([]);
  });

  it("no page title starts or ends with a space", () => {
    const padded = pages(join(root, "app")).flatMap((p) =>
      titlesIn(readFileSync(p, "utf8"))
        .filter((t) => t !== t.trim())
        .map((t) => `${relative(root, p)}: "${t}"`),
    );
    expect(padded).toEqual([]);
  });
});
