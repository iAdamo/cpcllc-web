import { describe, expect, it } from "vitest";
import { safeNextPath } from "./safeNext";

describe("safeNextPath", () => {
  it("keeps a path on this site, with its query", () => {
    expect(safeNextPath("/onboarding")).toBe("/onboarding");
    expect(safeNextPath("/tasks?tab=mine")).toBe("/tasks?tab=mine");
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
