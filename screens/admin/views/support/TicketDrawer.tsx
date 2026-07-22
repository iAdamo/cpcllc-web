"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Send, ArrowUpCircle, Loader2, Lock } from "lucide-react";
import { Drawer } from "@/components/admin/Drawer";
import { StatusPill, statusToTone } from "@/components/admin/StatusPill";
import useGlobalStore from "@/stores";
import {
  getTicket,
  replyTicket,
  setTicketStatus,
  assignTicket,
  escalateTicket,
  listAdminUsers,
} from "@/axios/admin";

const STATUSES = [
  "new",
  "open",
  "pending",
  "waiting_user",
  "waiting_provider",
  "escalated",
  "resolved",
  "closed",
];

const ESCALATION_TARGETS = [
  "senior_support",
  "finance",
  "compliance",
  "moderation",
  "admin",
  "engineering",
  "legal",
];

function name(u: any): string {
  if (!u) return "Unknown";
  return `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.email || "User";
}

/**
 * Full ticket response surface: the message thread (public replies +
 * internal notes), a reply composer with a public/internal toggle, and the
 * assign / status / escalate controls.
 */
export function TicketDrawer({
  ticketId,
  onClose,
  onChanged,
}: {
  ticketId: string | null;
  onClose: () => void;
  onChanged: () => void;
}) {
  const meId = useGlobalStore((s) => s.user?._id);
  const [data, setData] = useState<{ ticket: any; messages: any[] } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [internal, setInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const [busy, setBusy] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);
  const threadRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    if (!ticketId) return;
    setLoading(true);
    try {
      setData(await getTicket(ticketId));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!ticketId) {
      setData(null);
      return;
    }
    void load();
    // agents for the assignee dropdown
    listAdminUsers({ limit: 100 })
      .then((r: any) => setAgents(r.items ?? r ?? []))
      .catch(() => setAgents([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [data?.messages?.length]);

  const ticket = data?.ticket;
  const assigneeId = useMemo(
    () => ticket?.assignee?._id ?? ticket?.assignee ?? null,
    [ticket]
  );

  const doReply = async () => {
    if (!reply.trim() || !ticketId) return;
    setSending(true);
    try {
      await replyTicket(ticketId, {
        body: reply.trim(),
        isInternalNote: internal,
      });
      setReply("");
      await load();
      onChanged();
    } finally {
      setSending(false);
    }
  };

  const runAction = async (fn: () => Promise<any>) => {
    setBusy(true);
    try {
      await fn();
      await load();
      onChanged();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Drawer
      open={!!ticketId}
      onClose={onClose}
      title={ticket?.subject ?? "Ticket"}
      subtitle={ticket?.ticketNumber}
    >
      {loading && !ticket ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin" size={20} />
        </div>
      ) : ticket ? (
        <div className="flex flex-col h-full">
          {/* Meta + controls */}
          <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusPill
                label={ticket.status}
                tone={statusToTone(ticket.status)}
              />
              <StatusPill
                label={ticket.priority}
                tone={statusToTone(ticket.priority)}
              />
              <span className="text-xs text-slate-500">{ticket.category}</span>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              <span className="text-slate-400">From </span>
              {name(ticket.requester)}
              {ticket.requester?.email && (
                <span className="text-slate-400"> · {ticket.requester.email}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Assignee */}
              <div>
                <label className="text-[11px] text-slate-400">Assignee</label>
                <div className="flex gap-1.5 mt-1">
                  <select
                    disabled={busy}
                    value={assigneeId ?? ""}
                    onChange={(e) =>
                      runAction(() => assignTicket(ticket._id, e.target.value))
                    }
                    className="flex-1 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5"
                  >
                    <option value="" disabled>
                      Unassigned
                    </option>
                    {agents.map((a) => {
                      const uid = a.user?._id ?? a.user ?? a._id;
                      return (
                        <option key={uid} value={uid}>
                          {name(a.user ?? a)}
                          {a.role ? ` · ${a.role}` : ""}
                        </option>
                      );
                    })}
                  </select>
                  {meId && assigneeId !== meId && (
                    <button
                      disabled={busy}
                      onClick={() =>
                        runAction(() => assignTicket(ticket._id, meId))
                      }
                      className="text-xs px-2 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap"
                    >
                      Assign to me
                    </button>
                  )}
                </div>
              </div>
              {/* Status */}
              <div>
                <label className="text-[11px] text-slate-400">Status</label>
                <select
                  disabled={busy}
                  value={ticket.status}
                  onChange={(e) =>
                    runAction(() => setTicketStatus(ticket._id, e.target.value))
                  }
                  className="w-full text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 mt-1"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Escalate */}
            <details className="text-xs">
              <summary className="cursor-pointer text-amber-600 flex items-center gap-1">
                <ArrowUpCircle size={13} /> Escalate
              </summary>
              <EscalateForm
                busy={busy}
                onSubmit={(target, reason) =>
                  runAction(() =>
                    escalateTicket(ticket._id, { target, reason })
                  )
                }
              />
            </details>
          </div>

          {/* Thread */}
          <div
            ref={threadRef}
            className="flex-1 overflow-y-auto py-3 space-y-2 min-h-[200px]"
          >
            {data?.messages?.map((m) => {
              const note = m.type === "internal_note";
              const mine = (m.author?._id ?? m.author) === meId;
              return (
                <div
                  key={m._id}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                      note
                        ? "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200"
                        : mine
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    }`}
                  >
                    {note && (
                      <div className="flex items-center gap-1 text-[10px] font-bold mb-0.5">
                        <Lock size={9} /> Internal note
                      </div>
                    )}
                    <div className="text-[11px] font-semibold opacity-80 mb-0.5">
                      {name(m.author)}
                    </div>
                    {m.body}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Composer */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setInternal(false)}
                className={`text-xs px-2.5 py-1 rounded-full ${
                  !internal
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}
              >
                Public reply
              </button>
              <button
                onClick={() => setInternal(true)}
                className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 ${
                  internal
                    ? "bg-amber-500 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}
              >
                <Lock size={10} /> Internal note
              </button>
            </div>
            <div className="flex items-end gap-2">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder={
                  internal
                    ? "Add an internal note (customer can't see this)…"
                    : "Reply to the customer…"
                }
                rows={2}
                className="flex-1 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 resize-none focus:outline-none focus:border-blue-400"
              />
              <button
                onClick={doReply}
                disabled={!reply.trim() || sending}
                className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center flex-shrink-0"
              >
                {sending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </Drawer>
  );
}

function EscalateForm({
  busy,
  onSubmit,
}: {
  busy: boolean;
  onSubmit: (target: string, reason: string) => void;
}) {
  const [target, setTarget] = useState(ESCALATION_TARGETS[0]);
  const [reason, setReason] = useState("");
  return (
    <div className="mt-2 space-y-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
      <select
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        className="w-full text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5"
      >
        {ESCALATION_TARGETS.map((t) => (
          <option key={t} value={t}>
            {t.replace("_", " ")}
          </option>
        ))}
      </select>
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason"
        className="w-full text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5"
      />
      <button
        disabled={busy || !reason.trim()}
        onClick={() => onSubmit(target, reason.trim())}
        className="text-xs px-3 py-1.5 rounded-md bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-40"
      >
        Escalate ticket
      </button>
    </div>
  );
}
