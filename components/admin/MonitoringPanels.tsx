"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Layers,
  Radio,
  BellRing,
  RefreshCw,
} from "lucide-react";
import { getAdminMonitoring } from "@/axios/admin";
import { PanelCard } from "@/components/admin/PanelCard";
import { StatusPill } from "@/components/admin/StatusPill";
import type { MonitoringSnapshot } from "@/types";

/**
 * Operational monitoring for System Health: queue (BullMQ), socket, and
 * notification-delivery health, plus derived alerts. Polls every 20s.
 */
export function MonitoringPanels() {
  const [data, setData] = useState<MonitoringSnapshot | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const snap = await getAdminMonitoring().catch(() => null);
    setData(snap);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const id = window.setInterval(load, 20_000);
    return () => window.clearInterval(id);
  }, []);

  const alerts = data?.alerts ?? [];

  return (
    <div className="space-y-6">
      {/* Alerts banner */}
      {alerts.length > 0 ? (
        <div className="space-y-2">
          {alerts.map((a) => (
            <div
              key={a.id}
              className={`flex items-start gap-3 rounded-xl border p-3 ${
                a.severity === "critical"
                  ? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30"
                  : "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30"
              }`}
            >
              <AlertTriangle
                size={16}
                className={
                  a.severity === "critical"
                    ? "mt-0.5 text-red-500"
                    : "mt-0.5 text-amber-500"
                }
              />
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {a.title}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  {a.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Queues */}
        <PanelCard
          title="Queues"
          action={
            <button
              onClick={load}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          }
        >
          <div className="flex items-center gap-2 mb-3 text-slate-400">
            <Layers size={15} />
            <span className="text-xs uppercase tracking-wide">BullMQ</span>
          </div>
          {data?.queues?.available && data.queues.queues.length ? (
            <div className="space-y-3">
              {data.queues.queues.map((q) => (
                <div
                  key={q.key}
                  className="rounded-lg border border-slate-200 p-2.5 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {q.name ?? q.key}
                    </span>
                    {q.paused ? (
                      <StatusPill label="paused" tone="yellow" />
                    ) : (
                      <StatusPill label="running" tone="green" />
                    )}
                  </div>
                  <div className="mt-2 grid grid-cols-4 gap-1 text-center text-xs">
                    <QueueStat label="waiting" value={q.waiting} />
                    <QueueStat label="active" value={q.active} />
                    <QueueStat label="failed" value={q.failed} danger />
                    <QueueStat label="delayed" value={q.delayed} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              {loading ? "Loading…" : "Queue metrics unavailable."}
            </p>
          )}
        </PanelCard>

        {/* Sockets */}
        <PanelCard title="Realtime">
          <div className="flex items-center gap-2 mb-3 text-slate-400">
            <Radio size={15} />
            <span className="text-xs uppercase tracking-wide">WebSocket</span>
          </div>
          {data?.sockets?.available ? (
            <div className="grid grid-cols-2 gap-3">
              <Big label="Connected users" value={data.sockets.connectedUsers} />
              <Big label="Open sockets" value={data.sockets.connectedSockets} />
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              {loading ? "Loading…" : "Socket metrics unavailable."}
            </p>
          )}
        </PanelCard>

        {/* Notifications */}
        <PanelCard title="Notifications (24h)">
          <div className="flex items-center gap-2 mb-3 text-slate-400">
            <BellRing size={15} />
            <span className="text-xs uppercase tracking-wide">Delivery</span>
          </div>
          {data?.notifications?.available ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Big
                  label="Delivery rate"
                  value={`${data.notifications.deliveryRate ?? 0}%`}
                />
                <Big label="Failed" value={data.notifications.failed} danger />
              </div>
              <div className="space-y-1">
                {Object.entries(data.notifications.byChannel ?? {}).map(
                  ([ch, n]) => (
                    <div
                      key={ch}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-500">{ch}</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {n}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              {loading ? "Loading…" : "Notification metrics unavailable."}
            </p>
          )}
        </PanelCard>
      </div>
    </div>
  );
}

function QueueStat({
  label,
  value,
  danger,
}: {
  label: string;
  value?: number;
  danger?: boolean;
}) {
  const v = value ?? 0;
  return (
    <div>
      <div
        className={`text-sm font-semibold ${
          danger && v > 0
            ? "text-red-600 dark:text-red-400"
            : "text-slate-900 dark:text-white"
        }`}
      >
        {v}
      </div>
      <div className="text-[10px] uppercase tracking-wide text-slate-400">
        {label}
      </div>
    </div>
  );
}

function Big({
  label,
  value,
  danger,
}: {
  label: string;
  value?: number | string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <div className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div
        className={`mt-1 text-xl font-semibold ${
          danger && Number(value) > 0
            ? "text-red-600 dark:text-red-400"
            : "text-slate-900 dark:text-white"
        }`}
      >
        {value ?? 0}
      </div>
    </div>
  );
}

export default MonitoringPanels;
