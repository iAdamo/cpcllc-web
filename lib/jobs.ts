/**
 * Jobs on the website (admin Jobs and Job progress, the public /j page): the
 * one job status (cpcllc-backend jobs/job-states.ts), money and dates.
 */
export type JobStatus =
  | "draft"
  | "open"
  | "expired"
  | "hired"
  | "in_progress"
  | "awaiting_confirmation"
  | "completed"
  | "disputed"
  | "cancelled";

export const JOB_STATUSES: JobStatus[] = [
  "draft",
  "open",
  "expired",
  "hired",
  "in_progress",
  "awaiting_confirmation",
  "completed",
  "disputed",
  "cancelled",
];

/** After the hire: the Job progress view lists these. */
export const ENGAGED_STATUSES: JobStatus[] = [
  "hired",
  "in_progress",
  "awaiting_confirmation",
  "completed",
  "disputed",
  "cancelled",
];

export const STATUS_LABELS: Record<JobStatus, string> = {
  draft: "Draft",
  open: "Open",
  expired: "Expired",
  hired: "Hired",
  in_progress: "In progress",
  awaiting_confirmation: "Awaiting confirmation",
  completed: "Completed",
  disputed: "Problem reported",
  cancelled: "Cancelled",
};

export const STATUS_TONES: Record<JobStatus, "slate" | "blue" | "yellow" | "green" | "rose" | "orange" | "purple"> = {
  draft: "slate",
  open: "blue",
  expired: "slate",
  hired: "purple",
  in_progress: "yellow",
  awaiting_confirmation: "orange",
  completed: "green",
  disputed: "rose",
  cancelled: "slate",
};

/** Chart fills (the admin dashboard's status donut), one per status. */
export const STATUS_CHART_COLORS: Record<JobStatus, string> = {
  draft: "#94A3B8",
  open: "#3B82F6",
  expired: "#64748B",
  hired: "#8B5CF6",
  in_progress: "#EAB308",
  awaiting_confirmation: "#F97316",
  completed: "#10B981",
  disputed: "#EF4444",
  cancelled: "#CBD5E1",
};

export const statusLabel =(s: string | undefined) =>
  (s && STATUS_LABELS[s as JobStatus]) || s || "—";

export const PRICING_LABELS: Record<string, string> = {
  fixed: "Fixed price",
  offers: "Open to offers",
  estimates: "Estimates requested",
};

/** "$1,250", "₦50,000", or what the client asked for when there's no amount. */
export function budgetText(job: { budget?: number | null; currency?: string | null; pricing?: string | null }): string {
  if (typeof job.budget === "number" && job.budget > 0) {
    const symbol = job.currency === "NGN" ? "₦" : "$";
    return `${symbol}${job.budget.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  }
  return job.pricing === "estimates" ? PRICING_LABELS.estimates : "—";
}

/** "Sun, Oct 11, 2026" for a calendar day, the same in every time zone. */
export function neededByText(day: string | null | undefined): string {
  if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return "—";
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Jobs a business is working on now (hired, started, awaiting the client, problem reported). */
export function engagedCount(byStatus: Partial<Record<JobStatus, number>>): number {
  return (["hired", "in_progress", "awaiting_confirmation", "disputed"] as JobStatus[]).reduce(
    (n, s) => n + (byStatus[s] ?? 0),
    0,
  );
}

/** Staff take down a job nobody is hired for; an engaged one goes to a dispute. */
export const canTakeDown = (job: { status?: string; providerId?: unknown }) =>
  !job.providerId && (job.status === "draft" || job.status === "open" || job.status === "expired");

/** Only a job staff took down comes back. */
export const canRestore = (job: {
  status?: string;
  providerId?: unknown;
  lifecycle?: { cancelledBy?: string } | null;
}) => job.status === "cancelled" && !job.providerId && job.lifecycle?.cancelledBy === "staff";
