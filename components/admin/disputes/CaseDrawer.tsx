"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowUpCircle, Loader2, Lock, Paperclip, Send } from "lucide-react";
import { Drawer } from "@/components/admin/Drawer";
import { StatusPill, statusToTone } from "@/components/admin/StatusPill";
import useGlobalStore from "@/stores";
import {
  addDisputeEvidence,
  addDisputeMessage,
  assignDispute,
  escalateDispute,
  resolveDispute,
} from "@/axios/admin";
import { adminKeys } from "@/hooks/admin/adminQueryKeys";
import { useAdminDispute } from "@/hooks/admin/useAdminQueries";
import { usePermissions } from "@/hooks/admin/usePermissions";
import { notify } from "@/lib/notify";
import { DURATIONS, REASONS } from "@/lib/accountActions";
import {
  CASE_ACTIONS,
  EVIDENCE_TYPES,
  OUTCOMES,
  buildDecisionBody,
  buildEvidenceBody,
  buildMessageBody,
  caseStatusLabel,
  decisionConfirmLabel,
  disputeReasonLabel,
  emptyDecision,
  emptyEvidence,
  emptyMessage,
  isOpenCase,
  outcomeLabel,
  partyLabel,
  personName,
  type Audience,
  type CaseParty,
  type DecisionForm,
  type EvidenceForm,
  type MessageForm,
} from "@/lib/disputeCase";

const field =
  "w-full text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md px-3 py-2 outline-none focus:border-brand-400";
const label = "block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5";
const section = "pt-4 mt-4 border-t border-slate-100 dark:border-slate-800";
const fmt = (d?: string) => (d ? new Date(d).toLocaleString() : "");

/**
 * One dispute case: who it is between, the job, the thread with both people
 * (each message addressed to both, one side, or kept internal), evidence, and
 * the decision. A decision can also warn or suspend one of the two people;
 * that runs through account enforcement, so it is applied, emailed to that
 * person only and shows in their account history.
 */
