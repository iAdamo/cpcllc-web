"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { applyAccountAction } from "@/axios/admin";
import { notify } from "@/lib/notify";
import {
  ACTIONS,
  DURATIONS,
  MESSAGE_MAX,
  REASONS,
  buildActionBody,
  confirmLabel,
  emptyForm,
  type AccountActionType,
  type ActionForm,
  type ReasonCode,
} from "@/lib/accountActions";

interface Props {
  userId: string;
  firstName?: string;
  initialType: AccountActionType;
  onCancel: () => void;
  onDone: () => void;
}

const DESTRUCTIVE = new Set<AccountActionType>(["suspension", "ban", "deletion"]);

/**
 * Warn, suspend (for a time or permanently), delete or reinstate an account.
 * Shown inside the user drawer in place of the details. The message goes into
 * the email the person receives; the internal note never leaves the admin.
 */
export function AccountActionPanel({ userId, firstName, initialType, onCancel, onDone }: Props) {
  const [form, setForm] = useState<ActionForm>(() => emptyForm(initialType));
  const [busy, setBusy] = useState(false);
  const set = (patch: Partial<ActionForm>) => setForm((f) => ({ ...f, ...patch }));
  const reinstating = form.type === "reinstatement";
  const who = firstName?.trim() || "the user";

  const submit = async () => {
    const built = buildActionBody(form);
    if ("error" in built) {
      notify.warning(built.error, { title: "Check the form" });
      return;
    }
    setBusy(true);
    try {
      await applyAccountAction(userId, built.body);
      notify.success(`${confirmLabel(form)}: done. We’re emailing ${who} now.`);
      onDone();
    } catch (error) {
      notify.error(error, { module: "admin", feature: "account-enforcement" });
    } finally {
      setBusy(false);
    }
  };

  const field =
    "w-full text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-md px-3 py-2 outline-none focus:border-brand-400";
  const label = "block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5";

  return (
    <div className="space-y-5 text-sm">
      <div>
        <h4 className="text-base font-semibold text-slate-900 dark:text-white">
          {reinstating ? "Reinstate this account" : "Take action on this account"}
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          {reinstating
            ? `${who} can sign in again straight away, and we email them.`
            : `Recorded in the account history and emailed to ${who}.`}
        </p>
      </div>

      {!reinstating && (
        <fieldset>
          <legend className={label}>Action</legend>
          <div className="space-y-2">
            {ACTIONS.map((a) => (
              <label
                key={a.type}
                className={`flex gap-3 p-3 rounded-lg border cursor-pointer ${
                  form.type === a.type
                    ? "border-brand-500 bg-brand-50/60 dark:bg-brand-950/30"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <input
                  type="radio"
                  name="account-action"
                  className="mt-0.5"
                  checked={form.type === a.type}
                  onChange={() => set({ type: a.type })}
                />
                <span>
                  <span className="block font-medium text-slate-900 dark:text-white">{a.label}</span>
                  <span className="block text-xs text-slate-500 mt-0.5">{a.description}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {form.type === "suspension" && (
        <fieldset>
          <legend className={label}>How long</legend>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d.hours}
                type="button"
                aria-pressed={form.duration === d.hours}
                onClick={() => set({ duration: d.hours })}
                className={`text-xs px-3 py-1.5 rounded-md border ${
                  form.duration === d.hours
                    ? "border-brand-500 bg-brand-600 text-white"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {d.label}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={form.duration === "custom"}
              onClick={() => set({ duration: "custom" })}
              className={`text-xs px-3 py-1.5 rounded-md border ${
                form.duration === "custom"
                  ? "border-brand-500 bg-brand-600 text-white"
                  : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              Pick an end date
            </button>
          </div>
          {form.duration === "custom" && (
            <input
              type="datetime-local"
              aria-label="Suspension ends"
              value={form.customUntil}
              onChange={(e) => set({ customUntil: e.target.value })}
              className={`${field} mt-2`}
            />
          )}
        </fieldset>
      )}

      {!reinstating && (
        <div>
          <label htmlFor="account-action-reason" className={label}>
            Reason
          </label>
          <select
            id="account-action-reason"
            value={form.reasonCode}
            onChange={(e) => set({ reasonCode: e.target.value as ReasonCode })}
            className={field}
          >
            {REASONS.map((r) => (
              <option key={r.code} value={r.code}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="account-action-message" className={label}>
          {reinstating ? `Message to ${who} (optional)` : `Message to ${who}`}
        </label>
        <textarea
          id="account-action-message"
          rows={4}
          maxLength={MESSAGE_MAX}
          value={form.message}
          onChange={(e) => set({ message: e.target.value })}
          placeholder={
            reinstating
              ? "e.g. We reviewed your appeal and restored your account."
              : "Say what happened, specifically and factually. It goes into the email."
          }
          className={field}
        />
        <p className="text-[11px] text-slate-400 mt-1 text-right">
          {form.message.trim().length}/{MESSAGE_MAX}
        </p>
      </div>

      <div>
        <label htmlFor="account-action-note" className={label}>
          Internal note (staff only)
        </label>
        <textarea
          id="account-action-note"
          rows={2}
          value={form.internalNote}
          onChange={(e) => set({ internalNote: e.target.value })}
          placeholder="Context for the team, e.g. ticket or report numbers. Never sent to the user."
          className={field}
        />
      </div>

      {form.type === "deletion" && (
        <div className="flex gap-2 p-3 rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          They’re signed out now. The account and its data are permanently deleted in 30
          days unless your team reinstates it before then.
        </div>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="text-xs px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => void submit()}
          disabled={busy}
          className={`text-xs px-3 py-2 rounded-md text-white disabled:opacity-50 ${
            DESTRUCTIVE.has(form.type)
              ? "bg-rose-600 hover:bg-rose-700"
              : reinstating
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-brand-600 hover:bg-brand-700"
          }`}
        >
          {busy ? "Working…" : confirmLabel(form)}
        </button>
      </div>
    </div>
  );
}
