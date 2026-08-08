"use client";

import { useCallback, useEffect, useState } from "react";
import { Receipt, Plus, X, Loader2 } from "lucide-react";
import {
  getSubscriptionStats,
  listSubscriptionPlans,
  listSubscriptions,
  createSubscriptionPlan,
  updateSubscriptionPlan,
} from "@/axios/admin";
import { KpiCard } from "@/components/admin/KpiCard";
import { StatusPill, statusToTone } from "@/components/admin/StatusPill";

interface Plan {
  _id?: string;
  code: string;
  name: string;
  description?: string;
  audience: "provider" | "client" | "both";
  priceCents: number;
  currency: string;
  interval: "month" | "quarter" | "year";
  features?: string[];
  isActive: boolean;
}

const BLANK_PLAN: Plan = {
  code: "",
  name: "",
  description: "",
  audience: "provider",
  priceCents: 0,
  currency: "NGN",
  interval: "month",
  features: [],
  isActive: true,
};

export function SubscriptionsView() {
  const [stats, setStats] = useState<any>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Plan | null>(null);

  const reload = useCallback(async () => {
    const [s, p, l] = await Promise.allSettled([
      getSubscriptionStats(),
      listSubscriptionPlans(),
      listSubscriptions(),
    ]);
    if (s.status === "fulfilled") setStats(s.value);
    if (p.status === "fulfilled") setPlans(p.value as Plan[]);
    if (l.status === "fulfilled") setSubs((l.value as any).items ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 flex items-center justify-center">
          <Receipt size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Subscriptions</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Provider plans and renewals. Prices are per billing interval.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Active" value={stats?.active ?? "—"} tone="green" />
        <KpiCard label="Trialing" value={stats?.trialing ?? "—"} tone="blue" />
        <KpiCard label="Past Due" value={stats?.pastDue ?? "—"} tone="orange" />
        <KpiCard
          label="MRR"
          value={stats?.mrrCents ? `₦${(stats.mrrCents / 100).toLocaleString()}` : "—"}
          tone="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Plans</h3>
            <button
              onClick={() => setEditing({ ...BLANK_PLAN })}
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              <Plus size={14} /> New plan
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {plans.length === 0 && (
              <p className="px-5 py-8 text-center text-slate-400 text-sm">No plans defined yet.</p>
            )}
            {plans.map((p) => (
              <button
                key={p._id}
                onClick={() => setEditing({ ...BLANK_PLAN, ...p })}
                className="w-full text-left px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{p.name}</p>
                  <StatusPill
                    label={p.isActive ? "active" : "inactive"}
                    tone={p.isActive ? "green" : "slate"}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {p.currency} {(p.priceCents / 100).toLocaleString()} / {p.interval} ·{" "}
                  {p.audience}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden lg:col-span-2">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Subscribers</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-5 py-2.5 font-medium">User</th>
                <th className="px-5 py-2.5 font-medium">Plan</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
                <th className="px-5 py-2.5 font-medium">Renews</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-slate-400">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && subs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-slate-400">
                    No active subscriptions.
                  </td>
                </tr>
              )}
              {subs.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-5 py-2.5 text-slate-700 dark:text-slate-200">
                    {s.user?.firstName} {s.user?.lastName}
                  </td>
                  <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">
                    {s.plan?.name ?? "—"}
                  </td>
                  <td className="px-5 py-2.5">
                    <StatusPill label={s.status} tone={statusToTone(s.status)} />
                  </td>
                  <td className="px-5 py-2.5 text-xs text-slate-500">
                    {s.currentPeriodEnd
                      ? new Date(s.currentPeriodEnd).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <PlanFormModal
          plan={editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await reload();
          }}
        />
      )}
    </div>
  );
}

function PlanFormModal({
  plan,
  onClose,
  onSaved,
}: {
  plan: Plan;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!plan._id;
  const [form, setForm] = useState<Plan>(plan);
  const [priceMajor, setPriceMajor] = useState(String(plan.priceCents / 100 || ""));
  const [featuresText, setFeaturesText] = useState((plan.features ?? []).join("\n"));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof Plan>(key: K, value: Plan[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const body = {
        code: form.code.trim(),
        name: form.name.trim(),
        description: form.description?.trim() || undefined,
        audience: form.audience,
        priceCents: Math.round(parseFloat(priceMajor || "0") * 100),
        currency: form.currency.trim().toUpperCase(),
        interval: form.interval,
        features: featuresText
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean),
        isActive: form.isActive,
      };
      if (isEdit) await updateSubscriptionPlan(plan._id!, body);
      else await createSubscriptionPlan(body);
      onSaved();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Could not save plan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            {isEdit ? "Edit plan" : "New plan"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <Field label="Name">
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Provider Pro"
              className={inputCls}
            />
          </Field>
          <Field label="Code (unique)" hint="e.g. provider-pro-monthly">
            <input
              value={form.code}
              onChange={(e) => set("code", e.target.value)}
              placeholder="provider-pro-monthly"
              disabled={isEdit}
              className={`${inputCls} disabled:opacity-60`}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Price">
              <input
                type="number"
                min={0}
                step="0.01"
                value={priceMajor}
                onChange={(e) => setPriceMajor(e.target.value)}
                placeholder="5000"
                className={inputCls}
              />
            </Field>
            <Field label="Currency">
              <select
                value={form.currency}
                onChange={(e) => set("currency", e.target.value)}
                className={inputCls}
              >
                <option value="NGN">NGN</option>
                <option value="USD">USD</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Interval">
              <select
                value={form.interval}
                onChange={(e) => set("interval", e.target.value as Plan["interval"])}
                className={inputCls}
              >
                <option value="month">month</option>
                <option value="quarter">quarter</option>
                <option value="year">year</option>
              </select>
            </Field>
            <Field label="Audience">
              <select
                value={form.audience}
                onChange={(e) => set("audience", e.target.value as Plan["audience"])}
                className={inputCls}
              >
                <option value="provider">provider</option>
                <option value="client">client</option>
                <option value="both">both</option>
              </select>
            </Field>
          </div>

          <Field label="Description">
            <input
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Everything in Free, plus priority placement"
              className={inputCls}
            />
          </Field>

          <Field label="Features" hint="one per line">
            <textarea
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              rows={4}
              placeholder={"Priority placement\nVerified badge\nUnlimited services"}
              className={`${inputCls} resize-none`}
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
              className="rounded border-slate-300"
            />
            Active (sellable)
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving || !form.name.trim() || !form.code.trim()}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {isEdit ? "Save changes" : "Create plan"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-slate-500">
        {label}
        {hint && <span className="text-slate-400 font-normal"> · {hint}</span>}
      </span>
      {children}
    </label>
  );
}
