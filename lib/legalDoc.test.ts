import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { readLegalDoc } from "@/lib/legalDoc";

/**
 * The Privacy Policy and Terms of Service are Markdown files whose first line
 * is their date. Regression: the policy page's header said "Effective Date:
 * Upon Publication" while the text said October 8, and the Terms page carried
 * a third, hard-coded date.
 */
const root = fileURLToPath(new URL("../", import.meta.url));
const DOCS = ["app/privacy-policy/policy.md", "app/terms-of-service/terms.md"];

describe("readLegalDoc", () => {
  it("takes the date from the first line and starts the body after it", () => {
    expect(readLegalDoc("**Last Updated:** October 8, 2026\r\n\r\nFirst paragraph.")).toEqual({
      lastUpdated: "October 8, 2026",
      body: "First paragraph.",
    });
  });

  it("a document without the line has no date and keeps its text", () => {
    expect(readLegalDoc("Just text.")).toEqual({ body: "Just text." });
  });
});

describe.each(DOCS)("%s", (file) => {
  const source = readFileSync(`${root}${file}`, "utf8");
  const doc = readLegalDoc(source);

  it("states its date on the first line, as a real date", () => {
    expect(doc.lastUpdated).toMatch(/^[A-Z][a-z]+ \d{1,2}, 20\d\d$/);
    expect(Number.isNaN(Date.parse(doc.lastUpdated!))).toBe(false);
  });

  it("numbers its sections 1, 2, 3 without gaps", () => {
    const numbers = [...doc.body.matchAll(/^## (\d+)\. /gm)].map((m) => Number(m[1]));
    expect(numbers.length).toBeGreaterThan(10);
    expect(numbers).toEqual(numbers.map((_, i) => i + 1));
  });

  it("every 'Section N' it refers to exists", () => {
    const last = Math.max(...[...doc.body.matchAll(/^## (\d+)\. /gm)].map((m) => Number(m[1])));
    for (const m of doc.body.matchAll(/Sections? (\d+)(?:\.\d+)?(?: and (\d+))?/g)) {
      for (const n of [m[1], m[2]].filter(Boolean)) {
        expect(Number(n), m[0]).toBeLessThanOrEqual(last);
      }
    }
  });

  it("says nothing about Upon Publication or an Effective Date of its own", () => {
    expect(source).not.toMatch(/Upon Publication|Effective Date/);
  });

  // Marketplace work is a Job; "Task" means only a Team Task (Privacy Policy
  // 13A). Both documents said Task for jobs until 2026-10-10.
  it("calls marketplace work a Job, never a Task", () => {
    const stray = [...doc.body.matchAll(/\bTasks?\b/g)]
      .filter((m) => !/\bTeam[\s*_]*$/.test(doc.body.slice(Math.max(0, m.index - 12), m.index)))
      .map((m) => doc.body.slice(Math.max(0, m.index - 20), m.index + 10).replace(/\s+/g, " "));
    expect(stray).toEqual([]);
    expect(readLegalDoc("**Task** means x").body.match(/\bTask\b/)).not.toBeNull(); // the check sees bold too
  });
});
