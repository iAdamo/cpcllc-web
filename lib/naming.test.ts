import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Two features, two words (plan 2026-10-08):
 *  - a Job is marketplace work a client posts for businesses;
 *  - a Task is a to-do a company gives its own team (Team Tasks).
 * The website called jobs "tasks" (admin "Tasks" listing "All job posts",
 * the share page /t/<id>, a /tasks page titled "Tasks" rendering JobsPage).
 * Outside team code nothing says "task"; inside it nothing says "job".
 * The legal documents (policy.md, terms.md) are Adam's to change, and only
 * .ts/.tsx files are scanned.
 */
const ROOT = fileURLToPath(new URL("../", import.meta.url));
const DIRS = ["app", "components", "screens", "hooks", "axios", "lib", "context", "types", "utils", "stores", "constants"];
const isTeam = (file: string) => /[\\/]teams?[\\/]|[\\/]Team[A-Za-z]*\.tsx?$/.test(file);
const SELF = fileURLToPath(import.meta.url);

function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return filesUnder(path);
    return /\.(ts|tsx)$/.test(name) && path !== SELF ? [path] : [];
  });
}

function offenders(word: RegExp, inTeam: boolean): string[] {
  return DIRS.flatMap((d) => filesUnder(join(ROOT, d)))
    .filter((f) => isTeam(f) === inTeam)
    .flatMap((file) =>
      readFileSync(file, "utf8")
        .split("\n")
        .map((line, i) => ({ line, at: `${relative(ROOT, file).split(sep).join("/")}:${i + 1}` }))
        .filter(({ line }) => word.test(line))
        .map(({ line, at }) => `${at}: ${line.trim()}`),
    );
}

describe("jobs and tasks never share a word", () => {
  it('marketplace and admin code say "job", never "task"', () => {
    expect(offenders(/task|\btareas?\b/i, false)).toEqual([]);
  });

  it('team code says "task", never "job"', () => {
    expect(offenders(/\bjobs?\b|job[A-Z_]|[a-z]Jobs?\b|trabajo/i, true)).toEqual([]);
  });
});
