"use client";

import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: number; // percentage change
  deltaLabel?: string;
  icon?: LucideIcon;
  tone?: "blue" | "green" | "purple" | "orange" | "indigo" | "rose" | "slate";
}

const toneMap: Record<NonNullable<KpiCardProps["tone"]>, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-600 dark:text-blue-300" },
  green: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-600 dark:text-emerald-300" },
  purple: { bg: "bg-purple-50 dark:bg-purple-950/40", text: "text-purple-600 dark:text-purple-300" },
  orange: { bg: "bg-orange-50 dark:bg-orange-950/40", text: "text-orange-600 dark:text-orange-300" },
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-600 dark:text-indigo-300" },
  rose: { bg: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-600 dark:text-rose-300" },
  slate: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-300" },
};

export function KpiCard({
  label,
  value,
  delta,
  deltaLabel = "vs last month",
  icon: Icon,
  tone = "blue",
}: KpiCardProps) {
  const t = toneMap[tone];
  const positive = (delta ?? 0) >= 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        {Icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${t.bg} ${t.text}`}>
            <Icon size={18} />
          </div>
        )}
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1.5">{value}</p>
      {delta !== undefined && (
        <div className="flex items-center gap-1 text-xs">
          <span
            className={`flex items-center font-semibold ${
              positive ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(delta).toFixed(1)}%
          </span>
          <span className="text-slate-400">{deltaLabel}</span>
        </div>
      )}
    </div>
  );
}
