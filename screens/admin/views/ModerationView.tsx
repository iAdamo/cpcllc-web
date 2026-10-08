"use client";

import { useCallback, useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import {
  decideModerationReport,
  getModerationStats,
  listModerationReports,
} from "@/axios/admin";
import { KpiCard } from "@/components/admin/KpiCard";
import { StatusPill, statusToTone } from "@/components/admin/StatusPill";
import { Drawer } from "@/components/admin/Drawer";
import { notify } from "@/lib/notify";
import {
  OUTCOMES,
  SUSPEND_DAYS,
  buildDecisionBody,
  emptyDecision,
  type DecisionForm,
} from "@/lib/moderationDecision";

const OPEN = new Set(["queued", "auto_flagged", "reviewing", "escalated"]);

/** What each report target is called (the API sends its own type names). */
const TARGET_NAMES: Record<string, string> = {
  Job: "Job",
  Provider: "Business",
  Reviews: "Review",
  Message: "Message",
  Chat: "Chat",
  User: "Account",
};

export function ModerationView() {
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [open, setOpen] = useState<any | null>(null);

  const load = useCallback(async () => {
    const [s, l] = await Promise.allSettled([getModerationStats(), listModerationReports()]);
    if (s.status === "fulfilled") setStats(s.value);
    if (l.status === "fulfilled") setItems((l.value as any).items ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300 flex items-center justify-center">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Moderation</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Review flagged content, auto-moderation hits and policy violations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard label="Queued" value={stats?.queued ?? "—"} tone="blue" />
        <KpiCard label="Reviewing" value={stats?.reviewing ?? "—"} tone="orange" />
        <KpiCard label="Actioned" value={stats?.actioned ?? "—"} tone="green" />
        <KpiCard label="Dismissed" value={stats?.dismissed ?? "—"} tone="slate" />
        <KpiCard label="Escalated" value={stats?.escalated ?? "—"} tone="rose" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="px-5 py-3 font-medium">Target</th>
              <th className="px-5 py-3 font-medium">Reason</th>
              <th className="px-5 py-3 font-medium">Reporter</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">When</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                  No reports yet.
                </td>
              </tr>
            )}
            {items.map((r: any) => (
              <tr key={r._id}>
                <td className="px-5 py-2.5 text-slate-700 dark:text-slate-200 max-w-[260px]">
                  <span className="block truncate">{r.targetLabel || r.targetType}</span>
                  <span className="text-xs text-slate-400">
                    {TARGET_NAMES[r.targetType] ?? r.targetType} #{r.targetId.slice(-6)}
                  </span>
                </td>
                <td className="px-5 py-2.5">{r.reason}</td>
                <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">
                  {r.reportedBy ? `${r.reportedBy.firstName} ${r.reportedBy.lastName}` : "Auto"}
                </td>
                <td className="px-5 py-2.5">
                  <StatusPill label={r.status} tone={statusToTone(r.status)} />
                </td>
                <td className="px-5 py-2.5 text-xs text-slate-500">
                  {new Date(r.createdAt).toLocaleString()}
                </td>
                <td className="px-5 py-2.5 text-right">
                  {OPEN.has(r.status) && (
                    <button
                      onClick={() => setOpen(r)}
                      aria-label={`Decide report on ${TARGET_NAMES[r.targetType] ?? r.targetType} ${r.targetLabel || r.targetId.slice(-6)}`}
                      className="text-xs text-brand-600 dark:text-brand-300 font-medium hover:underline"
                    >
                      Decide
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Drawer
        open={!!open}
        onClose={() => setOpen(null)}
        title="Decide this report"
        subtitle={
          open
            ? `${TARGET_NAMES[open.targetType] ?? open.targetType}: ${open.targetLabel || `#${String(open.targetId).slice(-6)}`} · ${open.reason}`
            : undefined
        }
      >
        {open && (
          <DecisionPanel
            report={open}
            onDone={() => {
              setOpen(null);
              void load();
            }}
          />
        )}
      </Drawer>
    </div>
  );
}

function DecisionPanel({ report, onDone }: { report: any; onDone: () => void }) {
  const [form, setForm] = useState<DecisionForm>(emptyDecision);
  const [busy, setBusy] = useState(false);
  const set = (patch: Partial<DecisionForm>) => setForm((f) => ({ ...f, ...patch }));
  const acting = form.outcome !== "dismiss";

  const submit = async () => {
    const built = buildDecisionBody(form, report.targetType);
    if ("error" in built) {
      notify.warning(built.error, { title: "Check the form" });
      return;
    }
    setBusy(true);
    try {
      await decideModerationReport(report._id, built.body);
      notify.success(
        acting ? "Decision saved. The person was notified by email." : "Report closed.",
      );
      onDone();
    } catch (error) {
      notify.error(error, { module: "admin", feature: "moderation-decide" });
    } finally {
      setBusy(false);
    }
  };

  const field =
    "w-full text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-md px-3 py-2 outline-none focus:border-brand-400";
  const label = "block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5";

  return (
    <div className="space-y-5 text-sm">
      {report.description && (
        <p className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300">
          “{report.description}”
        </p>
      )}

      <fieldset>
        <legend className={label}>Outcome</legend>
        <div className="space-y-2">
          {OUTCOMES.map((o) => (
            <label
              key={o.value}
              className={`flex gap-3 p-3 rounded-lg border cursor-pointer ${
                form.outcome === o.value
                  ? "border-brand-500 bg-brand-50/60 dark:bg-brand-950/30"
                  : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <input
                type="radio"
                name="report-outcome"
                className="mt-0.5"
                checked={form.outcome === o.value}
                onChange={() => set({ outcome: o.value })}
              />
              <span>
                <span className="block font-medium text-slate-900 dark:text-white">{o.label}</span>
                <span className="block text-xs text-slate-500 mt-0.5">{o.description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {form.outcome === "suspend" && (
        <div>
          <label htmlFor="report-suspend-days" className={label}>
            Suspend for
          </label>
          <select
            id="report-suspend-days"
            value={form.suspendDays}
            onChange={(e) => set({ suspendDays: Number(e.target.value) })}
            className={field}
          >
            {SUSPEND_DAYS.map((d) => (
              <option key={d} value={d}>
                {d === 1 ? "1 day" : `${d} days`}
              </option>
            ))}
          </select>
        </div>
      )}

      {acting && report.targetType === "Chat" && (
        <div>
          <label htmlFor="report-target-user" className={label}>
            User ID the decision applies to
          </label>
          <input
            id="report-target-user"
            value={form.targetUserId}
            onChange={(e) => set({ targetUserId: e.target.value })}
            placeholder="A chat has two people; enter the one who broke the rules"
            className={field}
          />
        </div>
      )}

      {acting && (
        <div>
          <label htmlFor="report-message" className={label}>
            Message to the user (optional)
          </label>
          <textarea
            id="report-message"
            rows={3}
            value={form.messageToUser}
            onChange={(e) => set({ messageToUser: e.target.value })}
            placeholder="Leave empty to use our standard wording for this reason."
            className={field}
          />
        </div>
      )}

      <div>
        <label htmlFor="report-notes" className={label}>
          Internal notes (staff only)
        </label>
        <textarea
          id="report-notes"
          rows={2}
          value={form.notes}
          onChange={(e) => set({ notes: e.target.value })}
          className={field}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => void submit()}
          disabled={busy}
          className={`text-xs px-3 py-2 rounded-md text-white disabled:opacity-50 ${
            acting ? "bg-rose-600 hover:bg-rose-700" : "bg-brand-600 hover:bg-brand-700"
          }`}
        >
          {busy ? "Saving…" : acting ? "Apply decision" : "Close report"}
        </button>
      </div>
    </div>
  );
}
