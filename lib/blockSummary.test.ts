import { describe, expect, it } from "vitest";
import { BLOCKED_BY_NOTICE_AT, blockSummaryRows } from "./blockSummary";

describe("blocking on a person's admin page", () => {
  it("nobody, one, many: counts only, never who", () => {
    expect(blockSummaryRows({ blockedByCount: 0, blockingCount: 0, lastBlockedAt: null })).toEqual({
      blockedBy: "Nobody",
      blocking: "Nobody",
      notice: null,
    });
    expect(
      blockSummaryRows({ blockedByCount: 1, blockingCount: 2, lastBlockedAt: "2026-10-14T06:36:48.446Z" }),
    ).toEqual({ blockedBy: "1 person (last on Oct 14, 2026)", blocking: "2 people", notice: null });
  });

  it(`from ${BLOCKED_BY_NOTICE_AT} blocks, a note suggests a look`, () => {
    expect(
      blockSummaryRows({ blockedByCount: 3, blockingCount: 0, lastBlockedAt: "2026-10-14T00:00:00Z" }).notice,
    ).toBe("Blocked by 3 people. Worth a look at their posts, comments and reports.");
  });

  it("an older API without the field reads as nobody", () => {
    expect(blockSummaryRows(undefined)).toEqual({ blockedBy: "Nobody", blocking: "Nobody", notice: null });
  });
});
