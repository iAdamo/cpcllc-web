import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * A server page may render a component from a "use client" module, but must
 * not use any other value from it: Next replaces those exports with client
 * references, so on the server they are not the value. Regression:
 * /legal-notice called NOTICE_TABS.some(...) from the forms module and every
 * visit showed the error page. Unit tests rendered the client component and
 * never saw it.
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

function resolve(spec: string): string | null {
  const base = join(root, spec.slice(2));
  for (const c of [`${base}.tsx`, `${base}.ts`, join(base, "index.tsx"), join(base, "index.ts")]) {
    if (existsSync(c)) return c;
  }
  return null;
}

const isClient = (file: string) => /^\s*["']use client["']/.test(readFileSync(file, "utf8"));

describe("server pages and client modules", () => {
  const serverPages = pages(join(root, "app")).filter((p) => !isClient(p));

  it("finds the server pages", () => {
    expect(serverPages.length).toBeGreaterThan(5);
  });

  it.each(serverPages.map((p) => [p.slice(root.length)]))(
    "%s takes nothing but components from client modules",
    (rel) => {
      const src = readFileSync(join(root, rel), "utf8");
      for (const m of src.matchAll(/import\s+(?!type\b)([^;]*?)\s+from\s+["'](@\/[^"']+)["']/g)) {
        const target = resolve(m[2]);
        if (!target || !isClient(target)) continue;
        const named = /\{([^}]*)\}/.exec(m[1])?.[1] ?? "";
        const values = named
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s && !s.startsWith("type "))
          // Components are PascalCase; anything else is data or a function.
          .filter((s) => !/^[A-Z][A-Za-z0-9]*$/.test(s.split(/\s+as\s+/)[0]));
        expect(values, `${rel} imports ${values.join(", ")} from ${m[2]}`).toEqual([]);
      }
    },
  );
});
