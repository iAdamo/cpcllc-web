"use client";

import { useState } from "react";
import { Activity, RefreshCw, ShieldCheck } from "lucide-react";
import { KpiCard } from "@/components/admin/KpiCard";
import { StatusPill } from "@/components/admin/StatusPill";
import { Drawer } from "@/components/admin/Drawer";
import {
  useAdminEngagementsView,
  useAdminEngagementDetail,
} from "@/hooks/admin/useAdminQueries";

const STAGES = [
  { key: "accepted", label: "Accepted" },
  { key: "in_progress", label: "In Progress" },
  { key: "awaiting_confirmation", label: "Awaiting Confirmation" },
  { key: "completed", label: "Completed" },
  { key: "disputed", label: "Disputed" },
  { key: "cancelled", label: "Cancelled" },
] as const;

function stageTone(
  stage: string,
): "green" | "blue" | "orange" | "rose" | "purple" | "slate" {
  switch (stage) {
    case "completed":
      return "green";
    case "in_progress":
      return "blue";
    case "awaiting_confirmation":
      return "orange";
    case "disputed":
      return "rose";
    case "accepted":
      return "purple";
    default:
      return "slate";
  }
}

function stageLabel(stage?: string) {
  return STAGES.find((s) => s.key === stage)?.label ?? stage ?? "—";
}

const fmtDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString() : "—";

/**
 * Service-lifecycle oversight (design §3 / §9, admin side). Every engagement
 * that has an assigned provider, grouped by its lifecycle stage, with a detail
 * drawer that shows the completion evidence + verified certificate. Read-only —
 * admins observe the workflow; disputes are actioned in the Disputes view.
 */
export function EngagementsView() {
  const [stage, setStage] = useState<string>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const filter: Record<string, unknown> = { page, limit: 25 };
  if (stage) filter.stage = stage;
  if (search) filter.search = search;

  const { data, loading, refresh } = useAdminEngagementsView(filter);
  const stats = data?.stats;
  const list = data?.page;
  const items = list?.data ?? [];
  const totalPages = list ? Math.ceil(list.total / list.limit) : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
            <Activity size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Service Lifecycle
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Live engagements from acceptance to verified completion
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

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <KpiCard label="In Progress" value={stats?.in_progress ?? "—"} tone="blue" />
        <KpiCard label="Awaiting" value={stats?.awaiting_confirmation ?? "—"} tone="orange" />
        <KpiCard label="Disputed" value={stats?.disputed ?? "—"} tone="rose" />
        <KpiCard label="Completed" value={stats?.completed ?? "—"} tone="green" />
        <KpiCard label="Certificates" value={stats?.certificates ?? "—"} tone="purple" />
        <KpiCard label="Total" value={stats?.total ?? "—"} tone="blue" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Engagements ({list?.total ?? 0})
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              aria-label="Search engagements"
              placeholder="Search…"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-md px-3 py-1.5 outline-none focus:border-blue-400"
            />
            <select
              aria-label="Filter by stage"
              value={stage}
              onChange={(e) => {
                setPage(1);
                setStage(e.target.value);
              }}
              className="text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-md px-3 py-1.5"
            >
              <option value="">All stages</option>
              {STAGES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-5 py-2.5 font-medium">Task</th>
                <th className="px-5 py-2.5 font-medium">Client</th>
                <th className="px-5 py-2.5 font-medium">Provider</th>
                <th className="px-5 py-2.5 font-medium">Stage</th>
                <th className="px-5 py-2.5 font-medium">Marked</th>
                <th className="px-5 py-2.5 font-medium">Auto-confirm</th>
                <th className="px-5 py-2.5 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading && items.length === 0 && (
                <tr>
                  <td className="px-5 py-8 text-center text-slate-400" colSpan={7}>
                    Loading engagements…
                  </td>
                </tr>
              )}
              {!loading && items.length === 0 && (
                <tr>
                  <td className="px-5 py-8 text-center text-slate-400" colSpan={7}>
                    No engagements found.
                  </td>
                </tr>
              )}
              {items.map((t: any) => (
                <tr key={t._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-5 py-2.5 font-medium text-slate-900 dark:text-white max-w-[240px] truncate">
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
                  <td className="px-5 py-2.5">
                    <StatusPill
                      label={stageLabel(t.lifecycle?.stage)}
                      tone={stageTone(t.lifecycle?.stage)}
                    />
                  </td>
                  <td className="px-5 py-2.5 text-slate-500 text-xs">
                    {fmtDate(t.lifecycle?.markedCompleteAt)}
                  </td>
                  <td className="px-5 py-2.5 text-slate-500 text-xs">
                    {fmtDate(t.lifecycle?.autoConfirmAt)}
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

      <EngagementDrawer id={openId} onClose={() => setOpenId(null)} />
    </div>
  );
}

function EngagementDrawer({
  id,
  onClose,
}: {
  id: string | null;
  onClose: () => void;
}) {
  const { data, loading } = useAdminEngagementDetail(id);
  const task = data?.task;
  const lc = task?.lifecycle;
  const cert = data?.certificate;

  return (
    <Drawer
      open={!!id}
      onClose={onClose}
      title={task?.title || (loading ? "Loading…" : "Engagement")}
      subtitle={lc ? `Stage: ${stageLabel(lc.stage)}` : undefined}
    >
      {loading && <p className="text-sm text-slate-500">Loading…</p>}
      {task && (
        <div className="space-y-4 text-sm">
          <Row label="Client" value={
            task.userId
              ? `${task.userId.firstName ?? ""} ${task.userId.lastName ?? ""}`.trim()
              : "—"
          } />
          <Row label="Provider" value={task.providerId?.providerName ?? "—"} />
          <Row label="Stage" value={stageLabel(lc?.stage)} />
          <Row label="Started" value={fmtDate(lc?.startedAt)} />
          <Row label="Expected" value={fmtDate(lc?.expectedCompletionAt)} />
          <Row label="Marked complete" value={fmtDate(lc?.markedCompleteAt)} />
          <Row label="Auto-confirm at" value={fmtDate(lc?.autoConfirmAt)} />
          <Row label="Confirmed" value={fmtDate(lc?.confirmedAt)} />
          {lc?.confirmationMethod && (
            <Row label="Method" value={lc.confirmationMethod.replace("_", " ")} />
          )}

          {lc?.completion?.notes && (
            <div className="py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 block text-xs mb-1">
                Completion notes
              </span>
              <span className="text-slate-900 dark:text-white">
                {lc.completion.notes}
              </span>
            </div>
          )}

          {lc?.issue && (
            <div className="mt-2 p-3 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                Reported issue ({lc.issue.status})
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
                {lc.issue.reason}
              </p>
            </div>
          )}

          {cert && (
            <div className="mt-4 p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <ShieldCheck size={14} /> {cert.certificateNumber}
              </p>
              <p className="text-xs text-emerald-800 dark:text-emerald-200 mt-1">
                {cert.completionMethod?.replace("_", " ")} ·{" "}
                {fmtDate(cert.actualCompletionAt)}
              </p>
              <p className="text-[11px] text-emerald-700/80 mt-0.5">
                {cert.reviewId ? "Reviewed" : "Not yet reviewed"}
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
      <span className="text-slate-900 dark:text-white text-right break-all">
        {String(value)}
      </span>
    </div>
  );
}
