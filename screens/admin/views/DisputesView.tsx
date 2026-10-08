"use client";

import { useState } from "react";
import { AlertOctagon } from "lucide-react";
import { KpiCard } from "@/components/admin/KpiCard";
import { StatusPill, statusToTone } from "@/components/admin/StatusPill";
import { CaseDrawer } from "@/components/admin/disputes/CaseDrawer";
import { useAdminDisputeStats, useAdminDisputesView } from "@/hooks/admin/useAdminQueries";
import { caseStatusLabel, disputeReasonLabel, personName } from "@/lib/disputeCase";

const FILTERS = [
  { value: "", label: "All" },
  { value: "open", label: "Open" },
  { value: "under_review", label: "Under review" },
  { value: "awaiting_evidence", label: "Awaiting evidence" },
  { value: "escalated", label: "Escalated" },
  { value: "resolved", label: "Decided" },
];

/**
 * Dispute cases between a client and a business. Cases are opened from a
 * disputed job (Job progress) or a support ticket; each opens here to
 * message both people, record evidence and decide.
 */
export function DisputesView() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const filter: Record<string, unknown> = { page, limit: 25, ...(status ? { status } : {}) };
  const { data, loading } = useAdminDisputesView(filter);
  const { data: stats } = useAdminDisputeStats();
  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 flex items-center justify-center">
          <AlertOctagon size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Dispute Resolution Center</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Open a case from a disputed job or a support ticket, hear both sides, and decide.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard label="Open" value={stats?.open ?? "—"} tone="blue" />
        <KpiCard label="Under Review" value={stats?.underReview ?? "—"} tone="orange" />
        <KpiCard label="Awaiting Evidence" value={stats?.awaiting ?? "—"} tone="indigo" />
        <KpiCard label="Escalated" value={stats?.escalated ?? "—"} tone="rose" />
        <KpiCard label="Decided" value={stats?.resolved ?? "—"} tone="green" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5" role="group" aria-label="Filter cases by status">
          {FILTERS.map((f) => (
            <button
              key={f.value || "all"}
              type="button"
              aria-pressed={status === f.value}
              onClick={() => {
                setPage(1);
                setStatus(f.value);
              }}
              className={`text-xs px-2.5 py-1 rounded-full ${
                status === f.value
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-5 py-3 font-medium">Case</th>
                <th className="px-5 py-3 font-medium">Raised by</th>
                <th className="px-5 py-3 font-medium">Other side</th>
                <th className="px-5 py-3 font-medium">Reason</th>
                <th className="px-5 py-3 font-medium">Priority</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading && items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    {status
                      ? "No cases with this status."
                      : "No cases yet. Open one from a disputed job in Job progress or from a support ticket."}
                  </td>
                </tr>
              )}
              {items.map((d: any) => (
                <tr key={d._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-5 py-2.5 font-medium text-slate-900 dark:text-white">
                    {d.disputeNumber}
                    {d.job?.title && (
                      <span className="block text-xs font-normal text-slate-500 max-w-[220px] truncate">
                        {d.job.title}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">{personName(d.raisedBy)}</td>
                  <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">{personName(d.respondent)}</td>
                  <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">{disputeReasonLabel(d.reason)}</td>
                  <td className="px-5 py-2.5">
                    <StatusPill label={d.priority} tone={statusToTone(d.priority)} />
                  </td>
                  <td className="px-5 py-2.5">
                    <StatusPill label={caseStatusLabel(d.status)} tone={statusToTone(d.status)} />
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => setOpenId(d._id)}
                      aria-label={`Open case ${d.disputeNumber}`}
                      className="text-xs text-brand-600 dark:text-brand-300 font-medium hover:underline"
                    >
                      Open
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
              Page {page} of {totalPages}
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

      <CaseDrawer caseId={openId} onClose={() => setOpenId(null)} />
    </div>
  );
}
