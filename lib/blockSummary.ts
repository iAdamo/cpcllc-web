/**
 * What staff see about blocking on a person's admin page: how many people
 * blocked them and how many they blocked, never who (API: `blocks` on
 * GET admin/marketplace/users/:id; cpcllc-backend docs/blocking.md). Several
 * people blocking the same person is a signal worth a look.
 */
export interface StaffBlockSummary {
  blockedByCount: number;
  blockingCount: number;
  lastBlockedAt: string | null;
}

/** From this many blocks, the page suggests a look. */
export const BLOCKED_BY_NOTICE_AT = 3;

const people = (n: number) => (n === 1 ? "1 person" : `${n} people`);

const day = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

export function blockSummaryRows(summary: StaffBlockSummary | null | undefined): {
  blockedBy: string;
  blocking: string;
  notice: string | null;
} {
  const by = Math.max(0, summary?.blockedByCount ?? 0);
  const blocking = Math.max(0, summary?.blockingCount ?? 0);
  return {
    blockedBy:
      by === 0
        ? "Nobody"
        : summary?.lastBlockedAt
          ? `${people(by)} (last on ${day(summary.lastBlockedAt)})`
          : people(by),
    blocking: blocking === 0 ? "Nobody" : people(blocking),
    notice:
      by >= BLOCKED_BY_NOTICE_AT
        ? `Blocked by ${people(by)}. Worth a look at their posts, comments and reports.`
        : null,
  };
}
