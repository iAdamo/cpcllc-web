import { describe, expect, it } from "vitest";
import {
  HOLD_KIND_OPTIONS,
  holdKindLabel,
  isRecordId,
  periodLabel,
  runSummary,
  runTotals,
  type RetentionRun,
} from "./retention";

const run = (over: Partial<RetentionRun> = {}): RetentionRun => ({
  _id: "r1",
  startedAt: "2026-10-07T03:30:00Z",
  mode: "dry_run",
  trigger: "schedule",
  status: "done",
  counts: [
    { kind: "invoice", due: 3, deleted: 2, held: 1, linked: 0, failed: 0 },
    { kind: "booking", due: 4, deleted: 3, held: 0, linked: 1, failed: 0 },
  ],
  ...over,
});

describe("data retention page", () => {
  it("adds up a run across record types", () => {
    expect(runTotals(run())).toEqual({ due: 7, deleted: 5, held: 1, linked: 1, failed: 0 });
    expect(runTotals(null)).toEqual({ due: 0, deleted: 0, held: 0, linked: 0, failed: 0 });
  });

  it("says plainly what a run did, and that a dry run deleted nothing", () => {
    expect(runSummary(run())).toBe("5 would be deleted · 1 on hold · 1 kept with a linked record");
    expect(runSummary(run({ mode: "apply" }))).toBe("5 deleted · 1 on hold · 1 kept with a linked record");
    expect(runSummary(run({ status: "failed", error: "Mongo down" }))).toBe("Failed: Mongo down");
    expect(runSummary(run({ counts: [] }))).toBe("0 would be deleted");
  });

  it("lists every kind of hold, an account first", () => {
    expect(HOLD_KIND_OPTIONS[0].value).toBe("account");
    expect(HOLD_KIND_OPTIONS.map((o) => o.value)).toHaveLength(12);
    expect(holdKindLabel("legal_request")).toBe("Privacy or copyright request");
    expect(holdKindLabel("pro_purchase")).toBe("Pro purchase");
  });

  it("periods and record ids", () => {
    expect(periodLabel(1)).toBe("1 year");
    expect(periodLabel(7)).toBe("7 years");
    expect(isRecordId(" 64b7f0c2a1b2c3d4e5f60718 ")).toBe(true);
    expect(isRecordId("abc")).toBe(false);
  });
});
