"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, RefreshCw, Scale, Search, X } from "lucide-react";
import { PanelCard } from "@/components/admin/PanelCard";
import { StatusPill } from "@/components/admin/StatusPill";
import { notify } from "@/lib/notify";
import {
  useDecideLegalRequest,
  useLegalRequest,
  useLegalRequests,
  useMoveLegalRequest,
  useNoteLegalRequest,
} from "@/hooks/admin/useLegalRequests";
import {
  KIND_LABELS,
  STATUS_LABELS,
  isAccountId,
  isOpen,
  isOverdue,
  longDate,
  regionLabel,
  rightLabel,
  type LegalRequestDetail,
  type LegalRequestKind,
  type LegalRequestStatus,
} from "@/lib/legalRequests";

const when = (v?: string | null) =>
  v ? new Date(v).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "";

const STATUS_TONE: Record<LegalRequestStatus, "blue" | "yellow" | "green" | "rose" | "slate"> = {
  received: "blue",
  verifying: "yellow",
  in_progress: "yellow",
  completed: "green",
  denied: "rose",
  withdrawn: "slate",
};

const KIND_ORDER: LegalRequestKind[] = [
  "privacy",
  "appeal",
  "copyright",
  "counter_notice",
  "dispute_notice",
  "arbitration_opt_out",
  "legal_notice",
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-slate-800 dark:text-slate-100 break-words">{children}</dd>
    </div>
  );
}

/**
 * Privacy requests, appeals, copyright notices and counter-notices filed on
 * /privacy-request and /dmca (docs/legal-requests.md in the API). Reading
 * needs compliance:read; steps, notes and decisions need compliance:act
 * (the API checks).
 */
