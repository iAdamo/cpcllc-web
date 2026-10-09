import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  ENGAGED_STATUSES,
  JOB_STATUSES,
  STATUS_CHART_COLORS,
  STATUS_LABELS,
  STATUS_TONES,
  budgetText,
  canRestore,
  canTakeDown,
  engagedCount,
  neededByText,
} from "@/lib/jobs";

/** Jobs on the website: one status, money and dates. */
const api = fileURLToPath(new URL("../../cpcllc-backend/src/modules/jobs/job-states.ts", import.meta.url));
const adminJobs = fileURLToPath(
  new URL("../../cpcllc-backend/src/modules/admin/service/admin-jobs.service.ts", import.meta.url),
);

describe("jobs", () => {
  it("the same nine statuses as the API (when it sits next to this repo)", () => {
    if (!existsSync(api)) return;
    const values = [...readFileSync(api, "utf8").matchAll(/^\s+\w+ = '([a-z_]+)',/gm)].map((m) => m[1]);
    expect([...values].sort()).toEqual([...JOB_STATUSES].sort());
  });

  it("every status has a label, a tone and a chart color; engaged statuses are statuses", () => {
    for (const s of JOB_STATUSES)
      expect([s, !!STATUS_LABELS[s], !!STATUS_TONES[s], !!STATUS_CHART_COLORS[s]]).toEqual([s, true, true, true]);
    for (const s of ENGAGED_STATUSES) expect(JOB_STATUSES).toContain(s);
  });

  it("money in the job's currency, or what the client asked for", () => {
    expect(budgetText({ budget: 1250, currency: "USD" })).toBe("$1,250");
    expect(budgetText({ budget: 50000, currency: "NGN" })).toBe("₦50,000");
    expect(budgetText({ budget: null, pricing: "estimates" })).toBe("Estimates requested");
    expect(budgetText({})).toBe("—");
  });

  it("a needed-by day reads the same everywhere", () => {
    expect(neededByText("2026-10-11")).toBe("Sun, Oct 11, 2026");
    expect(neededByText(null)).toBe("—");
  });

  it("staff take down a job nobody is hired for, and restore only their own takedown", () => {
    expect(canTakeDown({ status: "open" })).toBe(true);
    expect(canTakeDown({ status: "hired", providerId: "p" })).toBe(false);
    expect(canRestore({ status: "cancelled", lifecycle: { cancelledBy: "staff" } })).toBe(true);
    expect(canRestore({ status: "cancelled", lifecycle: { cancelledBy: "client" } })).toBe(false);
  });

  it("offers Take down for exactly the statuses the API takes down", () => {
    if (!existsSync(adminJobs)) return;
    const src = readFileSync(adminJobs, "utf8");
    const block = src.slice(src.indexOf("const TAKEDOWN_FROM"), src.indexOf("];", src.indexOf("const TAKEDOWN_FROM")));
    const camel = (s: string) => s.replace(/(^|_)(\w)/g, (_, __, c: string) => c.toUpperCase());
    const fromApi = [...block.matchAll(/JobStatus\.(\w+)/g)].map((m) => m[1]);
    expect(JOB_STATUSES.filter((s) => canTakeDown({ status: s })).map(camel)).toEqual(fromApi);
  });

  it("In progress counts every job a business is on", () => {
    expect(engagedCount({ open: 9, hired: 1, in_progress: 2, awaiting_confirmation: 3, disputed: 4, completed: 5 })).toBe(10);
    expect(engagedCount({})).toBe(0);
  });
});
