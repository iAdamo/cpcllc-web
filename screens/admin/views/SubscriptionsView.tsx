"use client";

import { useEffect, useState } from "react";
import { Receipt } from "lucide-react";
import {
  getSubscriptionStats,
  listSubscriptionPlans,
  listSubscriptions,
} from "@/axios/admin";
import { KpiCard } from "@/components/admin/KpiCard";
import { StatusPill, statusToTone } from "@/components/admin/StatusPill";

export function SubscriptionsView() {
  const [stats, setStats] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [s, p, l] = await Promise.allSettled([
        getSubscriptionStats(),
        listSubscriptionPlans(),
        listSubscriptions(),
      ]);
      if (s.status === "fulfilled") setStats(s.value);
      if (p.status === "fulfilled") setPlans(p.value as any[]);
      if (l.status === "fulfilled") setSubs((l.value as any).items ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 flex items-center justify-center">
          <Receipt size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Subscriptions</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            The only payments tracked on-platform — manage plans and renewals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Active" value={stats?.active ?? "—"} tone="green" />
        <KpiCard label="Trialing" value={stats?.trialing ?? "—"} tone="blue" />
        <KpiCard label="Past Due" value={stats?.pastDue ?? "—"} tone="orange" />
        <KpiCard
          label="MRR"
          value={stats?.mrrCents ? `₦${(stats.mrrCents / 100).toLocaleString()}` : "—"}
          tone="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Plans</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {plans.length === 0 && (
              <p className="px-5 py-8 text-center text-slate-400 text-sm">No plans defined yet.</p>
            )}
            {plans.map((p: any) => (
              <div key={p._id} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{p.name}</p>
                  <StatusPill
                    label={p.isActive ? "active" : "inactive"}
                    tone={p.isActive ? "green" : "slate"}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {p.currency} {(p.priceCents / 100).toLocaleString()} / {p.interval}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden lg:col-span-2">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Subscribers</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-5 py-2.5 font-medium">User</th>
                <th className="px-5 py-2.5 font-medium">Plan</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
                <th className="px-5 py-2.5 font-medium">Renews</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-slate-400">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && subs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-slate-400">
                    No active subscriptions.
                  </td>
                </tr>
              )}
              {subs.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-5 py-2.5 text-slate-700 dark:text-slate-200">
                    {s.user?.firstName} {s.user?.lastName}
                  </td>
                  <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">
                    {s.plan?.name ?? "—"}
                  </td>
                  <td className="px-5 py-2.5">
                    <StatusPill label={s.status} tone={statusToTone(s.status)} />
                  </td>
                  <td className="px-5 py-2.5 text-xs text-slate-500">
                    {s.currentPeriodEnd
                      ? new Date(s.currentPeriodEnd).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