export function LegalRequestsView() {
  const [kind, setKind] = useState("");
  const [status, setStatus] = useState("open");
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const list = useLegalRequests({ kind, status, q: search, page });
  const filtered = !!kind || status !== "open" || !!search;
  const data = list.data;
  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center">
          <Scale size={20} aria-hidden />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Privacy &amp; Copyright Requests</h1>
          <p className="text-sm text-slate-500">
            Filed on the website&apos;s Privacy requests, DMCA and Legal notices pages. Each person was emailed their
            reference.
          </p>
        </div>
      </div>

      {/* Open counts */}
      {data ? (
        <div className="flex flex-wrap gap-2">
          {KIND_ORDER.map((k) => (
            <span
              key={k}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm"
            >
              <span className="text-slate-500">{KIND_LABELS[k]}: open</span>
              <span className="font-semibold tabular-nums text-slate-900 dark:text-white">{data.open[k] ?? 0}</span>
            </span>
          ))}
          {data.overdue > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 px-3 py-1.5 text-sm font-semibold text-rose-700 dark:text-rose-300">
              <AlertTriangle size={14} aria-hidden /> {data.overdue} past their answer-by date
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard title="Requests">
          {/* Filters */}
          <form
            className="flex flex-wrap items-end gap-2 mb-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(q);
              setPage(1);
            }}
          >
            <div className="text-xs text-slate-500">
              <label htmlFor="lr-kind">Type</label>
              <select
                id="lr-kind"
                value={kind}
                onChange={(e) => {
                  setKind(e.target.value);
                  setPage(1);
                }}
                className="mt-1 block h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 text-sm text-slate-800 dark:text-slate-100"
              >
                <option value="">All types</option>
                {KIND_ORDER.map((k) => (
                  <option key={k} value={k}>
                    {KIND_LABELS[k]}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-xs text-slate-500">
              <label htmlFor="lr-status">Status</label>
              <select
                id="lr-status"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="mt-1 block h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 text-sm text-slate-800 dark:text-slate-100"
              >
                <option value="open">Open</option>
                <option value="closed">Decided</option>
                <option value="">Any status</option>
                {(Object.keys(STATUS_LABELS) as LegalRequestStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-xs text-slate-500 flex-1 min-w-[180px]">
              <label htmlFor="lr-q">Reference, name or email</label>
              <span className="mt-1 flex h-9 items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2">
                <Search size={14} aria-hidden className="text-slate-400" />
                <input
                  id="lr-q"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 outline-none"
                />
              </span>
            </div>
            <button
              type="submit"
              className="h-9 px-3 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium"
            >
              Search
            </button>
          </form>

          {list.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500 py-6 justify-center" role="status">
              <Loader2 size={16} className="animate-spin" aria-hidden /> Loading requests…
            </div>
          ) : list.isError ? (
            <div className="flex items-center justify-between gap-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
              <span>Couldn&apos;t load the requests.</span>
              <button type="button" onClick={() => list.refetch()} className="inline-flex items-center gap-1.5 font-medium hover:underline">
                <RefreshCw size={14} aria-hidden /> Try again
              </button>
            </div>
          ) : !data?.items.length ? (
            <p className="text-sm text-slate-500 py-6 text-center">
              {filtered ? "No requests match these filters." : "No open requests. New ones appear here as they are filed."}
            </p>
          ) : (
            <>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.items.map((r) => {
                  const late = isOverdue(r);
                  return (
                    <li key={r._id}>
                      <button
                        type="button"
                        onClick={() => setOpenId(r._id)}
                        aria-label={`Open ${r.reference}`}
                        aria-current={openId === r._id ? "true" : undefined}
                        className={`w-full text-left px-2 py-3 rounded-lg transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                          openId === r._id ? "bg-slate-50 dark:bg-slate-800/60" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white">{r.reference}</span>
                          <StatusPill label={STATUS_LABELS[r.status]} tone={STATUS_TONE[r.status]} />
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                          <span>{KIND_LABELS[r.kind]}</span>
                          <span>{r.subject ? `${r.requester.name} for ${r.subject.name}` : r.requester.name}</span>
                          <span>Filed {when(r.createdAt)}</span>
                          {isOpen(r.status) ? (
                            <span className={late ? "font-semibold text-rose-600 dark:text-rose-400" : ""}>
                              {late ? "Overdue: was due" : "Answer by"} {longDate(r.dueAt)}
                            </span>
                          ) : null}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
              {pages > 1 ? (
                <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="font-medium disabled:opacity-40 hover:underline"
                  >
                    Previous page
                  </button>
                  <span>
                    Page {page} of {pages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= pages}
                    onClick={() => setPage((p) => p + 1)}
                    className="font-medium disabled:opacity-40 hover:underline"
                  >
                    Next page
                  </button>
                </div>
              ) : null}
            </>
          )}
        </PanelCard>

        {openId ? (
          <RequestPanel id={openId} onClose={() => setOpenId(null)} onOpen={setOpenId} />
        ) : (
          <div className="hidden xl:flex items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-sm text-slate-500 p-10">
            Choose a request to see it here.
          </div>
        )}
      </div>
    </div>
  );
}

function RequestPanel({
  id,
  onClose,
  onOpen,
}: {
  id: string;
  onClose: () => void;
  onOpen: (id: string) => void;
}) {
  const detail = useLegalRequest(id);
  const r = detail.data;
  return (
    <PanelCard
      title={r ? `${r.reference} · ${KIND_LABELS[r.kind]}` : "Request"}
      action={
        <button type="button" onClick={onClose} aria-label="Close the request" className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
          <X size={16} aria-hidden />
        </button>
      }
    >
      {detail.isLoading ? (
        <div className="flex items-center gap-2 text-sm text-slate-500 py-6 justify-center" role="status">
          <Loader2 size={16} className="animate-spin" aria-hidden /> Loading the request…
        </div>
      ) : detail.isError || !r ? (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
          <span>Couldn&apos;t load this request.</span>
          <button type="button" onClick={() => detail.refetch()} className="inline-flex items-center gap-1.5 font-medium hover:underline">
            <RefreshCw size={14} aria-hidden /> Try again
          </button>
        </div>
      ) : (
        <RequestBody r={r} onOpen={onOpen} />
      )}
    </PanelCard>
  );
}

function RequestBody({ r, onOpen }: { r: LegalRequestDetail; onOpen: (id: string) => void }) {
  const open = isOpen(r.status);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill label={STATUS_LABELS[r.status]} tone={STATUS_TONE[r.status]} />
        {open ? (
          <span className={`text-xs ${isOverdue(r) ? "font-semibold text-rose-600 dark:text-rose-400" : "text-slate-500"}`}>
            {isOverdue(r) ? "Overdue: was due" : "Answer by"} {longDate(r.dueAt)}
          </span>
        ) : null}
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <Field label={r.subject ? "Filed by (agent)" : "Filed by"}>
          {r.requester.name}
          <br />
          <a href={`mailto:${r.requester.email}`} className="text-brand-700 dark:text-gold-400 hover:underline">
            {r.requester.email}
          </a>
          {r.requester.phone ? (
            <>
              <br />
              {r.requester.phone}
            </>
          ) : null}
        </Field>
        {r.subject ? (
          <Field label="About">
            {r.subject.name}
            <br />
            {r.subject.email}
          </Field>
        ) : null}
        {r.requester.organization ? <Field label="Acting for">{r.requester.organization}</Field> : null}
        {r.requester.address ? <Field label="Postal address">{r.requester.address}</Field> : null}
        {r.region ? <Field label="Lives in">{regionLabel(r)}</Field> : null}
        <Field label="Filed">{when(r.createdAt)}</Field>
        {r.kind === "privacy" || r.kind === "appeal" ? (
          <Field label="Account">{r.userId ? <span className="font-mono text-xs">{r.userId}</span> : "No account with this email"}</Field>
        ) : null}
      </dl>

      {r.rights?.length ? (
        <div>
          <h4 className="text-xs font-medium text-slate-500">Asked to</h4>
          <ul className="mt-1 list-disc pl-5 text-sm text-slate-800 dark:text-slate-100">
            {r.rights.map((x) => (
              <li key={x}>{rightLabel(x)}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {r.original ? (
        <p className="text-sm text-slate-700 dark:text-slate-200">
          Appeals the decision on{" "}
          <button type="button" onClick={() => onOpen(r.original!._id)} className="font-mono font-semibold text-brand-700 dark:text-gold-400 hover:underline">
            {r.original.reference}
          </button>{" "}
          ({STATUS_LABELS[r.original.status]}).
        </p>
      ) : null}
      {r.appeals.length ? (
        <p className="text-sm text-slate-700 dark:text-slate-200">
          Appealed:{" "}
          {r.appeals.map((a) => (
            <button key={a._id} type="button" onClick={() => onOpen(a._id)} className="font-mono font-semibold text-brand-700 dark:text-gold-400 hover:underline">
              {a.reference}
            </button>
          ))}
        </p>
      ) : null}

      {r.title ? <Field label="Subject">{r.title}</Field> : null}
      {r.facts ? (
        <Field label="Supporting facts">
          <span className="whitespace-pre-wrap">{r.facts}</span>
        </Field>
      ) : null}
      {r.relief ? (
        <Field label="Relief requested">
          <span className="whitespace-pre-wrap">{r.relief}</span>
        </Field>
      ) : null}
      {r.kind === "dispute_notice" ? (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 px-3 py-2 text-sm text-amber-800 dark:text-amber-200">
          The 60-day informal resolution period (Terms Section 39.2) runs from {when(r.createdAt)} if the notice is
          complete. Contact the person to try to resolve it.
        </div>
      ) : null}
      {r.optOutCheck ? <OptOutCheck check={r.optOutCheck} /> : null}
      {r.work ? (
        <Field label="The copyrighted work">
          <span className="whitespace-pre-wrap">{r.work}</span>
        </Field>
      ) : null}
      {r.urls?.length ? (
        <div>
          <h4 className="text-xs font-medium text-slate-500">{r.kind === "counter_notice" ? "Removed material" : "Material reported"}</h4>
          <ul className="mt-1 space-y-1 text-sm">
            {r.urls.map((u) => (
              <li key={u} className="break-all">
                <a href={u} target="_blank" rel="noopener noreferrer" className="text-brand-700 dark:text-gold-400 hover:underline">
                  {u}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {r.claimReference ? <Field label="Answers notice">{r.claimReference}</Field> : null}
      {r.signature ? <Field label="Signed">{r.signature} (sworn statements ticked)</Field> : null}
      {r.restoreWindow ? (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 px-3 py-2 text-sm text-amber-800 dark:text-amber-200">
          Send a copy to whoever filed the notice. Restore the material between {longDate(r.restoreWindow.from)} and{" "}
          {longDate(r.restoreWindow.until)} unless they tell us they have gone to court.
        </div>
      ) : null}
      {r.details ? (
        <Field label={r.kind === "appeal" ? "Why they disagree" : "In their words"}>
          <span className="whitespace-pre-wrap">{r.details}</span>
        </Field>
      ) : null}

      {r.decision ? (
        <div className="rounded-lg border border-slate-100 dark:border-slate-800 px-3 py-2">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            Decided {when(r.decision.decidedAt)}: {STATUS_LABELS[r.decision.outcome as LegalRequestStatus]}
          </p>
          {r.decision.message ? (
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{r.decision.message}</p>
          ) : null}
          {r.kind === "copyright" && r.accountId ? (
            <p className="mt-1 text-xs text-slate-500">
              Account {r.accountId}: {r.strikes ?? 0} upheld notice{r.strikes === 1 ? "" : "s"} of {r.repeatInfringerStrikes}.
            </p>
          ) : null}
        </div>
      ) : null}

      {open ? <Steps r={r} /> : null}
      <Notes r={r} />

      <div>
        <h4 className="text-xs font-medium text-slate-500">History</h4>
        <ol className="mt-1 space-y-1 text-xs text-slate-600 dark:text-slate-300">
          {r.history.map((h, i) => (
            <li key={i}>
              {when(h.at)}: {STATUS_LABELS[h.status as LegalRequestStatus] ?? h.status}
              {h.by ? " (staff)" : " (filed)"}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** Whether an arbitration opt-out came in time: 30 days from first
 *  accepting the Terms of Service version in force (Section 39.11). */
function OptOutCheck({ check }: { check: NonNullable<LegalRequestDetail["optOutCheck"]> }) {
  const verdict =
    check.inTime === true
      ? { tone: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200", text: "In time: received within 30 days of first accepting the Terms in force." }
      : check.inTime === false
        ? { tone: "bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200", text: "Late: received more than 30 days after first accepting the Terms in force." }
        : { tone: "bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200", text: "Can't tell: no account with this email, or no acceptance of the Terms in force on record. Check the facts before deciding." };
  return (
    <div className={`rounded-lg px-3 py-2 text-sm ${verdict.tone}`}>
      <p className="font-medium">{verdict.text}</p>
      <p className="mt-1 text-xs">
        Terms in force: {check.currentVersion ?? "none published"}
        {check.firstAcceptedCurrentAt ? `, first accepted ${when(check.firstAcceptedCurrentAt)}` : ""}.
      </p>
      {check.acceptances.length ? (
        <ul className="mt-1 text-xs list-disc pl-5">
          {check.acceptances.map((a, i) => (
            <li key={i}>
              {a.version} {a.status} {when(a.decidedAt)}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-1 text-xs">
        The window starts at the first acceptance of a version that contains the arbitration agreement.
      </p>
    </div>
  );
}

function Steps({ r }: { r: LegalRequestDetail }) {
  const move = useMoveLegalRequest();
  const decide = useDecideLegalRequest();
  const [outcome, setOutcome] = useState<"completed" | "denied" | "withdrawn">("completed");
  const [message, setMessage] = useState("");
  const [accountId, setAccountId] = useState("");
  const needsMessage = outcome === "denied";
  const badAccount = r.kind === "copyright" && accountId.trim() !== "" && !isAccountId(accountId);
  const canDecide = (!needsMessage || message.trim().length > 0) && !badAccount && !decide.isPending;

  const step = (status: "verifying" | "in_progress") =>
    move.mutate(
      { id: r._id, status },
      { onError: (err) => notify.error(err, { module: "admin", feature: "legal-request-step" }) },
    );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canDecide) return;
    decide.mutate(
      {
        id: r._id,
        outcome,
        ...(message.trim() ? { message: message.trim() } : {}),
        ...(r.kind === "copyright" && accountId.trim() ? { accountId: accountId.trim() } : {}),
      },
      {
        onSuccess: (doc) => {
          notify.success(
            doc.kind === "copyright" && doc.strikes != null && doc.strikes >= doc.repeatInfringerStrikes
              ? `That account now has ${doc.strikes} upheld notices: the repeat-infringer policy says to close it (Users, then account actions).`
              : "The outcome is being emailed to the person.",
            { title: "Decision sent" },
          );
          setMessage("");
        },
        onError: (err) => notify.error(err, { module: "admin", feature: "legal-request-decide" }),
      },
    );
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-100 dark:border-slate-800 p-4">
      <div className="flex flex-wrap gap-2">
        {r.status !== "verifying" ? (
          <button
            type="button"
            disabled={move.isPending}
            onClick={() => step("verifying")}
            className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 disabled:opacity-50"
          >
            Mark verifying
          </button>
        ) : null}
        {r.status !== "in_progress" ? (
          <button
            type="button"
            disabled={move.isPending}
            onClick={() => step("in_progress")}
            className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 disabled:opacity-50"
          >
            Mark in progress
          </button>
        ) : null}
      </div>

      <form onSubmit={submit} className="space-y-3">
        <fieldset>
          <legend className="text-xs font-medium text-slate-500">Decision</legend>
          <div className="mt-1 flex flex-wrap gap-3 text-sm text-slate-800 dark:text-slate-100">
            {(["completed", "denied", "withdrawn"] as const).map((o) => (
              <label key={o} className="inline-flex items-center gap-1.5">
                <input type="radio" name={`outcome-${r._id}`} checked={outcome === o} onChange={() => setOutcome(o)} />
                {STATUS_LABELS[o]}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="text-xs font-medium text-slate-500">
          <label htmlFor={`message-${r._id}`}>
            Message to the person{needsMessage ? " (required: say why)" : " (optional)"}
          </label>
          <textarea
            id={`message-${r._id}`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            maxLength={4000}
            aria-describedby={`message-hint-${r._id}`}
            className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-800 dark:text-slate-100"
          />
          <span id={`message-hint-${r._id}`} className="block font-normal text-slate-400">
            Sent word for word, by email.
          </span>
        </div>
        {r.kind === "copyright" ? (
          <div className="text-xs font-medium text-slate-500">
            <label htmlFor={`account-${r._id}`}>Account that posted the material (user id)</label>
            <input
              id={`account-${r._id}`}
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              aria-invalid={badAccount}
              aria-describedby={`account-hint-${r._id}`}
              className="mt-1 h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 font-mono text-sm text-slate-800 dark:text-slate-100"
            />
            <span id={`account-hint-${r._id}`} className="block font-normal text-slate-400">
              {badAccount ? "That isn't a user id." : "Counts toward the repeat-infringer policy when upheld."}
            </span>
          </div>
        ) : null}
        <button
          type="submit"
          disabled={!canDecide}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium disabled:opacity-50"
        >
          {decide.isPending ? <Loader2 size={15} className="animate-spin" aria-hidden /> : null}
          Send decision
        </button>
      </form>
    </div>
  );
}

function Notes({ r }: { r: LegalRequestDetail }) {
  const note = useNoteLegalRequest();
  const [text, setText] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || note.isPending) return;
    note.mutate(
      { id: r._id, text: text.trim() },
      {
        onSuccess: () => setText(""),
        onError: (err) => notify.error(err, { module: "admin", feature: "legal-request-note" }),
      },
    );
  };
  return (
    <div>
      <h4 className="text-xs font-medium text-slate-500">Internal notes</h4>
      {r.notes.length ? (
        <ul className="mt-1 space-y-2">
          {r.notes.map((n, i) => (
            <li key={i} className="rounded-lg bg-slate-50 dark:bg-slate-800/60 px-3 py-2 text-sm text-slate-800 dark:text-slate-100">
              <p className="whitespace-pre-wrap">{n.text}</p>
              <p className="mt-0.5 text-xs text-slate-500">{when(n.at)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-sm text-slate-500">No notes yet.</p>
      )}
      <form onSubmit={submit} className="mt-2 flex gap-2">
        <label className="sr-only" htmlFor={`note-${r._id}`}>
          New internal note
        </label>
        <input
          id={`note-${r._id}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2000}
          placeholder="Only staff see notes"
          className="h-9 flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-800 dark:text-slate-100"
        />
        <button
          type="submit"
          disabled={!text.trim() || note.isPending}
          className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 disabled:opacity-50"
        >
          Add note
        </button>
      </form>
    </div>
  );
}
