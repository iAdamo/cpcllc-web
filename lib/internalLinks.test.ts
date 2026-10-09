import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Every link the website writes to one of its own pages points at a page
 * that exists. The /jobs pages were removed in June while onboarding, the
 * provider page and Favorites kept sending people there (a 404 right after
 * sign-up). This reads the source, so a new dead link fails here, not in
 * front of a user.
 */
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SOURCE_DIRS = ["app", "components", "screens", "lib", "hooks", "stores", "axios", "context"];

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name === "node_modules" || name.startsWith(".next")) continue;
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/** App routes as segment lists: "[x]" is one dynamic segment, "[...x]" the rest. */
const routes: string[][] = walk(join(ROOT, "app"))
  .filter((f) => /[\\/](page\.tsx|route\.ts)$/.test(f))
  .map((f) =>
    relative(join(ROOT, "app"), f)
      .split(sep)
      .slice(0, -1)
      .filter((s) => !/^\(.*\)$/.test(s)),
  );

function routeExists(path: string): boolean {
  const segs = path.split("/").filter(Boolean);
  return routes.some((r) => {
    for (let i = 0; i < r.length; i++) {
      if (/^\[\[?\.\.\./.test(r[i])) return segs.length >= i + (r[i].startsWith("[[") ? 0 : 1);
      if (i >= segs.length) return false;
      if (/^\[.+\]$/.test(r[i])) continue;
      if (segs[i] === ":dynamic") return false; // a variable where the route has a fixed name
      if (r[i] !== segs[i]) return false;
    }
    return r.length === segs.length;
  });
}

/** A file under public/ ("/logo.png") is served as is. */
const isPublicFile = (path: string) => /\.[a-z0-9]+$/i.test(path) || existsSync(join(ROOT, "public", path));

/** "/c/${slug}?tab=x#top" → "/c/:dynamic". */
function normalise(raw: string): string | null {
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  const path = raw
    .replace(/\$\{[^}]*\}/g, ":dynamic")
    .split(/[?#]/)[0]
    .replace(/\/+$/, "");
  return path || "/";
}

/**
 * Links to pages that were never built (marketing footer, the old user
 * profile). Each needs a decision: build the page or remove the link. Listed
 * so a NEW dead link still fails; an entry that gets fixed must come off.
 */
const KNOWN_DEAD: Record<string, string[]> = {
  "components/layout/Footer.tsx": [
    "/companies/home-services",
    "/requests",
    "/profile",
    "/about",
    "/blog",
    "/careers",
    "/cookies",
  ],
  "components/layout/NavBar.tsx": ["/profile"],
  "components/ProfileMenu.tsx": ["/profile/:dynamic"],
  "components/layout/PreFooter.tsx": [
    "/industries/e-commerce",
    "/industries/healthcare",
    "/industries/real-estate",
    "/industries/tech-startups",
    "/industries/education",
    "/industries/hospitality",
    "/client-portal",
    "/service-packages",
    "/project-tracker",
    "/billing",
    "/feedback-support",
    "/company-support",
    "/blog",
    "/case-studies",
    "/resources/webinars",
    "/resources/marketing-guides",
    "/resources/tools-templates",
    "/about",
    "/team",
    "/careers",
  ],
};
const isKnownDead = (l: { file: string; path: string }) => KNOWN_DEAD[l.file]?.includes(l.path) ?? false;

/** Commented-out code isn't a link anyone can follow. */
const withoutComments = (src: string) =>
  src.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^[ \t]*\/\/.*$/gm, "");

const LINK_PATTERNS = [
  /\b(?:href|ctaHref|to)\s*=\s*\{?\s*["'`](\/[^"'`]*)["'`]/g,
  /\bhref\s*:\s*["'`](\/[^"'`]*)["'`]/g,
  /\brouter\.(?:push|replace|prefetch)\(\s*["'`](\/[^"'`]*)["'`]/g,
  /\bredirect\(\s*["'`](\/[^"'`]*)["'`]/g,
  /\blocation\.(?:href|assign|replace)\s*(?:=|\()\s*["'`](\/[^"'`]*)["'`]/g,
];

function internalLinks(): { file: string; path: string }[] {
  const files = SOURCE_DIRS.flatMap((d) => walk(join(ROOT, d))).filter(
    (f) => /\.(tsx?|jsx?)$/.test(f) && !/\.test\.tsx?$/.test(f),
  );
  const out: { file: string; path: string }[] = [];
  for (const f of files) {
    const src = withoutComments(readFileSync(f, "utf8"));
    for (const re of LINK_PATTERNS) {
      for (const m of src.matchAll(re)) {
        const path = normalise(m[1]);
        if (path && !isPublicFile(path)) out.push({ file: relative(ROOT, f).split(sep).join("/"), path });
      }
    }
  }
  return out;
}

describe("links to the website's own pages", () => {
  it("finds the app's routes and the links (the check is looking at real code)", () => {
    expect(routeExists("/j/:dynamic")).toBe(true);
    expect(routeExists("/admin")).toBe(true);
    expect(routeExists("/jobs")).toBe(false);
    expect(internalLinks().length).toBeGreaterThan(20);
  });

  it("every one points at a page that exists", () => {
    const dead = internalLinks()
      .filter((l) => !routeExists(l.path) && !isKnownDead(l))
      .map((l) => `${l.file}: ${l.path}`);
    expect(dead).toEqual([]);
  });

  it("the known-dead list holds only links that are still there and still dead", () => {
    const links = internalLinks();
    const stale = Object.entries(KNOWN_DEAD).flatMap(([file, paths]) =>
      paths
        .filter((path) => routeExists(path) || !links.some((l) => l.file === file && l.path === path))
        .map((path) => `${file}: ${path}`),
    );
    expect(stale).toEqual([]);
  });

  it("ignores links in commented-out code", () => {
    const src = ['{/* <Link href="/gone" /> */}', '// router.push("/gone")', '<a href="/kept" />'].join("\n");
    expect(withoutComments(src)).toBe('\n\n<a href="/kept" />');
  });
});
