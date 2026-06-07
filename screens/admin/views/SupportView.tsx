"use client";

import { useEffect, useState } from "react";
import { LifeBuoy } from "lucide-react";
import { listTickets, getTicketStats } from "@/axios/admin";
import { KpiCard } from "@/components/admin/KpiCard";
import { StatusPill, statusToTone } from "@/components/admin/StatusPill";

export function SupportView() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [list, s] = await Promise.allSettled([listTickets(), getTicketStats()]);
        if (!mounted) return;
        if (list.status === "fulfilled") setTickets((list.value as any).items ?? []);
        if (s.status === "fulfilled") setStats(s.value);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 flex items-center justify-center">
          <LifeBuoy size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Support Center</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage customer support tickets and conversations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Open Tickets" value={stats?.openTickets ?? "—"} tone="blue" />
        <KpiCard label="Waiting User" value={stats?.waitingUser ?? "—"} tone="orange" />
        <KpiCard label="Escalated" value={stats?.escalated ?? "—"} tone="rose" />
        <KpiCard
          label="Avg First Response"
          value={
            stats?.avgFirstResponseMinutes
              ? `${stats.avgFirstResponseMinutes}m`
              : "—"
          }
          tone="purple"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Tickets</h3>
          <button className="text-xs px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700">
            New Ticket
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="px-5 py-2.5 font-medium">Ticket</th>
              <th className="px-5 py-2.5 font-medium">Subject</th>
              <th className="px-5 py-2.5 font-medium">Requester</th>
              <th className="px-5 py-2.5 font-medium">Priority</th>
              <th className="px-5 py-2.5 font-medium">Status</th>
              <th className="px-5 py-2.5 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                  Loading tickets…
                </td>
              </tr>
            )}
            {!loading && tickets.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                  No tickets yet. They will appear here once customers raise issues.
                </td>
              </tr>
            )}
            {tickets.map((t) => (
              <tr key={t._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-5 py-2.5 font-medium text-slate-900 dark:text-white">
                  {t.ticketNumber}
                </td>
                <td className="px-5 py-2.5 text-slate-700 dark:text-slate-200">{t.subject}</td>
                <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">
                  {t.requester?.firstName} {t.requester?.lastName}
                </td>
                <td className="px-5 py-2.5">
                  <StatusPill label={t.priority} tone={statusToTone(t.priority)} />
                </td>
                <td className="px-5 py-2.5">
                  <StatusPill label={t.status} tone={statusToTone(t.status)} />
                </td>
                <td className="px-5 py-2.5 text-xs text-slate-500">
                  {new Date(t.updatedAt ?? t.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
