"use client";

import { useEffect, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  getAdminErrors,
  getAdminErrorsStats,
  getSystemHealth,
} from "@/axios/admin";
import { PanelCard } from "@/components/admin/PanelCard";
import { StatusPill, statusToTone } from "@/components/admin/StatusPill";
import type {
  AdminErrorItem,
  AdminErrorStats,
  SystemHealthSnapshot,
} from "@/types";

export function SystemHealthView() {
  const [health, setHealth] = useState<SystemHealthSnapshot | null>(null);
  const [errors, setErrors] = useState<AdminErrorItem[]>([]);
  const [errorStats, setErrorStats] = useState<AdminErrorStats | null>(null);

  const refresh = async () => {
    const [healthResult, errorsResult, statsResult] = await Promise.all([
      getSystemHealth().catch(() => null),
      getAdminErrors(8).catch(() => []),
      getAdminErrorsStats().catch(() => null),
    ]);
    setHealth(healthResult);
    setErrors(errorsResult);
    setErrorStats(statsResult);
  };

  useEffect(() => {
    refresh();
    const id = window.setInterval(refresh, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const severityBars = Object.entries(errorStats?.bySeverity ?? {}).sort(
    ([, a], [, b]) => b - a,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
          <Activity size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            System Health
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Live service status, memory, uptime, and recent diagnostics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PanelCard title="Services" className="lg:col-span-2">
          <div className="space-y-2">
            {health?.services ? (
              Object.entries(health.services).map(
                ([name, svc]: [string, any]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-none"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2
                        size={16}
                        className={
                          svc.status === "online" || svc.status === "healthy"
                            ? "text-emerald-500"
                            : "text-slate-400"
                        }
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-200 capitalize">
                        {name.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {svc.latencyMs !== undefined &&
                        svc.latencyMs !== null && (
                          <span className="text-xs text-slate-500">
                            {svc.latencyMs}ms
                          </span>
                        )}
                      <StatusPill
                        label={svc.status}
                        tone={statusToTone(svc.status)}
                      />
                    </div>
                  </div>
                ),
              )
            ) : (
              <p className="text-sm text-slate-400">Loading…</p>
            )}
          </div>
        </PanelCard>

        <PanelCard title="Process">
          {health ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Uptime</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {health.uptime?.formatted}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">RSS</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {health.memory?.rssMb} MB
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Heap used</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {health.memory?.heapUsedMb}/{health.memory?.heapTotalMb} MB
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">External</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {health.memory?.externalMb} MB
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-3">
                Last refresh:{" "}
                {new Date(health.generatedAt).toLocaleTimeString()}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Loading…</p>
          )}
        </PanelCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <PanelCard title="Error Center">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-400">
                  Total errors
                </div>
                <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                  {errorStats?.total ?? 0}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-400">
                  Unresolved
                </div>
                <div className="mt-1 text-xl font-semibold text-amber-600 dark:text-amber-400">
                  {errorStats?.unresolved ?? 0}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {severityBars.length > 0 ? (
                severityBars.map(([severity, count]) => (
                  <div
                    key={severity}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="capitalize text-slate-600 dark:text-slate-300">
                      {severity}
                    </span>
                    <StatusPill
                      label={`${count}`}
                      tone={statusToTone(severity)}
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">
                  No errors recorded yet.
                </p>
              )}
            </div>
          </div>
        </PanelCard>

        <PanelCard title="Recent errors">
          <div className="space-y-3">
            {errors.length > 0 ? (
              errors.map((item) => (
                <div
                  key={item.errorId}
                  className="rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {item.message}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {item.code} • {item.service ?? item.module ?? "system"}
                      </div>
                    </div>
                    <StatusPill
                      label={item.severity}
                      tone={statusToTone(item.severity)}
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <AlertTriangle size={12} />
                    <span>
                      {item.timestamp
                        ? new Date(item.timestamp).toLocaleString()
                        : "Recently captured"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">Loading recent errors…</p>
            )}
          </div>
        </PanelCard>
      </div>
    </div>
  );
}
