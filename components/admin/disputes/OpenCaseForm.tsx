"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createDispute } from "@/axios/admin";
import { adminKeys } from "@/hooks/admin/adminQueryKeys";
import { notify } from "@/lib/notify";
import { PersonPicker } from "./PersonPicker";
import {
  DISPUTE_REASONS,
  PRIORITIES,
  buildOpenCaseBody,
  emptyOpenCase,
  type OpenCaseForm as Form,
  type OpenCaseSource,
} from "@/lib/disputeCase";

const field =
  "w-full text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md px-3 py-2 outline-none focus:border-brand-400";
const label = "block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5";

/**
 * Open a dispute case from a job or a support ticket. The server works out
 * the two people (job: client and the business owner; ticket: requester and
 * counterparty) and emails both that the case is open.
 */
export function OpenCaseForm({
  source,
  prefillSummary,
  sides,
  needsRespondent = false,
  onOpened,
}: {
  source: OpenCaseSource;
  prefillSummary?: string;
  /** With a job: the two names, so staff can say who raised it. */
  sides?: { client: string; provider: string };
  /** A ticket that names no other person and no job: staff pick them. */
  needsRespondent?: boolean;
  onOpened: (caseId: string) => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState<Form>(() => emptyOpenCase(prefillSummary));
  const [busy, setBusy] = useState(false);
  const [respondent, setRespondent] = useState<{ _id: string; email?: string } | null>(null);
  const set = (patch: Partial<Form>) => setForm((f) => ({ ...f, ...patch }));
  const key = "task" in source ? source.task : source.ticket;

  const submit = async () => {
    const built = buildOpenCaseBody(source, form, {
      id: respondent?._id,
      needsRespondent,
    });
    if ("error" in built) {
      notify.warning(built.error, { title: "Check the form" });
      return;
    }
    setBusy(true);
    try {
      const created = await createDispute(built.body);
      await qc.invalidateQueries({ queryKey: adminKeys.disputes });
      notify.success(`Case ${created.disputeNumber} is open. Both people were emailed.`);
      onOpened(String(created._id));
    } catch (error) {
      notify.error(error, { module: "admin", feature: "dispute-open" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3 text-sm">
      {needsRespondent && (
        <div>
          <label htmlFor={`case-respondent-${key}`} className={label}>
            The other person in the case
          </label>
          <PersonPicker id={`case-respondent-${key}`} value={respondent} onChange={setRespondent} />
        </div>
      )}
      {sides && (
        <fieldset>
          <legend className={label}>Raised by</legend>
          <div className="flex gap-2">
            {(["client", "provider"] as const).map((s) => (
              <label
                key={s}
                className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer text-xs ${
                  form.raisedBySide === s
                    ? "border-brand-500 bg-brand-50/60 dark:bg-brand-950/30"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name={`raised-by-${key}`}
                  checked={form.raisedBySide === s}
                  onChange={() => set({ raisedBySide: s })}
                />
                {s === "client" ? `${sides.client} (client)` : sides.provider}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor={`case-reason-${key}`} className={label}>
            Reason
          </label>
          <select
            id={`case-reason-${key}`}
            value={form.reason}
            onChange={(e) => set({ reason: e.target.value })}
            className={field}
          >
            {DISPUTE_REASONS.map((r) => (
              <option key={r.code} value={r.code}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`case-priority-${key}`} className={label}>
            Priority
          </label>
          <select
            id={`case-priority-${key}`}
            value={form.priority}
            onChange={(e) => set({ priority: e.target.value as Form["priority"] })}
            className={field}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p[0].toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={`case-summary-${key}`} className={label}>
          Summary (emailed to both people)
        </label>
        <input
          id={`case-summary-${key}`}
          value={form.summary}
          maxLength={300}
          onChange={(e) => set({ summary: e.target.value })}
          placeholder="One line on what the case is about"
          className={field}
        />
      </div>

      <div>
        <label htmlFor={`case-details-${key}`} className={label}>
          Staff notes (never emailed)
        </label>
        <textarea
          id={`case-details-${key}`}
          rows={3}
          value={form.details}
          onChange={(e) => set({ details: e.target.value })}
          className={field}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => void submit()}
          disabled={busy}
          className="text-xs px-3 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-50"
        >
          {busy ? "Opening…" : "Open case and email both people"}
        </button>
      </div>
    </div>
  );
}
