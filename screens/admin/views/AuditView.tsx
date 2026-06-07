"use client";

import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { listAuditLogs } from "@/axios/admin";
import { StatusPill, statusToTone } from "@/components/admin/StatusPill";

export function AuditView() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const r = await listAuditLogs({ limit: 50 }).catch(() => ({ items: [] }));
      setItems(r.items ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center">
          <ClipboardList size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Audit Logs</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Every back-office action is recorded with actor, target, IP and outcome.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="px-5 py-3 font-medium">When</th>
              <th className="px-5 py-3 font-medium">Actor</th>
              <th className="px-5 py-3 font-medium">Action</th>
              <th className="px-5 py-3 font-medium">Resource</th>
              <th className="px-5 py-3 font-medium">Outcome</th>
              <th className="px-5 py-3 font-medium">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                  No audit entries yet. They will start appearing as soon as you act in the back-office.
                </td>
              </tr>
            )}
            {items.map((e) => (
              <tr key={e._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-5 py-2.5 text-xs text-slate-500">
                  {new Date(e.createdAt).toLocaleString()}
                </td>
                <td className="px-5 py-2.5 text-slate-700 dark:text-slate-200">
                  {e.userId?.firstName} {e.userId?.lastName}
                  <div className="text-xs text-slate-400">{e.role}</div>
                </td>
                <td className="px-5 py-2.5 font-medium text-slate-900 dark:text-white">
                  {e.action}
                </td>
                <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">
                  {e.resource}{e.resourceId ? `:${e.resourceId.slice(-6)}` : ""}
                </td>
                <td className="px-5 py-2.5">
                  <StatusPill label={e.outcome} tone={statusToTone(e.outcome)} />
                </td>
                <td className="px-5 py-2.5 text-xs text-slate-500 font-mono">
                  {e.ipAddress ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
