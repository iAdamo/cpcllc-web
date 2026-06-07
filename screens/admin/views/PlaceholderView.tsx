"use client";

import type { LucideIcon } from "lucide-react";

interface PlaceholderViewProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  /** Bulleted list of features that this module will support. */
  features?: string[];
}

export function PlaceholderView({ title, description, icon: Icon, features }: PlaceholderViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 flex items-center justify-center">
            <Icon size={20} />
          </div>
        )}
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-10 text-center">
        <p className="text-sm text-slate-500 mb-3">
          API endpoints are live. Connect your views to the back-office service to start managing this module.
        </p>
        {features && features.length > 0 && (
          <div className="max-w-md mx-auto text-left mt-6 space-y-2">
            {features.map((f) => (
              <div key={f} className="flex items-start gap-2 text-sm">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-slate-600 dark:text-slate-300">{f}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
