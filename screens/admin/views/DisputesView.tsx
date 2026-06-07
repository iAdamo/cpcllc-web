"use client";

import { useEffect, useState } from "react";
import { AlertOctagon } from "lucide-react";
import { listDisputes, getDisputeStats } from "@/axios/admin";
import { KpiCard } from "@/components/admin/KpiCard";
import { StatusPill, statusToTone } from "@/components/admin/StatusPill";

export function DisputesView() {
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [r, s] = await Promise.allSettled([listDisputes(), getDisputeStats()]);
      if (r.status === "fulfilled") setItems((r.value as any).items ?? []);
      if (s.status === "fulfilled") setStats(s.value);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 flex items-center justify-center">
          <AlertOctagon size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Dispute Resolution Center</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Review evidence, manage decisions, and resolve disputes between clients and providers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard label="Open" value={stats?.open ?? "—"} tone="blue" />
        <KpiCard label="Under Review" value={stats?.underReview ?? "—"} tone="orange" />
        <KpiCard label="Awaiting Evidence" value={stats?.awaitingEvidence ?? "—"} tone="indigo" />
        <KpiCard label="Escalated" value={stats?.escalated ?? "—"} tone="rose" />
        <KpiCard label="Resolved" value={stats?.resolved ?? "—"} tone="green" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="px-5 py-3 font-medium">Dispute</th>
              <th className="px-5 py-3 font-medium">Raised By</th>
              <th className="px-5 py-3 font-medium">Respondent</th>
              <th className="px-5 py-3 font-medium">Reason</th>
              <th className="px-5 py-3 font-medium">Priority</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                  No disputes recorded yet.
                </td>
              </tr>
            )}
            {items.map((d) => (
              <tr key={d._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-5 py-2.5 font-medium text-slate-900 dark:text-white">
                  {d.disputeNumber}
                </td>
                <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">
                  {d.raisedBy?.firstName} {d.raisedBy?.lastName}
                </td>
                <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">
                  {d.respondent?.firstName} {d.respondent?.lastName}
                </td>
                <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">
                  {d.reason?.replace(/_/g, " ")}
                </td>
                <td className="px-5 py-2.5">
                  <StatusPill label={d.priority} tone={statusToTone(d.priority)} />
                </td>
                <td className="px-5 py-2.5">
                  <StatusPill label={d.status} tone={statusToTone(d.status)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
