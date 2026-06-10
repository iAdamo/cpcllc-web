"use client";

import { useState } from "react";
import { ClipboardList, Archive, RotateCcw, RefreshCw } from "lucide-react";
import { KpiCard } from "@/components/admin/KpiCard";
import { StatusPill, statusToTone } from "@/components/admin/StatusPill";
import { Drawer } from "@/components/admin/Drawer";
import {
  archiveAdminTask,
  restoreAdminTask,
  setAdminTaskStatus,
} from "@/axios/admin";
import {
  useAdminTasksView,
  useAdminTaskDetail,
} from "@/hooks/admin/useAdminQueries";

const STATUS_OPTIONS = ["Active", "In_progress", "Completed", "Cancelled", "Expired"] as const;

export function TasksView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const filter: Record<string, unknown> = { page, limit: 25 };
  if (search) filter.search = search;
  if (status) filter.status = status;

  const { data, loading, refresh } = useAdminTasksView(filter);

  const stats = data?.stats;
  const list = data?.page;
  const items: any[] = list?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 flex items-center justify-center">
            <ClipboardList size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Tasks</h2>
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
        <KpiCard label="Active" value={stats?.byStatus?.active ?? "—"} tone="green" />
        <KpiCard label="In Progress" value={stats?.byStatus?.inProgress ?? "—"} tone="orange" />
        <KpiCard label="Completed" value={stats?.byStatus?.completed ?? "—"} tone="purple" />
        <KpiCard label="Cancelled" value={stats?.byStatus?.cancelled ?? "—"} tone="rose" />
        <KpiCard label="New (30d)" value={stats?.newLast30Days ?? "—"} tone="blue" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Tasks ({list?.total ?? 0})
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              aria-label="Search tasks"
              placeholder="Search tasks…"
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
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
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
                  Loading tasks…
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td className="px-5 py-8 text-center text-slate-400" colSpan={8}>
                  No tasks found.
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
                  ${t.budget?.toLocaleString?.() ?? "—"}
                </td>
                <td className="px-5 py-2.5">
                  <StatusPill label={t.status} tone={statusToTone(t.status)} />
                </td>
                <td className="px-5 py-2.5 text-slate-500 text-xs">
                  {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-5 py-2.5 text-right">
                  <button
                    onClick={() => setOpenId(t._id)}
                    className="text-xs text-blue-600 dark:text-blue-300 font-medium hover:underline"
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

      <TaskDetailDrawer
        id={openId}
        onClose={() => setOpenId(null)}
        onMutated={() => void refresh()}
      />
    </div>
  );
}

function TaskDetailDrawer({
  id,
  onClose,
  onMutated,
}: {
  id: string | null;
  onClose: () => void;
  onMutated: () => void;
}) {
  const { data: t, loading, refresh: refetch } = useAdminTaskDetail(id);

  const run = async (fn: () => Promise<unknown>) => {
    await fn();
    await refetch();
    onMutated();
  };

  return (
    <Drawer
      open={!!id}
      onClose={onClose}
      title={t?.title || (loading ? "Loading…" : "Task")}
      subtitle={t ? `Status: ${t.status}` : undefined}
      footer={
        t && (
          <div className="flex flex-wrap gap-2">
            <select
              aria-label="Change task status"
              value={t.status}
              onChange={(e) =>
                run(() => setAdminTaskStatus(id!, e.target.value))
              }
              className="text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-md px-2 py-1.5"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
            {t.isActive ? (
              <button
                onClick={() => run(() => archiveAdminTask(id!))}
                className="text-xs px-3 py-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-700 flex items-center gap-1"
              >
                <Archive size={14} /> Archive
              </button>
            ) : (
              <button
                onClick={() => run(() => restoreAdminTask(id!))}
                className="text-xs px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1"
              >
                <RotateCcw size={14} /> Restore
              </button>
            )}
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
          <Row label="Budget" value={`$${t.budget?.toLocaleString?.() ?? "—"}`} />
          <Row label="Negotiable" value={t.negotiable ? "Yes" : "No"} />
          <Row label="Status" value={t.status} />
          <Row label="Urgency" value={t.urgency ?? "—"} />
          <Row label="Visibility" value={t.visibility ?? "—"} />
          <Row label="Anonymous" value={t.anonymous ? "Yes" : "No"} />
          <Row label="Active" value={t.isActive ? "Yes" : "No (archived)"} />
          <Row
            label="Deadline"
            value={t.deadline ? new Date(t.deadline).toLocaleDateString() : "—"}
          />
          <Row label="Category" value={t.subcategoryId?.name ?? "—"} />
          {t.tags?.length > 0 && (
            <Row label="Tags" value={t.tags.join(", ")} />
          )}
          <Row label="Created" value={t.createdAt ? new Date(t.createdAt).toLocaleString() : "—"} />
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
