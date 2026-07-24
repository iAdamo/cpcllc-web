"use client";

import { useCallback, useEffect, useState } from "react";
import { UserCog, UserPlus, Loader2 } from "lucide-react";
import { listAdminUsers, listRoles, createAdminUser } from "@/axios/admin";
import { StatusPill } from "@/components/admin/StatusPill";

const EMPTY = {
  email: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  password: "",
  role: "",
};

export function RolesView() {
  const [roles, setRoles] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const loadAdmins = useCallback(async () => {
    const a = await listAdminUsers({ limit: 50 });
    setAdmins((a as any).items ?? []);
  }, []);

  useEffect(() => {
    (async () => {
      const [r, a] = await Promise.allSettled([
        listRoles(),
        listAdminUsers({ limit: 50 }),
      ]);
      if (r.status === "fulfilled") {
        const list = r.value as any[];
        setRoles(list);
        setForm((f) => ({ ...f, role: f.role || list?.[0]?.name || "" }));
      }
      if (a.status === "fulfilled") setAdmins((a.value as any).items ?? []);
      setLoading(false);
    })();
  }, []);

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<any>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const canSubmit =
    form.email.trim() &&
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.phoneNumber.trim() &&
    form.password.length >= 8 &&
    form.role;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || saving) return;
    setSaving(true);
    setMsg(null);
    try {
      await createAdminUser(form);
      setMsg({ ok: true, text: `Admin ${form.email} created.` });
      setForm({ ...EMPTY, role: roles?.[0]?.name ?? "" });
      await loadAdmins();
    } catch (err: any) {
      setMsg({
        ok: false,
        text:
          err?.response?.data?.message ??
          err?.message ??
          "Could not create admin.",
      });
    } finally {
      setSaving(false);
    }
  };

  const input =
    "w-full text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 focus:outline-none focus:border-indigo-400";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
          <UserCog size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Roles & Permissions
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage back-office roles and grant fine-grained permissions.
          </p>
        </div>
      </div>

      {/* Create admin — fresh email only */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <UserPlus size={16} className="text-indigo-600" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Create admin
          </h3>
          <span className="text-xs text-slate-400">
            Use a fresh email — admins have no marketplace profile.
          </span>
        </div>
        <form onSubmit={submit} className="p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              className={input}
              placeholder="First name"
              value={form.firstName}
              onChange={set("firstName")}
            />
            <input
              className={input}
              placeholder="Last name"
              value={form.lastName}
              onChange={set("lastName")}
            />
            <input
              className={input}
              type="email"
              placeholder="Email (fresh)"
              value={form.email}
              onChange={set("email")}
            />
            <input
              className={input}
              placeholder="Phone (+15551234567)"
              value={form.phoneNumber}
              onChange={set("phoneNumber")}
            />
            <input
              className={input}
              type="password"
              placeholder="Temp password (min 8)"
              value={form.password}
              onChange={set("password")}
            />
            <select className={input} value={form.role} onChange={set("role")}>
              {roles.map((r: any) => (
                <option key={r._id ?? r.name} value={r.name}>
                  {r.displayName ?? r.name}
                </option>
              ))}
            </select>
          </div>
          {msg && (
            <p
              className={`text-xs ${
                msg.ok ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {msg.text}
            </p>
          )}
          <button
            type="submit"
            disabled={!canSubmit || saving}
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white"
          >
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <UserPlus size={15} />
            )}
            Create admin
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Roles
            </h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading && (
              <p className="px-5 py-8 text-center text-slate-400 text-sm">
                Loading…
              </p>
            )}
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
                <StatusPill
                  label={r.isActive ? "Active" : "Inactive"}
                  tone={r.isActive ? "green" : "rose"}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Back-office users
            </h3>
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
