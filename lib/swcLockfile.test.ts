import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * The lockfile must list Next's compiler (@next/swc-*) for every platform,
 * not only the one it was made on. Regression (2026-10-11): it had only
 * @next/swc-win32-x64-msvc, so `npm ci` on the Linux server installed no
 * compiler, and every `next build` printed "Failed to patch lockfile ...
 * reading 'os'" while fetching one. Fix after a Next upgrade:
 * `node scripts/fill-swc-lockfile.mjs --write`.
 */
const lock = JSON.parse(readFileSync(fileURLToPath(new URL("../package-lock.json", import.meta.url)), "utf8"));
const next = lock.packages["node_modules/next"];
const swc = Object.entries(next.optionalDependencies as Record<string, string>).filter(([name]) =>
  name.startsWith("@next/swc-"),
);

describe("Next's compiler in the lockfile", () => {
  it("Next names a compiler for each platform, including the server's (Linux x64)", () => {
    expect(swc.length).toBeGreaterThanOrEqual(8);
    expect(swc.map(([name]) => name)).toContain("@next/swc-linux-x64-gnu");
  });

  it.each(swc)("%s@%s is locked, with where to get it and its checksum", (name, version) => {
    const entry = lock.packages[`node_modules/${name}`];
    expect(entry, `${name} is missing: run node scripts/fill-swc-lockfile.mjs --write`).toBeDefined();
    expect(entry.version).toBe(version);
    expect(entry.optional).toBe(true);
    expect(entry.resolved).toBe(`https://registry.npmjs.org/${name}/-/${name.split("/")[1]}-${version}.tgz`);
    expect(entry.integrity).toMatch(/^sha512-[A-Za-z0-9+/]+=*$/);
    expect(entry.os?.length).toBe(1);
    expect(entry.cpu?.length).toBe(1);
  });
});
