"use client";

import { useState } from "react";
import { ClipboardList, Archive, RotateCcw, RefreshCw } from "lucide-react";
import { KpiCard } from "@/components/admin/KpiCard";
import { StatusPill } from "@/components/admin/StatusPill";
import { Drawer } from "@/components/admin/Drawer";
import { archiveAdminJob, restoreAdminJob } from "@/axios/admin";
import {
  useAdminJobsView,
  useAdminJobDetail,
} from "@/hooks/admin/useAdminQueries";
import {
  JOB_STATUSES,
  PRICING_LABELS,
  STATUS_TONES,
  budgetText,
  canRestore,
  canTakeDown,
  engagedCount,
  neededByText,
  statusLabel,
  type JobStatus,
} from "@/lib/jobs";
import { notify } from "@/lib/notify";

const CANCELLED_BY: Record<string, string> = {
  client: "The client",
  provider: "The business",
  staff: "Staff (taken down)",
};

export function JobsView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const filter: Record<string, unknown> = { page, limit: 25 };
  if (search) filter.search = search;
  if (status) filter.status = status;

  const { data, loading, refresh } = useAdminJobsView(filter);

  const stats = data?.stats;
  const list = data?.page;
  const items: any[] = list?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300 flex items-center justify-center">
            <ClipboardList size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Jobs</h2>
            <p className="text-sm text-slate-500 mt-0.5">All job posts across the marketplace</p>
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

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <KpiCard label="Total" value={stats?.total ?? "—"} tone="blue" />
        <KpiCard label="Open" value={stats?.byStatus?.open ?? "—"} tone="green" />
        <KpiCard
          label="In progress"
          value={stats?.byStatus ? engagedCount(stats.byStatus) : "—"}
          tone="orange"
        />
        <KpiCard label="Completed" value={stats?.byStatus?.completed ?? "—"} tone="purple" />
        <KpiCard label="Drafts" value={stats?.byStatus?.draft ?? "—"} tone="rose" />
        <KpiCard label="New (30d)" value={stats?.newLast30Days ?? "—"} tone="blue" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Jobs ({list?.total ?? 0})
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              aria-label="Search jobs"
              placeholder="Search jobs…"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-md px-3 py-1.5 outline-none focus:border-brand-400"
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
              <option value="">All statuses</option>
              {JOB_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {statusLabel(s)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="px-5 py-2.5 font-medium">Title</th>
              <th className="px-5 py-2.5 font-medium">Client</th>
              <th className="px-5 py-2.5 font-medium">Provider</th>
              <th className="px-5 py-2.5 font-medium">Category</th>
              <th className="px-5 py-2.5 font-medium">Budget</th>
              <th className="px-5 py-2.5 font-medium">Status</th>
              <th className="px-5 py-2.5 font-medium">Created</th>
              <th className="px-5 py-2.5 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading && items.length === 0 && (
              <tr>
                <td className="px-5 py-8 text-center text-slate-400" colSpan={8}>
                  Loading jobs…
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td className="px-5 py-8 text-center text-slate-400" colSpan={8}>
                  No jobs found.
                </td>
              </tr>
            )}
            {items.map((t) => (
              <tr key={t._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-5 py-2.5 font-medium text-slate-900 dark:text-white max-w-[280px] truncate">
                  {t.title}
                </td>
                <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">
                  {t.userId
                    ? `${t.userId.firstName ?? ""} ${t.userId.lastName ?? ""}`.trim()
                    : "—"}
                </td>
                <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">
                  {t.providerId?.providerName ?? "—"}
                </td>
                <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">
                  {t.subcategoryId?.name ?? "—"}
                </td>
                <td className="px-5 py-2.5 text-slate-900 dark:text-white">
                  {budgetText(t)}
                </td>
                <td className="px-5 py-2.5">
                  <StatusPill
                    label={statusLabel(t.status)}
                    tone={STATUS_TONES[t.status as JobStatus] ?? "slate"}
                  />
                </td>
                <td className="px-5 py-2.5 text-slate-500 text-xs">
                  {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-5 py-2.5 text-right">
                  <button
                    onClick={() => setOpenId(t._id)}
                    className="text-xs text-brand-600 dark:text-brand-300 font-medium hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {list?.totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {list.page} of {list.totalPages}
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
                disabled={page >= list.totalPages}
                className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <JobDetailDrawer
        id={openId}
        onClose={() => setOpenId(null)}
        onMutated={() => void refresh()}
      />
    </div>
  );
}

function JobDetailDrawer({
  id,
  onClose,
  onMutated,
}: {
  id: string | null;
  onClose: () => void;
  onMutated: () => void;
}) {
  const { data: t, loading, refresh: refetch } = useAdminJobDetail(id);

  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<unknown>, done: string) => {
    setBusy(true);
    try {
      await fn();
      notify.success(done);
    } catch (err) {
      // e.g. a business was hired meanwhile: the API says to open a dispute.
      notify.error(err, { module: "admin", feature: "job-takedown" });
    } finally {
      setBusy(false);
    }
    await refetch();
    onMutated();
  };

  return (
    <Drawer
      open={!!id}
      onClose={onClose}
      title={t?.title || (loading ? "Loading…" : "Job")}
      subtitle={t ? `Status: ${statusLabel(t.status)}` : undefined}
      footer={
        t && (
          <div className="flex flex-wrap items-center gap-2">
            {canTakeDown(t) ? (
              <button
                onClick={() => run(() => archiveAdminJob(id!), "Job taken down.")}
                disabled={busy}
                className="text-xs px-3 py-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 flex items-center gap-1"
              >
                <Archive size={14} /> Take down
              </button>
            ) : canRestore(t) ? (
              <button
                onClick={() => run(() => restoreAdminJob(id!), "Job restored.")}
                disabled={busy}
                className="text-xs px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1"
              >
                <RotateCcw size={14} /> Restore
              </button>
            ) : t.providerId ? (
              <span className="text-xs text-slate-500">
                A business is hired. Open a dispute to act on this job.
              </span>
            ) : null}
          </div>
        )
      }
    >
      {loading && <p className="text-sm text-slate-500">Loading…</p>}
      {t && (
        <div className="space-y-4 text-sm">
          <Row label="ID" value={t._id} />
          <div className="py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 block text-xs mb-1">Description</span>
            <span className="text-slate-900 dark:text-white">{t.description}</span>
          </div>
          <Row label="Budget" value={budgetText(t)} />
          <Row label="Pricing" value={PRICING_LABELS[t.pricing ?? "fixed"] ?? "—"} />
          <Row label="Status" value={statusLabel(t.status)} />
          {t.lifecycle?.cancelledBy ? (
            <Row label="Cancelled by" value={CANCELLED_BY[t.lifecycle.cancelledBy] ?? t.lifecycle.cancelledBy} />
          ) : null}
          <Row label="Needed by" value={neededByText(t.neededBy)} />
          <Row
            label="Who can see it"
            value={t.visibility === "Verified_Only" ? "Verified businesses only" : "Everyone"}
          />
          <Row label="Category" value={t.subcategoryId?.name ?? "—"} />
          <Row label="Created" value={t.createdAt ? new Date(t.createdAt).toLocaleString() : "—"} />
          <Row
            label="Published"
            value={t.publishedAt ? new Date(t.publishedAt).toLocaleString() : "Not yet"}
          />
          {t.userId && (
            <div className="mt-4 p-3 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">Client</p>
              <p className="text-xs text-slate-500 mt-1">
                {t.userId.firstName} {t.userId.lastName} — {t.userId.email}
              </p>
              <p className="text-[11px] text-slate-400">{t.userId.phoneNumber}</p>
            </div>
          )}
          {t.providerId && (
            <div className="mt-4 p-3 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">Provider</p>
              <p className="text-xs text-slate-500 mt-1">
                {t.providerId.providerName} — {t.providerId.providerEmail ?? "—"}
              </p>
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between gap-3 py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-900 dark:text-white text-right break-all">{String(value)}</span>
    </div>
  );
}
