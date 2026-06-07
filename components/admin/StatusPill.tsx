"use client";

interface StatusPillProps {
  label: string;
  tone?: "blue" | "green" | "yellow" | "rose" | "slate" | "purple" | "orange";
}

const toneMap: Record<NonNullable<StatusPillProps["tone"]>, string> = {
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  yellow: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  rose: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  purple: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
  orange: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
};

export function StatusPill({ label, tone = "slate" }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${toneMap[tone]}`}
    >
      {label}
    </span>
  );
}

export function statusToTone(status?: string): StatusPillProps["tone"] {
  if (!status) return "slate";
  const s = status.toLowerCase();
  if (["active", "open", "online", "healthy", "approved", "verified"].includes(s)) return "blue";
  if (["completed", "resolved", "success", "paid"].includes(s)) return "green";
  if (["pending", "in_progress", "in progress", "waiting", "trialing"].includes(s)) return "yellow";
  if (["cancelled", "rejected", "failed", "disputed", "banned", "past_due"].includes(s))
    return "rose";
  if (["featured", "premium", "escalated", "critical"].includes(s)) return "purple";
  if (["urgent", "high"].includes(s)) return "orange";
  return "slate";
}