export function CaseDrawer({ caseId, onClose }: { caseId: string | null; onClose: () => void }) {
  const qc = useQueryClient();
  const meId = useGlobalStore((s) => s.user?._id);
  const { has } = usePermissions();
  const { data, loading } = useAdminDispute(caseId);
  const d = data?.dispute;

  const refresh = async () => {
    await Promise.all([
      qc.invalidateQueries({ queryKey: adminKeys.disputeDetail(caseId ?? "") }),
      qc.invalidateQueries({ queryKey: adminKeys.disputes }),
    ]);
  };

  /** Runs one action; errors show the server's message. */
  const run = async (feature: string, fn: () => Promise<unknown>, done?: string) => {
    try {
      await fn();
      await refresh();
      if (done) notify.success(done);
      return true;
    } catch (error) {
      notify.error(error, { module: "admin", feature });
      return false;
    }
  };

  const open = d ? isOpenCase(d.status) : false;
  const names = d
    ? { raisedBy: partyLabel(d, "raisedBy"), respondent: partyLabel(d, "respondent") }
    : { raisedBy: "", respondent: "" };
  const assigneeId = d?.assignee?._id ?? d?.assignee;
  const decision = data?.decisions?.[0];

  return (
    <Drawer
      open={!!caseId}
      onClose={onClose}
      title={d?.disputeNumber ?? (loading ? "Loading…" : "Dispute case")}
      subtitle={d ? `${disputeReasonLabel(d.reason)} · ${caseStatusLabel(d.status)}` : undefined}
    >
      {loading && !d && (
        <div className="flex justify-center py-16 text-slate-400">
          <Loader2 className="animate-spin" size={20} />
        </div>
      )}
      {d && (
        <div className="text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusPill label={caseStatusLabel(d.status)} tone={statusToTone(d.status)} />
            <StatusPill label={d.priority} tone={statusToTone(d.priority)} />
            <span className="text-xs text-slate-500">Opened {fmt(d.createdAt)}</span>
          </div>

          <dl className="mt-3 space-y-1.5">
            <Row term="Raised by" value={names.raisedBy} sub={d.raisedBy?.email} />
            <Row term="Other side" value={names.respondent} sub={d.respondent?.email} />
            {d.job?.title && <Row term="Job" value={d.job.title} />}
            <Row
              term="Assigned to"
              value={d.assignee ? personName(d.assignee) : "Nobody yet"}
            />
          </dl>

          <div className="mt-3 p-3 rounded-md bg-slate-50 dark:bg-slate-800/50">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Summary (both people see this)</p>
            <p className="mt-1 text-slate-800 dark:text-slate-100">{d.summary}</p>
            {d.details && (
              <>
                <p className="mt-3 text-[11px] uppercase tracking-wide text-slate-400 flex items-center gap-1">
                  <Lock size={10} /> Staff notes
                </p>
                <p className="mt-1 text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{d.details}</p>
              </>
            )}
          </div>

          {open && (has("dispute:assign") || has("dispute:escalate")) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {has("dispute:assign") && meId && assigneeId !== meId && (
                <button
                  type="button"
                  onClick={() => void run("dispute-assign", () => assignDispute(d._id, meId), "Assigned to you.")}
                  className="text-xs px-3 py-1.5 rounded-md bg-brand-600 hover:bg-brand-700 text-white"
                >
                  Assign to me
                </button>
              )}
              {has("dispute:escalate") && d.status !== "escalated" && (
                <EscalateForm onSubmit={(reason) => run("dispute-escalate", () => escalateDispute(d._id, reason), "Escalated.")} />
              )}
            </div>
          )}

          {decision && (
            <div className={section}>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Decision</h4>
              <p className="mt-1 font-medium text-slate-900 dark:text-white">{outcomeLabel(decision.outcome)}</p>
              <p className="mt-1 text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{decision.rationale}</p>
              {decision.accountAction && (
                <p className="mt-2 text-xs text-rose-700 dark:text-rose-300">
                  {CASE_ACTIONS.find((a) => a.type === decision.accountAction.type)?.label ?? "Action"} on{" "}
                  {names[decision.accountAction.target as CaseParty]}
                </p>
              )}
              <p className="mt-1 text-xs text-slate-400">
                {personName(decision.decidedBy)} · {fmt(decision.createdAt)}
              </p>
            </div>
          )}

          <div className={section}>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Messages</h4>
            <div className="mt-2 space-y-2">
              {(data?.messages ?? []).length === 0 && (
                <p className="text-xs text-slate-400">No messages yet. What you send below is emailed.</p>
              )}
              {(data?.messages ?? []).map((m: any) => (
                <div
                  key={m._id}
                  className={`px-3 py-2 rounded-lg ${
                    m.isInternal
                      ? "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900"
                      : "bg-slate-100 dark:bg-slate-800"
                  }`}
                >
                  <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    {m.isInternal && <Lock size={9} />}
                    {personName(m.author)} ·{" "}
                    {m.isInternal
                      ? "Internal note"
                      : m.audience === "raisedBy"
                        ? `To ${names.raisedBy}`
                        : m.audience === "respondent"
                          ? `To ${names.respondent}`
                          : "To both"}{" "}
                    · {fmt(m.createdAt)}
                  </p>
                  <p className="mt-0.5 text-slate-800 dark:text-slate-100 whitespace-pre-wrap">{m.body}</p>
                </div>
              ))}
            </div>
            <Composer
              names={names}
              open={open}
              onSend={(body) => run("dispute-message", () => addDisputeMessage(d._id, body))}
            />
          </div>

          <div className={section}>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Evidence</h4>
            <ul className="mt-2 space-y-1.5">
              {(data?.evidence ?? []).length === 0 && (
                <li className="text-xs text-slate-400">
                  Nothing yet. When someone replies to a case email with files, record them here.
                </li>
              )}
              {(data?.evidence ?? []).map((e: any) => (
                <li key={e._id} className="text-xs text-slate-600 dark:text-slate-300 flex gap-1.5">
                  <Paperclip size={12} className="mt-0.5 shrink-0" />
                  <span>
                    <span className="font-medium">{EVIDENCE_TYPES.find((t) => t.value === e.type)?.label ?? e.type}:</span>{" "}
                    {e.description}
                    {e.url && (
                      <>
                        {" "}
                        <a href={e.url} target="_blank" rel="noreferrer noopener" className="text-brand-600 underline">
                          Open
                        </a>
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <EvidenceAdder onAdd={(body) => run("dispute-evidence", () => addDisputeEvidence(d._id, body), "Evidence recorded.")} />
          </div>

          {open && has("dispute:resolve") && (
            <div className={section}>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Decide</h4>
              <DecidePanel
                names={names}
                canAct={has("user:suspend")}
                canBan={has("user:ban")}
                onDecide={(body) => run("dispute-resolve", () => resolveDispute(d._id, body), "Case decided. Both people were emailed.")}
              />
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
}

function Row({ term, value, sub }: { term: string; value: string; sub?: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-slate-500">{term}</dt>
      <dd className="text-right text-slate-900 dark:text-white">
        {value}
        {sub && <span className="block text-xs text-slate-400">{sub}</span>}
      </dd>
    </div>
  );
}

function EscalateForm({ onSubmit }: { onSubmit: (reason: string) => Promise<boolean> }) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <details className="text-xs">
      <summary className="cursor-pointer text-amber-600 flex items-center gap-1 py-1.5">
        <ArrowUpCircle size={13} /> Escalate
      </summary>
      <div className="mt-2 flex gap-2">
        <input
          aria-label="Why escalate"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why (kept as an internal note)"
          className="flex-1 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5"
        />
        <button
          type="button"
          disabled={busy || !reason.trim()}
          onClick={async () => {
            setBusy(true);
            if (await onSubmit(reason.trim())) setReason("");
            setBusy(false);
          }}
          className="px-3 py-1.5 rounded-md bg-amber-500 text-white disabled:opacity-40"
        >
          Escalate
        </button>
      </div>
    </details>
  );
}

function Composer({
  names,
  open,
  onSend,
}: {
  names: { raisedBy: string; respondent: string };
  open: boolean;
  onSend: (body: Record<string, unknown>) => Promise<boolean>;
}) {
  const [form, setForm] = useState<MessageForm>(emptyMessage);
  const [busy, setBusy] = useState(false);
  const internal = form.audience === "internal";

  const send = async () => {
    const built = buildMessageBody(form);
    if ("error" in built) {
      notify.warning(built.error);
      return;
    }
    setBusy(true);
    if (await onSend(built.body)) {
      setForm(emptyMessage());
      notify.success(internal ? "Note added." : "Sent by email.");
    }
    setBusy(false);
  };

  return (
    <div className="mt-3 space-y-2">
      <div>
        <label htmlFor="case-message-to" className={label}>
          Send to
        </label>
        <select
          id="case-message-to"
          value={form.audience}
          onChange={(e) => setForm((f) => ({ ...f, audience: e.target.value as Audience }))}
          className={field}
        >
          <option value="both">Both people</option>
          <option value="raisedBy">Only {names.raisedBy}</option>
          <option value="respondent">Only {names.respondent}</option>
          <option value="internal">Internal note (staff only)</option>
        </select>
      </div>
      <textarea
        aria-label="Message"
        rows={3}
        value={form.body}
        onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
        placeholder={internal ? "Only staff see this." : "Emailed word for word."}
        className={field}
      />
      <div className="flex items-center justify-between gap-2">
        {!internal && open ? (
          <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={form.awaitingReply}
              onChange={(e) => setForm((f) => ({ ...f, awaitingReply: e.target.checked }))}
            />
            Waiting for their reply (Awaiting evidence)
          </label>
        ) : (
          <span />
        )}
        <button
          type="button"
          disabled={busy || !form.body.trim()}
          onClick={() => void send()}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-40"
        >
          {busy ? <Loader2 size={13} className="animate-spin" /> : internal ? <Lock size={13} /> : <Send size={13} />}
          {internal ? "Add note" : "Send email"}
        </button>
      </div>
    </div>
  );
}

function EvidenceAdder({ onAdd }: { onAdd: (body: Record<string, unknown>) => Promise<boolean> }) {
  const [form, setForm] = useState<EvidenceForm>(emptyEvidence);
  const [busy, setBusy] = useState(false);
  const add = async () => {
    const built = buildEvidenceBody(form);
    if ("error" in built) {
      notify.warning(built.error);
      return;
    }
    setBusy(true);
    if (await onAdd(built.body)) setForm(emptyEvidence());
    setBusy(false);
  };
  return (
    <details className="mt-2 text-xs">
      <summary className="cursor-pointer text-brand-600 py-1">Record evidence</summary>
      <div className="mt-2 space-y-2">
        <select
          aria-label="Evidence type"
          value={form.type}
          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          className={field}
        >
          {EVIDENCE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <input
          aria-label="What it is and who sent it"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="What it is and who sent it"
          className={field}
        />
        <input
          aria-label="Link (optional)"
          value={form.url}
          onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
          placeholder="https://… (optional)"
          className={field}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => void add()}
          className="text-xs px-3 py-1.5 rounded-md bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 disabled:opacity-40"
        >
          Record
        </button>
      </div>
    </details>
  );
}

function DecidePanel({
  names,
  canAct,
  canBan,
  onDecide,
}: {
  names: { raisedBy: string; respondent: string };
  canAct: boolean;
  canBan: boolean;
  onDecide: (body: Record<string, unknown>) => Promise<boolean>;
}) {
  const [form, setForm] = useState<DecisionForm>(emptyDecision);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (patch: Partial<DecisionForm>) => {
    setConfirming(false);
    setForm((f) => ({ ...f, ...patch }));
  };
  const targetName = names[form.target];
  const confirmText = decisionConfirmLabel(form, targetName);

  const submit = async () => {
    const built = buildDecisionBody(form);
    if ("error" in built) {
      notify.warning(built.error, { title: "Check the decision" });
      return;
    }
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setBusy(true);
    await onDecide(built.body);
    setBusy(false);
    setConfirming(false);
  };

  return (
    <div className="mt-2 space-y-3">
      <fieldset>
        <legend className={label}>Outcome</legend>
        <div className="grid grid-cols-2 gap-1.5">
          {OUTCOMES.map((o) => (
            <label
              key={o.value}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-md border cursor-pointer text-xs ${
                form.outcome === o.value
                  ? "border-brand-500 bg-brand-50/60 dark:bg-brand-950/30"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <input
                type="radio"
                name="case-outcome"
                checked={form.outcome === o.value}
                onChange={() => set({ outcome: o.value })}
              />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="case-rationale" className={label}>
          Why (emailed to both people)
        </label>
        <textarea
          id="case-rationale"
          rows={3}
          value={form.rationale}
          onChange={(e) => set({ rationale: e.target.value })}
          className={field}
        />
      </div>

      {canAct && (
        <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
          <input type="checkbox" checked={form.act} onChange={(e) => set({ act: e.target.checked })} />
          Also warn or suspend someone in this case
        </label>
      )}

      {canAct && form.act && (
        <div className="space-y-3 p-3 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20">
          <fieldset>
            <legend className={label}>Who</legend>
            {(["raisedBy", "respondent"] as const).map((p) => (
              <label key={p} className="flex items-center gap-2 text-xs py-0.5">
                <input
                  type="radio"
                  name="case-action-target"
                  checked={form.target === p}
                  onChange={() => set({ target: p })}
                />
                {names[p]}
              </label>
            ))}
          </fieldset>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="case-action-type" className={label}>
                Action
              </label>
              <select
                id="case-action-type"
                value={form.type}
                onChange={(e) => set({ type: e.target.value as DecisionForm["type"] })}
                className={field}
              >
                {CASE_ACTIONS.filter((a) => a.type !== "ban" || canBan).map((a) => (
                  <option key={a.type} value={a.type}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>
            {form.type === "suspension" && (
              <div>
                <label htmlFor="case-action-duration" className={label}>
                  For
                </label>
                <select
                  id="case-action-duration"
                  value={form.durationHours}
                  onChange={(e) => set({ durationHours: Number(e.target.value) })}
                  className={field}
                >
                  {DURATIONS.map((d) => (
                    <option key={d.hours} value={d.hours}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="case-action-reason" className={label}>
              Policy reason
            </label>
            <select
              id="case-action-reason"
              value={form.reasonCode}
              onChange={(e) => set({ reasonCode: e.target.value as DecisionForm["reasonCode"] })}
              className={field}
            >
              {REASONS.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="case-action-message" className={label}>
              Message to {targetName} (emailed to them only)
            </label>
            <textarea
              id="case-action-message"
              rows={3}
              value={form.message}
              onChange={(e) => set({ message: e.target.value })}
              className={field}
            />
          </div>
        </div>
      )}

      {confirming && (
        <p role="alert" className="text-xs p-2 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200">
          Both people get the decision by email{form.act ? `, and ${targetName} gets the account action` : ""}. This can't be undone here.
        </p>
      )}
      <div className="flex justify-end gap-2">
        {confirming && (
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="text-xs px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700"
          >
            Back
          </button>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={() => void submit()}
          className={`text-xs px-3 py-2 rounded-md text-white disabled:opacity-50 ${
            form.act ? "bg-rose-600 hover:bg-rose-700" : "bg-brand-600 hover:bg-brand-700"
          }`}
        >
          {busy ? "Saving…" : confirming ? `Confirm: ${confirmText}` : confirmText}
        </button>
      </div>
    </div>
  );
}
