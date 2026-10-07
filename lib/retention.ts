/**
 * Data retention on the admin page (screens/admin/views/RetentionView). Types
 * for admin/retention and the pure bits of the page, unit-tested. The rules
 * themselves live in the API (modules/retention/retention.policy.ts).
 */

export type RetentionKind =
  | "audit_log"
  | "booking"
  | "ticket"
  | "account_action"
  | "fraud_event"
  | "moderation_report"
  | "dispute"
  | "pro_purchase"
  | "estimate"
  | "invoice";

export type HoldKind = RetentionKind | "account";

export interface RetentionRule {
  kind: RetentionKind;
  label: string;
  years: number;
  from: string;
}

export interface KindCount {
  kind: RetentionKind;
  due: number;
  deleted: number;
  held: number;
  linked: number;
  failed: number;
}

export interface RetentionRun {
  _id: string;
  startedAt: string;
  finishedAt?: string;
  mode: "dry_run" | "apply";
  trigger: "schedule" | "admin" | "script";
  status: "running" | "done" | "failed";
  counts: KindCount[];
  error?: string;
  skipped?: boolean;
}

export interface RetentionOverview {
  mode: "dry_run" | "apply";
  schedule: string;
  rules: RetentionRule[];
  lastRun: RetentionRun | null;
}

export interface RetentionHold {
  _id: string;
  kind: HoldKind;
  recordId: string;
  reason: string;
  placedBy: string;
  createdAt: string;
  releasedAt?: string | null;
}

/** What a hold can cover, in the order the form lists them. */
export const HOLD_KIND_OPTIONS: { value: HoldKind; label: string }[] = [
  { value: "account", label: "An account (all its records)" },
  { value: "invoice", label: "Invoice" },
  { value: "estimate", label: "Estimate" },
  { value: "pro_purchase", label: "Pro purchase" },
  { value: "booking", label: "Booking" },
  { value: "ticket", label: "Support ticket" },
  { value: "dispute", label: "Dispute" },
  { value: "moderation_report", label: "Moderation report" },
  { value: "fraud_event", label: "Fraud event" },
  { value: "account_action", label: "Account action" },
  { value: "audit_log", label: "Audit log entry" },
];

export function holdKindLabel(kind: HoldKind): string {
  return HOLD_KIND_OPTIONS.find((o) => o.value === kind)?.label ?? kind;
}

/** "7 years" / "1 year" */
export function periodLabel(years: number): string {
  return `${years} year${years === 1 ? "" : "s"}`;
}

/** Totals across record types for one run. */
export function runTotals(run: Pick<RetentionRun, "counts"> | null | undefined) {
  const counts = run?.counts ?? [];
  const sum = (k: keyof Omit<KindCount, "kind">) =>
    counts.reduce((n, c) => n + (c[k] ?? 0), 0);
  return {
    due: sum("due"),
    deleted: sum("deleted"),
    held: sum("held"),
    linked: sum("linked"),
    failed: sum("failed"),
  };
}

/** One line for a run: what it did, in plain words. */
export function runSummary(run: RetentionRun): string {
  const t = runTotals(run);
  if (run.status === "running") return "Running…";
  if (run.status === "failed") return `Failed: ${run.error ?? "unknown error"}`;
  const did = run.mode === "apply" ? "deleted" : "would be deleted";
  const parts = [`${t.deleted} ${did}`];
  if (t.held) parts.push(`${t.held} on hold`);
  if (t.linked) parts.push(`${t.linked} kept with a linked record`);
  if (t.failed) parts.push(`${t.failed} failed`);
  return parts.join(" · ");
}

/** A Mongo id, as the hold form needs before sending. */
export function isRecordId(value: string): boolean {
  return /^[a-f0-9]{24}$/i.test(value.trim());
}
