"use client";

import { useCallback, useEffect, useState } from "react";
import { LifeBuoy, Plus } from "lucide-react";
import { listTickets, getTicketStats } from "@/axios/admin";
import { KpiCard } from "@/components/admin/KpiCard";
import { StatusPill, statusToTone } from "@/components/admin/StatusPill";
import useGlobalStore from "@/stores";
import { TicketDrawer } from "./support/TicketDrawer";
import { NewTicketModal } from "./support/NewTicketModal";

type Scope = "all" | "unassigned" | "mine";

const STATUS_FILTERS = [
  "",
  "new",
  "open",
  "waiting_user",
  "escalated",
  "resolved",
  "closed",
];

export function SupportView() {
  const meId = useGlobalStore((s) => s.user?._id);
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [scope, setScope] = useState<Scope>("all");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");

  const [openId, setOpenId] = useState<string | null>(null);
  const [newOpen, setNewOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params: Record<string, unknown> = {};
    if (scope === "unassigned") params.unassigned = true;
    if (scope === "mine" && meId) params.assignee = meId;
    if (status) params.status = status;
    if (query.trim()) params.query = query.trim();
    try {
      const [list, s] = await Promise.allSettled([
        listTickets(params),
        getTicketStats(),
      ]);
      if (list.status === "fulfilled")
        setTickets((list.value as any).items ?? []);
      if (s.status === "fulfilled") setStats(s.value);
    } finally {
      setLoading(false);
    }
  }, [scope, status, query, meId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 flex items-center justify-center">
            <LifeBuoy size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Support Center
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage customer support tickets end to end.
            </p>
          </div>
        </div>
        <button
          onClick={() => setNewOpen(true)}
          className="flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus size={15} /> New ticket
        </button>
      </div>

      {/* Stats */}
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

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "unassigned", "mine"] as Scope[]).map((s) => (
          <button
            key={s}
            onClick={() => setScope(s)}
            className={`text-sm px-3.5 py-1.5 rounded-full capitalize ${
              scope === s
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            }`}
          >
            {s === "mine" ? "Assigned to me" : s}
          </button>
        ))}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s || "All statuses"}
            </option>
          ))}
        </select>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search # or subject…"
          className="text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 flex-1 min-w-[160px]"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-5 py-2.5 font-medium">Ticket</th>
                <th className="px-5 py-2.5 font-medium">Subject</th>
                <th className="px-5 py-2.5 font-medium">Requester</th>
                <th className="px-5 py-2.5 font-medium">Assignee</th>
                <th className="px-5 py-2.5 font-medium">Priority</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
                <th className="px-5 py-2.5 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    Loading tickets…
                  </td>
                </tr>
              )}
              {!loading && tickets.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No tickets match this view.
                  </td>
                </tr>
              )}
              {tickets.map((t) => (
                <tr
                  key={t._id}
                  onClick={() => setOpenId(t._id)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                >
                  <td className="px-5 py-2.5 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                    {t.ticketNumber}
                  </td>
                  <td className="px-5 py-2.5 text-slate-700 dark:text-slate-200 max-w-[220px] truncate">
                    {t.subject}
                  </td>
                  <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {t.requester?.firstName} {t.requester?.lastName}
                  </td>
                  <td className="px-5 py-2.5 text-slate-500 whitespace-nowrap">
                    {t.assignee
                      ? `${t.assignee.firstName ?? ""} ${t.assignee.lastName ?? ""}`.trim()
                      : "—"}
                  </td>
                  <td className="px-5 py-2.5">
                    <StatusPill label={t.priority} tone={statusToTone(t.priority)} />
                  </td>
                  <td className="px-5 py-2.5">
                    <StatusPill label={t.status} tone={statusToTone(t.status)} />
                  </td>
                  <td className="px-5 py-2.5 text-xs text-slate-500 whitespace-nowrap">
                    {new Date(t.updatedAt ?? t.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TicketDrawer
        ticketId={openId}
        onClose={() => setOpenId(null)}
        onChanged={load}
      />
      <NewTicketModal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onCreated={(id) => {
          void load();
          setOpenId(id);
        }}
      />
    </div>
  );
}
