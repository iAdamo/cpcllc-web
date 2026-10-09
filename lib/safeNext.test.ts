import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { safeNextPath } from "./safeNext";

describe("safeNextPath", () => {
  it("keeps a path on this site, with its query", () => {
    expect(safeNextPath("/onboarding")).toBe("/onboarding");
    expect(safeNextPath("/jobs?tab=mine")).toBe("/jobs?tab=mine");
  });

  it("REGRESSION: refuses paths that leave the site (open redirect)", () => {
    const backslash = String.fromCharCode(92); // "/\evil.example"
    for (const bad of ["//evil.example", `/${backslash}evil.example`, "https://evil.example", "evil", ""]) {
      expect(safeNextPath(bad)).toBe("/");
    }
  });

  it("falls back when there is nothing", () => {
    expect(safeNextPath(null, "/home")).toBe("/home");
    expect(safeNextPath(undefined)).toBe("/");
  });
});

/**
 * Every place that reads where to go next (?next=, the MFA hand-off) passes it
 * through safeNextPath. Regression: the sign-in and MFA pages followed it raw,
 * so ?next=https://elsewhere sent people off the site after signing in.
 */
describe("every ?next= goes through safeNextPath", () => {
  const root = fileURLToPath(new URL("..", import.meta.url));
  const walk = (d: string, out: string[] = []): string[] => {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (n === "node_modules" || n.startsWith(".next")) continue;
      if (statSync(p).isDirectory()) walk(p, out);
      else if (/\.tsx?$/.test(n) && !/\.test\.tsx?$/.test(n)) out.push(p);
    }
    return out;
  };
  it("no raw next is followed", () => {
    const offenders: string[] = [];
    for (const d of ["app", "components", "screens", "context", "hooks", "stores"]) {
      for (const f of walk(join(root, d))) {
        const src = readFileSync(f, "utf8");
        for (const line of src.split("\n")) {
          const read = /get\(\s*["']next["']\s*\)|pending\.next/.test(line);
          if (!read || line.includes("safeNextPath(")) continue;
          const name = line.match(/(?:const|let)\s+(\w+)\s*=/)?.[1];
          if (name && src.includes(`safeNextPath(${name})`)) continue;
          offenders.push(`${relative(root, f)}: ${line.trim()}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
