"use client";

import { useMemo } from "react";
import useGlobalStore from "@/stores";
import {
  Users,
  Building2,
  ListTodo,
  CalendarCheck,
  Activity,
  Star,
  AlertOctagon,
  LifeBuoy,
  ShieldAlert,
  Receipt,
  TrendingUp,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useAdminDashboard } from "@/hooks/admin/useAdminQueries";
import { KpiCard } from "@/components/admin/KpiCard";
import { PanelCard } from "@/components/admin/PanelCard";
import { StatusPill, statusToTone } from "@/components/admin/StatusPill";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const TASK_STATUS_COLORS: Record<string, string> = {
  Active: "#3B82F6",
  In_progress: "#10B981",
  Completed: "#8B5CF6",
  Cancelled: "#F59E0B",
  Expired: "#EF4444",
  Open: "#3B82F6",
};

export default function DashboardView() {
  const { data: dashboard, loading, refresh } = useAdminDashboard();
  const { user } = useGlobalStore();

  // System health is part of the bundled overview now — no extra fetch.
  const health = dashboard?.systemHealth as any;

  const overview = dashboard?.overview;
  const recent = dashboard?.recentActivities;
  const topProviders = dashboard?.topProviders ?? [];
  const recentTasks = dashboard?.recentTasks ?? [];
  const tickets = dashboard?.ticketStats;
  const disputes = dashboard?.disputeStats;
  const fraud = dashboard?.fraudStats;
  const subs = dashboard?.subscriptionStats;

  const kpis = overview?.kpis ?? {};

  // Mock time series for the overview chart — replace with real fetched series when available.
  const mockSeries = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        label: `Day ${i + 1}`,
        Users: 200 + i * 8,
        Tasks: 120 + i * 5,
        Bookings: 80 + i * 3,
      })),
    []
  );

  const donut = (overview?.taskStatusBreakdown ?? []).map((s: any) => ({
    name: s.status,
    value: s.count,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Dashboard
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Welcome back, {user?.firstName || "Admin"}! Here&apos;s what&apos;s
            happening on your platform.
          </p>
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

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          label="Total Users"
          value={loading ? "—" : (kpis.totalUsers ?? 0).toLocaleString("en-US")}
          delta={12.5}
          icon={Users}
          tone="blue"
        />
        <KpiCard
          label="Service Providers"
          value={loading ? "—" : (kpis.providers ?? 0).toLocaleString("en-US")}
          delta={8.4}
          icon={Building2}
          tone="green"
        />
        <KpiCard
          label="Total Tasks"
          value={
            loading ? "—" : (kpis.tasksPosted ?? 0).toLocaleString("en-US")
          }
          delta={15.2}
          icon={ListTodo}
          tone="orange"
        />
        <KpiCard
          label="Open Tasks"
          value={loading ? "—" : (kpis.openTasks ?? 0).toLocaleString("en-US")}
          delta={10.6}
          icon={CalendarCheck}
          tone="indigo"
        />
        <KpiCard
          label="Active Subscriptions"
          value={loading ? "—" : (subs?.active ?? 0).toLocaleString("en-US")}
          delta={18.7}
          icon={Receipt}
          tone="purple"
        />
        <KpiCard
          label="MRR"
          value={
            loading
              ? "—"
              : `₦${((subs?.mrrCents ?? 0) / 100 || 0).toLocaleString("en-US")}`
          }
          delta={20.1}
          icon={TrendingUp}
          tone="rose"
        />
      </div>

      {/* Trust & support strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          label="Open Tickets"
          value={loading ? "—" : tickets?.openTickets ?? 0}
          icon={LifeBuoy}
          tone="blue"
        />
        <KpiCard
          label="Active Disputes"
          value={
            loading ? "—" : (disputes?.open ?? 0) + (disputes?.underReview ?? 0)
          }
          icon={AlertOctagon}
          tone="rose"
        />
        <KpiCard
          label="Fraud Alerts"
          value={loading ? "—" : fraud?.openAlerts ?? 0}
          icon={ShieldAlert}
          tone="orange"
        />
        <KpiCard
          label="Avg Rating"
          value={loading ? "—" : (kpis.avgRating ?? 0).toFixed(2)}
          icon={Star}
          tone="green"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PanelCard
          title="Platform Overview"
          className="lg:col-span-2"
          action={
            <select
              aria-label="Time range"
              title="Time range"
              className="text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-md px-2 py-1 text-slate-600 dark:text-slate-300"
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 90 Days</option>
            </select>
          }
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockSeries}>
                <defs>
                  <linearGradient id="u" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="t" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="b" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200 dark:stroke-slate-800"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  stroke="#94a3b8"
                />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip />
                <Area dataKey="Users" stroke="#3B82F6" fill="url(#u)" />
                <Area dataKey="Tasks" stroke="#10B981" fill="url(#t)" />
                <Area dataKey="Bookings" stroke="#8B5CF6" fill="url(#b)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PanelCard>

        <PanelCard title="Task Status Distribution">
          <div className="h-64">
            {donut.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">
                No data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donut}
                    dataKey="value"
                    innerRadius={56}
                    outerRadius={88}
                    paddingAngle={2}
                  >
                    {donut.map((entry: any, i: number) => (
                      <Cell
                        key={i}
                        fill={TASK_STATUS_COLORS[entry.name] ?? "#94a3b8"}
                      />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </PanelCard>
      </div>

      {/* Recent activities + system health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PanelCard title="Recent Tasks" className="lg:col-span-2">
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-2 font-medium">Task</th>
                  <th className="px-5 py-2 font-medium">Client</th>
                  <th className="px-5 py-2 font-medium">Budget</th>
                  <th className="px-5 py-2 font-medium">Status</th>
                  <th className="px-5 py-2 font-medium">Posted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentTasks.slice(0, 6).map((t: any) => (
                  <tr
                    key={String(t._id)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-5 py-2 font-medium text-slate-900 dark:text-white">
                      {t.title}
                    </td>
                    <td className="px-5 py-2 text-slate-600 dark:text-slate-300">
                      {t.clientName ?? "—"}
                    </td>
                    <td className="px-5 py-2 text-slate-600 dark:text-slate-300">
                      ₦{(t.budget ?? 0).toLocaleString("en-US")}
                    </td>
                    <td className="px-5 py-2">
                      <StatusPill
                        label={t.status}
                        tone={statusToTone(t.status)}
                      />
                    </td>
                    <td className="px-5 py-2 text-slate-500 text-xs">
                      {new Date(t.createdAt).toLocaleDateString("en-US")}
                    </td>
                  </tr>
                ))}
                {recentTasks.length === 0 && (
                  <tr>
                    <td
                      className="px-5 py-6 text-center text-slate-400 text-sm"
                      colSpan={5}
                    >
                      No recent tasks
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </PanelCard>

        <PanelCard title="System Health">
          <div className="space-y-2.5">
            {health?.services ? (
              Object.entries(health.services).map(([name, svc]: any) => (
                <div
                  key={name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={14}
                      className={
                        svc.status === "online" || svc.status === "healthy"
                          ? "text-emerald-500"
                          : "text-slate-400"
                      }
                    />
                    <span className="text-slate-600 dark:text-slate-300 capitalize">
                      {name.replace(/_/g, " ")}
                    </span>
                  </div>
                  <StatusPill
                    label={svc.status}
                    tone={statusToTone(svc.status)}
                  />
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-400">Loading…</div>
            )}
            {health?.uptime && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                Uptime:{" "}
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {health.uptime.formatted}
                </span>
              </div>
            )}
          </div>
        </PanelCard>
      </div>

      {/* Top Providers + Recent activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PanelCard title="Top Service Providers" className="lg:col-span-2">
          <div className="space-y-3">
            {topProviders.length === 0 && (
              <p className="text-sm text-slate-400">No providers yet.</p>
            )}
            {topProviders.map((p: any) => (
              <div key={String(p._id)} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 text-white text-xs font-semibold flex items-center justify-center">
                  {p.providerName?.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {p.providerName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(p.categories ?? []).map((c: any) => c.name).join(", ") ||
                      "—"}
                  </p>
                </div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  ★ {(p.averageRating ?? 0).toFixed(1)}
                </div>
                {p.isFeatured && <StatusPill label="Featured" tone="purple" />}
              </div>
            ))}
          </div>
        </PanelCard>

        <PanelCard title="Recent Activities">
          <div className="space-y-3">
            {(recent?.recentUsers ?? []).slice(0, 5).map((u: any) => (
              <div key={String(u._id)} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center justify-center">
                  {(u.firstName?.[0] ?? "?") + (u.lastName?.[0] ?? "")}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900 dark:text-white">
                    New {u.activeRole?.toLowerCase()} registered
                  </p>
                  <p className="text-xs text-slate-500">
                    {u.firstName} {u.lastName}
                  </p>
                </div>
                <span className="text-[11px] text-slate-400">
                  {new Date(u.createdAt).toLocaleDateString("en-US")}
                </span>
              </div>
            ))}
            {!recent && <p className="text-sm text-slate-400">Loading…</p>}
          </div>
        </PanelCard>
      </div>
    </div>
  );
}
