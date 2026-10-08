import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { SHARE_PAGES, isSharePage } from "@/lib/sharePages";

/**
 * Shared links must open for everyone. Regression: no route guard listed the
 * share pages, so a signed-out visitor opening a shared job, business or post
 * was sent to the home page (found by the live check, 2026-10-09).
 */
const root = fileURLToPath(new URL("../", import.meta.url));

describe("share pages", () => {
  it("each one is a real page for one item", () => {
    for (const p of SHARE_PAGES) {
      const dir = `${root}app${p}`;
      const item = readdirSync(dir).find((d) => /^\[.+\]$/.test(d));
      expect(item, p).toBeDefined();
      expect(existsSync(`${dir}/${item}/page.tsx`), p).toBe(true);
    }
  });

  it("matches whole segments: /c/<slug> opens, /clients and /contact don't", () => {
    expect(isSharePage("/j/6ac8")).toBe(true);
    expect(isSharePage("/c/bright-plumbing")).toBe(true);
    expect(isSharePage("/post/abc")).toBe(true);
    for (const p of ["/clients", "/contact", "/c", "/jobs", "/postings", "/admin"]) {
      expect(isSharePage(p), p).toBe(false);
    }
  });

  it("every route guard opens them (signed out, unverified, on a phone)", () => {
    const uses: Record<string, string> = {
      "context/SessionContext.tsx": "isSharePage(path)",
      "components/AuthGate.tsx": "...SHARE_PAGES",
      "components/MobileGate.tsx": "...SHARE_PAGES",
    };
    for (const [guard, use] of Object.entries(uses)) {
      const src = readFileSync(`${root}${guard}`, "utf8");
      expect(src, guard).toContain('from "@/lib/sharePages"');
      expect(src, guard).toContain(use);
    }
  });
});
