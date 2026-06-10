"use client";

import { Settings, ShieldCheck } from "lucide-react";
import { MfaSection } from "@/screens/admin/sections/MfaSection";

export function SettingsView() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 flex items-center justify-center">
          <Settings size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Settings
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your admin account and platform-wide preferences.
          </p>
        </div>
      </div>

      {/* Security section */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={18} className="text-slate-400" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Security
          </h3>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Two-factor authentication adds a second proof of identity beyond your
          password. Required for any admin handling sensitive operations.
        </p>
        <MfaSection />
      </section>
    </div>
  );
}
