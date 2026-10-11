import { expect } from "vitest";

/**
 * Test helpers for server-rendered forms (renderToStaticMarkup). The
 * accessibility law: two focusable controls never share an accessible name,
 * and every control has a label.
 */

/** The visible label text of each labelled control (hints left out). */
export function labels(html: string): string[] {
  const out: string[] = [];
  for (const m of html.matchAll(/<label[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/label>/g)) {
    out.push(m[2].replace(/<span[^>]*id="[^"]*-hint"[\s\S]*?<\/span>/g, "").replace(/<[^>]+>/g, "").trim());
  }
  return out;
}

export function controlIds(html: string): string[] {
  return [...html.matchAll(/<(?:input|textarea|select)[^>]*\sid="([^"]+)"/g)].map((m) => m[1]);
}

/** Every control labelled, and no two labels alike. */
export function expectNamedOnce(html: string) {
  const names = labels(html);
  expect(names.length).toBeGreaterThan(2);
  expect(new Set(names).size).toBe(names.length);
  const forIds = [...html.matchAll(/<label[^>]*for="([^"]+)"/g)].map((m) => m[1]);
  for (const id of controlIds(html)) expect(forIds).toContain(id);
}
