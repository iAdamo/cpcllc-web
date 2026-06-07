"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { listModerationReports, getModerationStats } from "@/axios/admin";
import { KpiCard } from "@/components/admin/KpiCard";
import { StatusPill, statusToTone } from "@/components/admin/StatusPill";

export function ModerationView() {
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const [s, l] = await Promise.allSettled([getModerationStats(), listModerationReports()]);
      if (s.status === "fulfilled") setStats(s.value);
      if (l.status === "fulfilled") setItems((l.value as any).items ?? []);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 flex items-center justify-center">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Moderation</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Review flagged content, auto-moderation hits and policy violations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard label="Queued" value={stats?.queued ?? "—"} tone="blue" />
        <KpiCard label="Reviewing" value={stats?.reviewing ?? "—"} tone="orange" />
        <KpiCard label="Actioned" value={stats?.actioned ?? "—"} tone="green" />
        <KpiCard label="Dismissed" value={stats?.dismissed ?? "—"} tone="slate" />
        <KpiCard label="Escalated" value={stats?.escalated ?? "—"} tone="rose" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="px-5 py-3 font-medium">Target</th>
              <th className="px-5 py-3 font-medium">Reason</th>
              <th className="px-5 py-3 font-medium">Reporter</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                  No reports yet.
                </td>
              </tr>
            )}
            {items.map((r: any) => (
              <tr key={r._id}>
                <td className="px-5 py-2.5 text-slate-700 dark:text-slate-200">
                  {r.targetType} <span className="text-xs text-slate-400">#{r.targetId.slice(-6)}</span>
                </td>
                <td className="px-5 py-2.5">{r.reason}</td>
                <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">
                  {r.reportedBy ? `${r.reportedBy.firstName} ${r.reportedBy.lastName}` : "Auto"}
                </td>
                <td className="px-5 py-2.5">
                  <StatusPill label={r.status} tone={statusToTone(r.status)} />
                </td>
                <td className="px-5 py-2.5 text-xs text-slate-500">
                  {new Date(r.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
