"use client";

import { ReactNode } from "react";

interface PanelCardProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PanelCard({ title, action, children, className }: PanelCardProps) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 ${
        className ?? ""
      }`}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
