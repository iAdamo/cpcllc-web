"use client";

import { useEffect, useState } from "react";
import { Gift } from "lucide-react";
import {
  getAdminReferrals,
  type AdminReferralRow,
  type AdminReferralStats,
} from "@/axios/admin";
import { KpiCard } from "@/components/admin/KpiCard";
import { StatusPill } from "@/components/admin/StatusPill";

const STATUS_FILTERS = ["", "joined", "qualified", "rewarded"] as const;

const statusTone = (s: AdminReferralRow["status"]) =>
  s === "rewarded" ? "green" : s === "qualified" ? "blue" : "slate";

const fullName = (p?: { firstName?: string; lastName?: string }) =>
  p ? `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim() || "—" : "—";

export function ReferralsView() {
  const [stats, setStats] = useState<AdminReferralStats | null>(null);
  const [rows, setRows] = useState<AdminReferralRow[]>([]);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAdminReferrals({ status: status || undefined, limit: 50 })
      .then((res) => {
        setStats(res.stats);
        setRows(res.page.items ?? []);
      })
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 flex items-center justify-center">
          <Gift size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Referrals
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Provider-to-provider invites. Rewards (free Pro days) are granted
            automatically when an invitee goes live.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total invites" value={stats?.total ?? "—"} tone="slate" />
        <KpiCard label="Qualified" value={stats?.qualified ?? "—"} tone="blue" />
        <KpiCard label="Rewarded" value={stats?.rewarded ?? "—"} tone="green" />
        <KpiCard
          label="Free days granted"
          value={stats?.rewardDaysGranted ?? "—"}
          tone="purple"
        />
      </div>

      {(stats?.pendingRewards ?? 0) > 0 && (
        <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-lg px-4 py-2.5">
          {stats?.pendingRewards} reward(s) are banked as pending — they apply to
          the beneficiary&apos;s first paid subscription period (no active
          subscription to credit yet).
        </div>
      )}

      {/* Status filter */}
      <div className="flex gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s || "all"}
            onClick={() => setStatus(s)}
            className={`text-xs px-3 py-1.5 rounded-full border capitalize ${
              status === s
                ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900"
                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {s || "all"}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="px-5 py-2.5 font-medium">Referrer</th>
              <th className="px-5 py-2.5 font-medium">Invitee</th>
              <th className="px-5 py-2.5 font-medium">Status</th>
              <th className="px-5 py-2.5 font-medium text-right">Reward days</th>
              <th className="px-5 py-2.5 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-slate-400">
                  No referrals yet.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr
                key={r._id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <td className="px-5 py-2.5 text-slate-700 dark:text-slate-200">
                  {fullName(r.referrer)}
                </td>
                <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">
                  {fullName(r.invitee)}
                </td>
                <td className="px-5 py-2.5">
                  <StatusPill label={r.status} tone={statusTone(r.status)} />
                </td>
                <td className="px-5 py-2.5 text-right tabular-nums text-slate-600 dark:text-slate-300">
                  {r.referrerRewardDays + r.inviteeRewardDays || "—"}
                  {(r.referrerRewardPending || r.inviteeRewardPending) && (
                    <span className="ml-1 text-[10px] text-amber-600">
                      pending
                    </span>
                  )}
                </td>
                <td className="px-5 py-2.5 text-xs text-slate-500">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
