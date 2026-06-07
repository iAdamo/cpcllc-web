"use client";

import { useEffect, useState } from "react";
import { Activity, CheckCircle2 } from "lucide-react";
import { getSystemHealth } from "@/axios/admin";
import { PanelCard } from "@/components/admin/PanelCard";
import { StatusPill, statusToTone } from "@/components/admin/StatusPill";

export function SystemHealthView() {
  const [health, setHealth] = useState<any>(null);

  const refresh = async () => {
    const r = await getSystemHealth().catch(() => null);
    setHealth(r);
  };
  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
          <Activity size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">System Health</h2>
          <p className="text-sm text-slate-500 mt-0.5">Live service status, memory, uptime.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PanelCard title="Services" className="lg:col-span-2">
          <div className="space-y-2">
            {health?.services
              ? Object.entries(health.services).map(([name, svc]: any) => (
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
                      {svc.latencyMs !== undefined && svc.latencyMs !== null && (
                        <span className="text-xs text-slate-500">{svc.latencyMs}ms</span>
                      )}
                      <StatusPill label={svc.status} tone={statusToTone(svc.status)} />
                    </div>
                  </div>
                ))
              : (
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
                Last refresh: {new Date(health.generatedAt).toLocaleTimeString()}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Loading…</p>
          )}
        </PanelCard>
      </div>
    </div>
  );
}
