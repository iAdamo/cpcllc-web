"use client";

import { useEffect, useState } from "react";
import { UserCog } from "lucide-react";
import { listAdminUsers, listRoles } from "@/axios/admin";
import { StatusPill } from "@/components/admin/StatusPill";

export function RolesView() {
  const [roles, setRoles] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [r, a] = await Promise.allSettled([listRoles(), listAdminUsers({ limit: 50 })]);
      if (r.status === "fulfilled") setRoles(r.value);
      if (a.status === "fulfilled") setAdmins((a.value as any).items ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
          <UserCog size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Roles & Permissions</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage back-office roles and grant fine-grained permissions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Roles</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading && <p className="px-5 py-8 text-center text-slate-400 text-sm">Loading…</p>}
            {roles.map((r: any) => (
              <div key={r._id} className="px-5 py-3 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {r.displayName ?? r.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    Level {r.level} • {r.permissions?.length ?? 0} permissions
                  </p>
                </div>
                {r.isSystem && <StatusPill label="System" tone="slate" />}
                <StatusPill label={r.isActive ? "Active" : "Inactive"} tone={r.isActive ? "green" : "rose"} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Back-office users</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {admins.length === 0 && !loading && (
              <p className="px-5 py-8 text-center text-slate-400 text-sm">
                No admins assigned yet.
              </p>
            )}
            {admins.map((a: any) => (
              <div key={a._id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center justify-center">
                  {(a.user?.firstName?.[0] ?? "?") + (a.user?.lastName?.[0] ?? "")}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {a.user?.firstName} {a.user?.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{a.user?.email}</p>
                </div>
                <StatusPill label={a.role} tone="blue" />
                <StatusPill
                  label={a.isActive ? "Active" : "Suspended"}
                  tone={a.isActive ? "green" : "rose"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
