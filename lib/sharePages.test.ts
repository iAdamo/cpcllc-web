import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { APP_SCHEME, SHARE_PAGES, appLink, isSharePage } from "@/lib/sharePages";

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

describe("team invite links", () => {
  it("open for everyone: /team-invite/<token> is a share page, /team and /team-invites aren't", () => {
    expect(isSharePage("/team-invite/q8Xc2")).toBe(true);
    for (const p of ["/team", "/team-invite", "/team-invites/x", "/teams/x"]) {
      expect(isSharePage(p), p).toBe(false);
    }
  });
});

describe("opening the same page in the app", () => {
  it("mirrors the path under the app's scheme", () => {
    expect(appLink("/j/6ac8")).toBe("companiescenterllc://j/6ac8");
    expect(appLink("/team-invite/q8Xc2")).toBe("companiescenterllc://team-invite/q8Xc2");
    expect(appLink("//post/abc")).toBe("companiescenterllc://post/abc");
  });

  it("no page hand-writes an app path (the job page sent /t/<id> after the app moved to /j/<id>)", () => {
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir, { withFileTypes: true })) {
        const p = `${dir}/${name.name}`;
        if (name.isDirectory()) walk(p);
        else if (/\.tsx$/.test(name.name) && /<OpenInAppButton[^>]*\bpath=/.test(readFileSync(p, "utf8"))) offenders.push(p);
      }
    };
    walk(`${root}app`);
    walk(`${root}components`);
    expect(offenders).toEqual([]);
  });

  it("iOS opens every share page in the app (apple-app-site-association lists them all)", async () => {
    const { GET } = await import("@/app/.well-known/apple-app-site-association/route");
    const body = await (await GET()).json();
    const paths: string[] = body.applinks.details[0].paths;
    for (const p of SHARE_PAGES) expect(paths, p).toContain(`${p}/*`);
  });

  it("Android does too (the app's intent filters), when the app repo is next to this one", () => {
    const appJson = `${root}../companiescenterllc/app.json`;
    if (!existsSync(appJson)) return;
    const filters = JSON.parse(readFileSync(appJson, "utf8")).expo.android.intentFilters;
    const prefixes = filters.flatMap((f: { data?: Array<{ pathPrefix?: string }> }) =>
      (f.data ?? []).map((d) => d.pathPrefix).filter(Boolean),
    );
    for (const p of SHARE_PAGES) expect(prefixes, p).toContain(`${p}/`);
    expect(JSON.parse(readFileSync(appJson, "utf8")).expo.scheme).toBe(APP_SCHEME);
  });
});
