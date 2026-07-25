"use client";

import { useState } from "react";
import { Star, RefreshCw, Check, X, Trash2, Flag } from "lucide-react";
import { KpiCard } from "@/components/admin/KpiCard";
import { StatusPill } from "@/components/admin/StatusPill";
import { useAdminReviewsView } from "@/hooks/admin/useAdminQueries";
import { moderateAdminReview } from "@/axios/admin";

const STATUS_FILTERS = [
  { key: "flagged", label: "Flagged" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "removed", label: "Removed" },
  { key: "all", label: "All" },
] as const;

function statusTone(
  s: string,
): "green" | "orange" | "rose" | "slate" {
  if (s === "approved") return "green";
  if (s === "pending") return "orange";
  if (s === "flagged" || s === "rejected") return "rose";
  return "slate";
}

/**
 * Review moderation (spec §12, §16). Providers can only report reviews, never
 * remove them — this is where the moderation team acts on those reports.
 * Defaults to the flagged queue. Approve clears the flag and puts the review
 * live; reject hides it from aggregates; remove soft-deletes it. Every action
 * recomputes the provider's reputation and is audit-logged server-side.
 */
export function ReviewModerationView() {
  const [status, setStatus] = useState<string>("flagged");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState<string | null>(null);

  const filter: Record<string, unknown> = { status, page, limit: 25 };
  if (search) filter.search = search;

  const { data, loading, refresh } = useAdminReviewsView(filter);
  const stats = data?.stats;
  const list = data?.page;
  const items = list?.data ?? [];
  const totalPages = list ? Math.ceil(list.total / list.limit) : 1;

  const act = async (
    id: string,
    action: "approve" | "reject" | "remove",
  ) => {
    setBusy(id);
    try {
      await moderateAdminReview(id, action);
      await refresh();
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 flex items-center justify-center">
            <Star size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Review Moderation
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Act on reported and held reviews
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard label="Flagged" value={stats?.flagged ?? "—"} tone="rose" />
        <KpiCard label="Pending" value={stats?.pending ?? "—"} tone="orange" />
        <KpiCard label="Verified" value={stats?.verified ?? "—"} tone="green" />
        <KpiCard label="Removed" value={stats?.removed ?? "—"} tone="slate" />
        <KpiCard label="Total" value={stats?.total ?? "—"} tone="blue" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Reviews ({list?.total ?? 0})
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              aria-label="Search reviews"
              placeholder="Search text…"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-md px-3 py-1.5 outline-none focus:border-blue-400"
            />
            <select
              aria-label="Filter by status"
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
              className="text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-md px-3 py-1.5"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {loading && items.length === 0 && (
            <p className="px-5 py-8 text-center text-slate-400 text-sm">
              Loading reviews…
            </p>
          )}
          {!loading && items.length === 0 && (
            <p className="px-5 py-8 text-center text-slate-400 text-sm">
              No reviews in this queue.
            </p>
          )}
          {items.map((r: any) => {
            const author = r.creator
              ? `${r.creator.firstName ?? ""} ${r.creator.lastName ?? ""}`.trim()
              : "Client";
            const openReports = (r.reports ?? []).filter(
              (rep: any) => rep.status !== "resolved",
            ).length;
            return (
              <div key={r._id} className="px-5 py-4 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {author}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-amber-500 text-xs">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        {r.rating}
                      </span>
                      <span className="text-xs text-slate-400">
                        → {r.providerId?.providerName ?? "provider"}
                      </span>
                      <StatusPill label={r.isDeleted ? "removed" : r.status} tone={statusTone(r.isDeleted ? "removed" : r.status)} />
                      {openReports > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-600">
                          <Flag size={11} /> {openReports}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      {r.description}
                    </p>
                    {(r.reports ?? []).length > 0 && (
                      <p className="text-[11px] text-slate-400 mt-1">
                        Reported for:{" "}
                        {[...new Set((r.reports ?? []).map((x: any) => x.reason))].join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => act(r._id, "approve")}
                      disabled={busy === r._id}
                      title="Approve"
                      className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100 disabled:opacity-40"
                    >
                      <Check size={15} />
                    </button>
                    <button
                      onClick={() => act(r._id, "reject")}
                      disabled={busy === r._id}
                      title="Reject (hide)"
                      className="p-1.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 hover:bg-amber-100 disabled:opacity-40"
                    >
                      <X size={15} />
                    </button>
                    <button
                      onClick={() => act(r._id, "remove")}
                      disabled={busy === r._id}
                      title="Remove"
                      className="p-1.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 disabled:opacity-40"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {list?.page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
