"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { listFraudEvents, getFraudStats, getHighRiskUsers } from "@/axios/admin";
import { KpiCard } from "@/components/admin/KpiCard";
import { StatusPill } from "@/components/admin/StatusPill";

export function FraudView() {
  const [stats, setStats] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [highRisk, setHighRisk] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [s, e, hr] = await Promise.allSettled([
        getFraudStats(),
        listFraudEvents(),
        getHighRiskUsers(10),
      ]);
      if (s.status === "fulfilled") setStats(s.value);
      if (e.status === "fulfilled") setEvents((e.value as any).items ?? []);
      if (hr.status === "fulfilled") setHighRisk(hr.value as any[]);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-300 flex items-center justify-center">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Fraud Detection Center</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Risk scores, suspicious activity, and account safety signals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Open Alerts" value={stats?.openAlerts ?? "—"} tone="orange" />
        <KpiCard label="High Risk Users" value={stats?.highRisk ?? "—"} tone="rose" />
        <KpiCard label="Critical Risk" value={stats?.criticalRisk ?? "—"} tone="rose" />
        <KpiCard label="Events (24h)" value={stats?.last24h ?? "—"} tone="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Events</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {events.length === 0 && (
              <p className="px-5 py-8 text-center text-slate-400 text-sm">No events yet.</p>
            )}
            {events.slice(0, 8).map((e: any) => (
              <div key={e._id} className="px-5 py-3 flex items-center gap-3">
                <StatusPill label={e.type?.replace(/_/g, " ")} tone="orange" />
                <div className="flex-1">
                  <p className="text-sm text-slate-900 dark:text-white">{e.description}</p>
                  <p className="text-xs text-slate-500">
                    Score {e.score} • {new Date(e.createdAt).toLocaleString()}
                  </p>
                </div>
                <StatusPill label={e.status} tone="slate" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              High-risk users
            </h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {highRisk.length === 0 && (
              <p className="px-5 py-8 text-center text-slate-400 text-sm">No high-risk accounts.</p>
            )}
            {highRisk.map((r: any) => (
              <div key={r._id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center justify-center">
                  {(r.user?.firstName?.[0] ?? "?") + (r.user?.lastName?.[0] ?? "")}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900 dark:text-white">
                    {r.user?.firstName} {r.user?.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{r.user?.email}</p>
                </div>
                <StatusPill label={`${r.riskScore} • ${r.riskLevel}`} tone="rose" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
