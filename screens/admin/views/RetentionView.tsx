"use client";

import { useState } from "react";
import {
  Archive,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Lock,
  Play,
  RefreshCw,
} from "lucide-react";
import { PanelCard } from "@/components/admin/PanelCard";
import { StatusPill } from "@/components/admin/StatusPill";
import { notify } from "@/lib/notify";
import {
  usePlaceHold,
  usePreviewRetention,
  useReleaseHold,
  useRetentionHolds,
  useRetentionOverview,
  useRetentionRuns,
} from "@/hooks/admin/useRetention";
import {
  HOLD_KIND_OPTIONS,
  holdKindLabel,
  isRecordId,
  periodLabel,
  runSummary,
  type HoldKind,
  type RetentionRun,
} from "@/lib/retention";

const when = (v?: string | null) =>
  v ? new Date(v).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "";

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-500 py-6 justify-center" role="status">
      <Loader2 size={16} className="animate-spin" aria-hidden />
      {label}
    </div>
  );
}

function LoadError({ onRetry, what }: { onRetry: () => void; what: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
      <span>Couldn&apos;t load {what}.</span>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 font-medium hover:underline"
      >
        <RefreshCw size={14} aria-hidden /> Try again
      </button>
    </div>
  );
}

/** Per-type counts of one run. */
function RunCounts({ run, labels }: { run: RetentionRun; labels: Map<string, string> }) {
  const deletedHeader = run.mode === "apply" ? "Deleted" : "Would delete";
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800">
            <th className="py-2 pr-4 font-medium">Record</th>
            <th className="py-2 pr-4 font-medium text-right">Past their period</th>
            <th className="py-2 pr-4 font-medium text-right">{deletedHeader}</th>
            <th className="py-2 pr-4 font-medium text-right">On hold</th>
            <th className="py-2 font-medium text-right">Kept with a linked record</th>
          </tr>
        </thead>
        <tbody>
          {run.counts.map((c) => (
            <tr key={c.kind} className="border-b border-slate-50 dark:border-slate-800/60">
              <td className="py-2 pr-4 text-slate-700 dark:text-slate-200">{labels.get(c.kind) ?? c.kind}</td>
              <td className="py-2 pr-4 text-right tabular-nums text-slate-700 dark:text-slate-200">{c.due}</td>
              <td className="py-2 pr-4 text-right tabular-nums font-medium text-slate-900 dark:text-white">{c.deleted}</td>
              <td className="py-2 pr-4 text-right tabular-nums text-slate-700 dark:text-slate-200">{c.held}</td>
              <td className="py-2 text-right tabular-nums text-slate-700 dark:text-slate-200">{c.linked}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Data retention (docs/data-retention.md in the API): how long kept records
 * live, what the daily job did, a dry run on demand, and legal holds.
 * Reading needs compliance:read; holds need compliance:act (the API checks).
 */
export function RetentionView() {
  const overview = useRetentionOverview();
  const runs = useRetentionRuns();
  const holds = useRetentionHolds();
  const preview = usePreviewRetention();
  const place = usePlaceHold();
  const release = useReleaseHold();

  const [kind, setKind] = useState<HoldKind>("account");
  const [recordId, setRecordId] = useState("");
  const [reason, setReason] = useState("");
  const [releasing, setReleasing] = useState<string | null>(null);
  const [releaseNote, setReleaseNote] = useState("");
  const [dryRun, setDryRun] = useState<RetentionRun | null>(null);

  const labels = new Map((overview.data?.rules ?? []).map((r) => [r.kind as string, r.label]));
  const lastRun = dryRun ?? overview.data?.lastRun ?? null;
  const canPlace = isRecordId(recordId) && reason.trim().length > 0 && !place.isPending;

  const runDryRun = () =>
    preview.mutate(undefined, {
      onSuccess: (run) => {
        if (run.skipped) {
          notify.info("Another run is in progress. Try again in a few minutes.");
          return;
        }
        setDryRun(run);
        runs.refetch();
      },
      onError: (e) => notify.error(e, { module: "admin", feature: "retention-preview" }),
    });

  const submitHold = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPlace) return;
    place.mutate(
      { kind, recordId: recordId.trim(), reason: reason.trim() },
      {
        onSuccess: () => {
          notify.success("Nothing it covers will be deleted until the hold is released.", {
            title: "Hold placed",
          });
          setRecordId("");
          setReason("");
        },
        onError: (err) => notify.error(err, { module: "admin", feature: "retention-hold" }),
      },
    );
  };

  const confirmRelease = (id: string) =>
    release.mutate(
      { id, note: releaseNote.trim() },
      {
        onSuccess: () => {
          notify.success("The next daily run can delete what it covered.", { title: "Hold released" });
          setReleasing(null);
          setReleaseNote("");
        },
        onError: (err) => notify.error(err, { module: "admin", feature: "retention-release" }),
      },
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center">
            <Archive size={20} aria-hidden />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Data Retention</h1>
            <p className="text-sm text-slate-500">
              How long kept records live. A daily job deletes them once their period ends; a legal hold
              stops it.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={runDryRun}
          disabled={preview.isPending}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium disabled:opacity-50"
        >
          {preview.isPending ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <Play size={15} aria-hidden />}
          Run a dry run now
        </button>
      </div>

      {/* Mode */}
      {overview.isLoading ? null : overview.isError ? (
        <LoadError what="the retention settings" onRetry={() => overview.refetch()} />
      ) : overview.data?.mode === "apply" ? (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-200">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden />
          <p>
            <span className="font-semibold">Deleting.</span> {overview.data.schedule}, records past their period
            are deleted unless they are on hold or belong with a record still kept.
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden />
          <p>
            <span className="font-semibold">Counting only.</span> The daily job records what it would delete
            and deletes nothing. Read a dry run, place any holds, then set{" "}
            <code className="font-mono text-xs">RETENTION_MODE=apply</code> on the server and restart the API.
          </p>
        </div>
      )}

      {/* Last run / dry run */}
      <PanelCard
        title={dryRun ? "Dry run just now" : "Last run"}
        action={lastRun ? <span className="text-xs text-slate-500">{when(lastRun.startedAt)}</span> : undefined}
      >
        {overview.isLoading ? (
          <Spinner label="Loading the last run…" />
        ) : !lastRun ? (
          <p className="text-sm text-slate-500">The job hasn&apos;t run yet. Run a dry run to see what it would delete.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill label={lastRun.mode === "apply" ? "Deleted" : "Dry run"} tone={lastRun.mode === "apply" ? "green" : "yellow"} />
              <span className="text-sm text-slate-700 dark:text-slate-200">{runSummary(lastRun)}</span>
            </div>
            {lastRun.counts.length > 0 && <RunCounts run={lastRun} labels={labels} />}
          </div>
        )}
      </PanelCard>

      {/* Periods */}
      <PanelCard title="Periods">
        {overview.isLoading ? (
          <Spinner label="Loading the periods…" />
        ) : overview.isError ? (
          <LoadError what="the periods" onRetry={() => overview.refetch()} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <th className="py-2 pr-4 font-medium">Record</th>
                  <th className="py-2 pr-4 font-medium">Deleted after</th>
                  <th className="py-2 font-medium">Counted from</th>
                </tr>
              </thead>
              <tbody>
                {(overview.data?.rules ?? []).map((r) => (
                  <tr key={r.kind} className="border-b border-slate-50 dark:border-slate-800/60">
                    <td className="py-2 pr-4 text-slate-800 dark:text-slate-100">{r.label}</td>
                    <td className="py-2 pr-4 tabular-nums text-slate-700 dark:text-slate-200">{periodLabel(r)}</td>
                    <td className="py-2 text-slate-500">{r.from}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-slate-500">
              Open records (a ticket not closed, a dispute not resolved, a ban still standing) are never deleted.
              A record that belongs with one still kept waits for it.
            </p>
          </div>
        )}
      </PanelCard>

      {/* Holds */}
      <PanelCard title="Legal holds" action={<Lock size={15} className="text-slate-400" aria-hidden />}>
        <form onSubmit={submitHold} className="grid gap-3 md:grid-cols-[minmax(0,14rem)_minmax(0,16rem)_1fr_auto] md:items-end">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            What to hold
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as HoldKind)}
              className="mt-1 block w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 text-sm"
            >
              {HOLD_KIND_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {kind === "account" ? "Account id" : "Record id"}
            <input
              value={recordId}
              onChange={(e) => setRecordId(e.target.value)}
              placeholder="24-character id"
              spellCheck={false}
              aria-invalid={recordId.length > 0 && !isRecordId(recordId)}
              className="mt-1 block w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm font-mono"
            />
          </label>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Reason
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              placeholder="e.g. Court order 2026-114, tax audit"
              className="mt-1 block w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm"
            />
          </label>
          <button
            type="submit"
            disabled={!canPlace}
            className="h-9 px-4 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium disabled:opacity-40"
          >
            {place.isPending ? "Placing…" : "Place hold"}
          </button>
        </form>

        <div className="mt-5">
          {holds.isLoading ? (
            <Spinner label="Loading holds…" />
          ) : holds.isError ? (
            <LoadError what="the holds" onRetry={() => holds.refetch()} />
          ) : (holds.data ?? []).length === 0 ? (
            <p className="text-sm text-slate-500">No records are on hold.</p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {(holds.data ?? []).map((h) => (
                <li key={h._id} className="py-3 flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {holdKindLabel(h.kind)} <span className="font-mono text-xs text-slate-500">{h.recordId}</span>
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{h.reason}</p>
                    <p className="text-xs text-slate-400">Placed {when(h.createdAt)}</p>
                  </div>
                  {releasing === h._id ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        value={releaseNote}
                        onChange={(e) => setReleaseNote(e.target.value)}
                        maxLength={500}
                        placeholder="Why it can go (optional)"
                        aria-label={`Note for releasing the hold on ${holdKindLabel(h.kind)} ${h.recordId}`}
                        className="h-8 w-56 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => confirmRelease(h._id)}
                        disabled={release.isPending}
                        aria-label={`Confirm releasing the hold on ${holdKindLabel(h.kind)} ${h.recordId}`}
                        className="h-8 px-3 rounded-lg bg-rose-600 text-white text-sm font-medium disabled:opacity-50"
                      >
                        Release
                      </button>
                      <button
                        type="button"
                        onClick={() => setReleasing(null)}
                        aria-label={`Keep the hold on ${holdKindLabel(h.kind)} ${h.recordId}`}
                        className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm"
                      >
                        Keep
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setReleasing(h._id);
                        setReleaseNote("");
                      }}
                      aria-label={`Release the hold on ${holdKindLabel(h.kind)} ${h.recordId}`}
                      className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium"
                    >
                      Release
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </PanelCard>

      {/* History */}
      <PanelCard title="Run history">
        {runs.isLoading ? (
          <Spinner label="Loading runs…" />
        ) : runs.isError ? (
          <LoadError what="the run history" onRetry={() => runs.refetch()} />
        ) : (runs.data ?? []).length === 0 ? (
          <p className="text-sm text-slate-500">No runs yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {(runs.data ?? []).map((r) => (
              <li key={r._id} className="py-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span className="text-slate-500 tabular-nums w-44 shrink-0">{when(r.startedAt)}</span>
                <StatusPill
                  label={r.status === "failed" ? "Failed" : r.mode === "apply" ? "Deleted" : "Dry run"}
                  tone={r.status === "failed" ? "rose" : r.mode === "apply" ? "green" : "yellow"}
                />
                <span className="text-xs text-slate-400">
                  {r.trigger === "schedule" ? "daily job" : r.trigger === "admin" ? "from this page" : "server script"}
                </span>
                <span className="text-slate-700 dark:text-slate-200">{runSummary(r)}</span>
              </li>
            ))}
          </ul>
        )}
      </PanelCard>
    </div>
  );
}
