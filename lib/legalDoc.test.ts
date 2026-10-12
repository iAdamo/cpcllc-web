import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { readLegalDoc } from "@/lib/legalDoc";
import { CONTACT } from "@/lib/contact";

/**
 * The Privacy Policy and Terms of Service are Markdown files whose first line
 * is their date. Regression: the policy page's header said "Effective Date:
 * Upon Publication" while the text said October 8, and the Terms page carried
 * a third, hard-coded date.
 */
const root = fileURLToPath(new URL("../", import.meta.url));
const POLICY = "app/privacy-policy/policy.md";
const TERMS = "app/terms-of-service/terms.md";
const DOCS = [POLICY, TERMS];
const bodyOf = (file: string) => readLegalDoc(readFileSync(`${root}${file}`, "utf8")).body;
const flat = (s: string) => s.replace(/\s+/g, " ");

/** "1", "13A", "39.11": every `## N.` section and `### N.M` subsection. */
function sectionIds(body: string): Set<string> {
  return new Set([
    ...[...body.matchAll(/^## (\d+[A-Z]?)\. /gm)].map((m) => m[1]),
    ...[...body.matchAll(/^### (\d+\.\d+) /gm)].map((m) => m[1]),
  ]);
}

/**
 * Every "Section N" or "Sections N, M and P" whose section doesn't exist.
 * "... of the Privacy Policy" / "of the Terms" points at that document;
 * a statute ("9 U.S.C. Section 402") points at neither and is skipped.
 */
function missingReferences(body: string, own: Set<string>, others: Record<string, Set<string>>): string[] {
  const id = String.raw`\d+[A-Z]?(?:\.\d+)?`;
  const ref = new RegExp(
    String.raw`(U\.S\.C\.\s+)?\bSections?\s+(${id}(?:(?:,\s+|\s+and\s+|,\s+and\s+)${id})*)(\s+of\s+the\s+(Privacy\s+Policy|Terms(?:\s+of\s+Service)?))?`,
    "g",
  );
  const missing: string[] = [];
  for (const m of flat(body).matchAll(ref)) {
    if (m[1]) continue;
    const target = m[4] ? others[flat(m[4]).startsWith("Privacy") ? "policy" : "terms"] : own;
    for (const n of m[2].match(new RegExp(id, "g"))!) if (!target.has(n)) missing.push(m[0]);
  }
  return missing;
}

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

  it("every 'Section N' it refers to exists, in this document or the one it names", () => {
    const others = { policy: sectionIds(bodyOf(POLICY)), terms: sectionIds(bodyOf(TERMS)) };
    expect(missingReferences(doc.body, sectionIds(doc.body), others)).toEqual([]);
  });

  // One email and one phone across both documents, the ones staff set in
  // Admin > Settings > Contact details (lib/contact.ts). Regression: the
  // October 8 Terms PDF gave +1 (813) 568-0992 in Sections 29 and 43 while
  // the DMCA agent line gave 897-1727 (Adam, 2026-10-11: 897-1727 for both).
  it("gives no email or phone number but the site's own", () => {
    const text = flat(doc.body);
    expect(new Set(text.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[a-z]{2,}/gi))).toEqual(new Set([CONTACT.email]));
    expect(new Set(text.match(/\+?1? ?\(\d{3}\) \d{3}-\d{4}/g) ?? [])).toEqual(
      new Set(text.includes("(813)") ? [CONTACT.phone] : []),
    );
  });

  // Adam, 2026-10-11: the documents are the Terms of Service everywhere, as
  // the website and the app name them; the Terms PDF said "Terms of Use", and
  // the 2026-10-12 one "Terms and Conditions of Use" (kept as Terms of Service).
  it("calls the Terms the Terms of Service", () => {
    expect(source).not.toMatch(/Terms of Use|Terms and Conditions/i);
  });

  // Adam, 2026-10-12: the marketplace is US only. Nigeria came out of both
  // documents (and the API, website and app) the same day: the territory, the
  // naira checkout, the Nigerian regulator and law.
  it("names no country but the United States as part of the marketplace", () => {
    expect(source).not.toMatch(/nigeria|naira|\bNGN\b|paystack|flutterwave|\+234|₦|\bNDPA\b|\bNDPC\b/i);
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

  // Regression: the Task-to-Job rename also turned the Team Task definition
  // into "Team Job" (Privacy Policy section 2, 2026-10-10).
  it("never says Team Job: the team feature's to-do is a Team Task", () => {
    expect(doc.body).not.toMatch(/\bTeam[\s*_]+Jobs?\b/);
  });
});

describe("missingReferences", () => {
  const own = new Set(["1", "13A", "39", "39.11"]);
  const others = { policy: new Set(["26"]), terms: new Set(["39"]) };

  it("finds a section that isn't there, in a list too", () => {
    expect(missingReferences("See Section 2.", own, others)).toEqual(["Section 2"]);
    expect(missingReferences("Sections 1, 13A, and 7 apply.", own, others)).toEqual(["Sections 1, 13A, and 7"]);
    expect(missingReferences("under Section 39.12", own, others)).toEqual(["Section 39.12"]);
  });

  it("checks a named document's sections against that document, across a line break", () => {
    expect(missingReferences("Section 26 of the\nPrivacy Policy", own, others)).toEqual([]);
    expect(missingReferences("Section 13A of the Privacy Policy", own, others)).toEqual([
      "Section 13A of the Privacy Policy",
    ]);
    expect(missingReferences("Section 39 of the Terms of Service", own, others)).toEqual([]);
  });

  it("skips a statute and accepts what exists", () => {
    expect(missingReferences("9 U.S.C. Section 402; Sections 1 and 39.11", own, others)).toEqual([]);
  });
});

describe("Terms of Service", () => {
  const doc = readLegalDoc(readFileSync(`${root}${TERMS}`, "utf8"));
  const section = (n: number) => {
    const from = doc.body.indexOf(`\n## ${n}. `);
    const to = doc.body.indexOf("\n## ", from + 1);
    return flat(doc.body.slice(from, to < 0 ? undefined : to));
  };

  // The 30-day arbitration rejection window runs from accepting "this
  // [date] version" (Section 39.11), so that date must be this version's.
  // The October 8 PDF was published as October 11 (2026-10-11).
  it("the arbitration opt-out names this version's own date", () => {
    expect(section(39)).toContain(`accept this ${doc.lastUpdated} version`);
    const dated = [...flat(doc.body).matchAll(/([A-Z][a-z]+ \d{1,2}, 20\d\d) version/g)].map((m) => m[1]);
    expect(new Set(dated)).toEqual(new Set([doc.lastUpdated]));
  });

  it("Sections 29 and 43 give the site's contact email, phone and address", () => {
    for (const n of [29, 43]) {
      expect(section(n)).toContain(CONTACT.email);
      expect(section(n)).toContain(CONTACT.phone);
      expect(section(n)).toContain(`${CONTACT.address[0]}, ${CONTACT.address[1]}`);
    }
  });

  it("Section 2 offers the marketplace only in the United States", () => {
    expect(section(2)).toContain(
      "The marketplace is offered only in the United States, with an initial focus in Hillsborough County, Florida.",
    );
  });
});

// The site's one contact email and address (lib/contact.ts), as Adam set them
// on 2026-10-11, are the ones the Privacy Policy gives in section 35.
describe("Privacy Policy contact details", () => {
  it("section 35 gives the site's contact email and address", () => {
    const body = readFileSync(`${root}app/privacy-policy/policy.md`, "utf8");
    const contact = body.slice(body.indexOf("## 35."));
    expect(contact).toContain(`Privacy and account assistance: ${CONTACT.email}`);
    expect(contact).toContain(`${CONTACT.address[0]}, ${CONTACT.address[1]}`);
  });
});
