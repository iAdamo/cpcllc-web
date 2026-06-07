"use client";

import { useEffect, useState } from "react";
import { Flag } from "lucide-react";
import { listFeatureFlags, toggleFeatureFlag } from "@/axios/admin";
import { StatusPill } from "@/components/admin/StatusPill";

export function FeatureFlagsView() {
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const r = await listFeatureFlags().catch(() => []);
    setFlags(r);
    setLoading(false);
  };
  useEffect(() => {
    refresh();
  }, []);

  const toggle = async (key: string, enabled: boolean) => {
    await toggleFeatureFlag(key, enabled).catch(() => null);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 flex items-center justify-center">
          <Flag size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Feature Flags</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Roll out features gradually with audience targeting and percent-based rollouts.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {loading && <p className="px-5 py-8 text-center text-slate-400 text-sm">Loading…</p>}
        {!loading && flags.length === 0 && (
          <p className="px-5 py-8 text-center text-slate-400 text-sm">
            No feature flags yet. Use POST /admin/flags to create one.
          </p>
        )}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {flags.map((f: any) => (
            <div key={f._id} className="px-5 py-3 flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{f.name}</p>
                <p className="text-xs text-slate-500">{f.key}</p>
              </div>
              <StatusPill label={`audience: ${f.audience}`} tone="slate" />
              <StatusPill label={`${f.rolloutPercent}%`} tone="blue" />
              <button
                onClick={() => toggle(f.key, !f.enabled)}
                className={`px-3 py-1.5 text-xs rounded-md font-medium ${
                  f.enabled
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {f.enabled ? "Enabled" : "Disabled"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
