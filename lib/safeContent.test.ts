import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import SvgIcon from "@/components/ui/SvgIcon";
import { isSvgIcon, plainText, safeExternalUrl, svgMaskUrl } from "./safeContent";

describe("safeExternalUrl: what a business typed, as a link that only opens a page", () => {
  it("keeps web addresses, adds https to a bare domain", () => {
    expect(safeExternalUrl("https://instagram.com/acme")).toBe("https://instagram.com/acme");
    expect(safeExternalUrl("http://acme.co")).toBe("http://acme.co/");
    expect(safeExternalUrl("x.com/acme")).toBe("https://x.com/acme");
    expect(safeExternalUrl("www.acme.co")).toBe("https://www.acme.co/");
  });

  it("anything else is not a link", () => {
    for (const v of [
      "javascript:alert(document.cookie)",
      "JaVaScRiPt:alert(1)",
      "data:text/html,<script>alert(1)</script>",
      "vbscript:x",
      "@acme",
      "/admin",
      "//evil.test/x",
      "file:///etc/passwd",
      "https://localhost/x",
      "https://acme .co",
      "",
      null,
      42,
    ]) {
      expect([v, safeExternalUrl(v)]).toEqual([v, null]);
    }
  });
});

describe("category icons: drawn, never run", () => {
  const evil = '<svg viewBox="0 0 24 24" onload="alert(1)"><image href="x" onerror="alert(2)"/></svg>';

  it("an SVG becomes a mask image; other values are not icons", () => {
    expect(isSvgIcon('<svg viewBox="0 0 24 24"><path d="M1 1"/></svg>')).toBe(true);
    expect(isSvgIcon("wrench")).toBe(false);
    expect(isSvgIcon('<img src=x onerror="alert(1)">')).toBe(false);
    const url = svgMaskUrl('<svg viewBox="0 0 24 24"><path d="M1 1"/></svg>')!;
    expect(url.startsWith('url("data:image/svg+xml;charset=utf-8,')).toBe(true);
    expect(decodeURIComponent(url)).toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  it("rendered, a hostile icon leaves no element or handler in the page", () => {
    const html = renderToStaticMarkup(createElement(SvgIcon, { svg: evil, className: "w-6 h-6" }));
    expect(html.startsWith("<span")).toBe(true);
    expect(html).not.toMatch(/<svg|<image|onload=|onerror=/i);
    expect(renderToStaticMarkup(createElement(SvgIcon, { svg: "<b>x</b>" }))).toBe("");
  });

  it("no page sets API text as HTML any more (gate)", () => {
    const roots = ["app", "components", "screens"];
    const files = (dir: string): string[] =>
      readdirSync(dir).flatMap((n) => {
        const p = join(dir, n);
        return statSync(p).isDirectory() ? files(p) : /\.tsx$/.test(n) ? [p] : [];
      });
    const base = join(__dirname, "..");
    // The only HTML set directly: fixed scripts the site writes itself.
    const allowed = new Set([
      "app/layout.tsx", // the embedded-mode class, fixed text
      "app/page.tsx", // JSON-LD from constants
      "components/ui/gluestack-ui-provider/index.web.tsx", // colour mode script
    ]);
    const found = roots
      .flatMap((r) => files(join(base, r)))
      .filter((f) => readFileSync(f, "utf8").includes("dangerouslySetInnerHTML"))
      .map((f) => relative(base, f).replace(/\\/g, "/"))
      .filter((f) => !allowed.has(f));
    expect(found).toEqual([]);
  });
});

describe("broadcast text, as people get it", () => {
  it("tags become spacing; nothing is markup", () => {
    expect(plainText("<p>Hello <b>there</b></p><p>Line 2</p>")).toBe("Hello there\nLine 2");
    expect(plainText('<img src=x onerror="alert(1)">Hi')).toBe("Hi");
    expect(plainText("Tom &amp; Jerry &lt;3")).toBe("Tom & Jerry <3");
    expect(plainText(undefined)).toBe("");
  });
});
