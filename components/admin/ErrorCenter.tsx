"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, Search, CheckCircle2 } from "lucide-react";
import {
  getAdminErrors,
  getAdminError,
  resolveAdminError,
  getAdminErrorsStats,
} from "@/axios/admin";
import { PanelCard } from "@/components/admin/PanelCard";
import { StatusPill, statusToTone } from "@/components/admin/StatusPill";
import { Drawer } from "@/components/admin/Drawer";
import type {
  AdminErrorItem,
  AdminErrorStats,
  AdminErrorFilters,
} from "@/types";

const SEVERITIES = ["", "info", "warning", "error", "critical", "fatal"];
const RESOLVED = [
  { label: "All", value: "" },
  { label: "Unresolved", value: "false" },
  { label: "Resolved", value: "true" },
];
const PAGE_SIZE = 20;

/**
 * The Super Admin Error Center. Filter, page, inspect and resolve every error
 * captured across mobile, web and backend. Lives inside System Health so the
 * operational picture is one screen.
 */
export function ErrorCenter() {
  const [items, setItems] = useState<AdminErrorItem[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<AdminErrorStats | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [severity, setSeverity] = useState("");
  const [resolved, setResolved] = useState("false");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminErrorItem | null>(null);
  const [resolving, setResolving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const filters: AdminErrorFilters = {
      page,
      limit: PAGE_SIZE,
      severity: severity || undefined,
      resolved: resolved === "" ? undefined : resolved === "true",
      search: search.trim() || undefined,
    };
    const [pageResult, statsResult] = await Promise.all([
      getAdminErrors(filters).catch(() => ({
        items: [],
        total: 0,
        page: 1,
        limit: PAGE_SIZE,
      })),
      getAdminErrorsStats().catch(() => null),
    ]);
    setItems(pageResult.items);
    setTotal(pageResult.total);
    setStats(statsResult);
    setLoading(false);
  }, [page, severity, resolved, search]);

  useEffect(() => {
    load();
    const id = window.setInterval(load, 30_000);
    return () => window.clearInterval(id);
  }, [load]);

  const openDetail = async (item: AdminErrorItem) => {
    setSelected(item);
    // Pull the full record (stack, context) which the list omits.
    const full = await getAdminError(item.errorId).catch(() => item);
    setSelected(full);
  };

  const resolve = async () => {
    if (!selected) return;
    setResolving(true);
    await resolveAdminError(selected.errorId).catch(() => undefined);
    setResolving(false);
    setSelected({ ...selected, resolved: true });
    load();
  };

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PanelCard
        title="Error Center"
        action={
          <button
            onClick={load}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        }
      >
        <div className="space-y-4">
          {/* Stat strip */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Total" value={stats?.total ?? 0} />
            <Stat
              label="Unresolved"
              value={stats?.unresolved ?? 0}
              tone="amber"
            />
            <Stat
              label="Critical"
              value={stats?.critical ?? 0}
              tone="red"
            />
            <Stat
              label="Sources"
              value={Object.keys(stats?.bySource ?? {}).length}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                placeholder="Search message, code, endpoint…"
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <select
              value={severity}
              onChange={(e) => {
                setPage(1);
                setSeverity(e.target.value);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {SEVERITIES.map((s) => (
                <option key={s} value={s}>
                  {s === "" ? "All severities" : s}
                </option>
              ))}
            </select>
            <select
              value={resolved}
              onChange={(e) => {
                setPage(1);
                setResolved(e.target.value);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {RESOLVED.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* List */}
          <div className="space-y-2">
            {items.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">
                {loading ? "Loading…" : "No errors match these filters."}
              </p>
            ) : (
              items.map((item) => (
                <button
                  key={item.errorId}
                  onClick={() => openDetail(item)}
                  className="flex w-full items-start justify-between gap-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:border-slate-800 dark:hover:border-blue-800 dark:hover:bg-blue-950/20"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-900 dark:text-white">
                      {item.message}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                      <span className="font-mono">{item.code}</span>
                      <span>•</span>
                      <span>{item.source ?? "backend"}</span>
                      <span>•</span>
                      <span>{item.module ?? item.service ?? "system"}</span>
                      {item.timestamp ? (
                        <>
                          <span>•</span>
                          <span>
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <StatusPill
                      label={item.severity}
                      tone={statusToTone(item.severity)}
                    />
                    {item.resolved ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-600">
                        <CheckCircle2 size={11} /> Resolved
                      </span>
                    ) : null}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Pagination */}
          {pages > 1 ? (
            <div className="flex items-center justify-between pt-1 text-sm">
              <span className="text-slate-500">
                Page {page} of {pages} • {total} total
              </span>
              <div className="flex gap-2">
                <PagerBtn
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </PagerBtn>
                <PagerBtn
                  disabled={page >= pages}
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                >
                  Next
                </PagerBtn>
              </div>
            </div>
          ) : null}
        </div>
      </PanelCard>

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.code ?? "Error"}
        subtitle={selected?.errorId}
        footer={
          selected && !selected.resolved ? (
            <button
              onClick={resolve}
              disabled={resolving}
              className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {resolving ? "Resolving…" : "Mark resolved"}
            </button>
          ) : selected ? (
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-600">
              <CheckCircle2 size={16} /> Resolved
            </div>
          ) : null
        }
      >
        {selected ? (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-2">
              <StatusPill
                label={selected.severity}
                tone={statusToTone(selected.severity)}
              />
              <StatusPill label={selected.category} tone="slate" />
              {selected.retryable ? (
                <StatusPill label="retryable" tone="blue" />
              ) : null}
            </div>

            <Field label="User message" value={selected.userMessage} />
            <Field label="Message" value={selected.message} />
            <Field label="Technical" value={selected.technicalMessage} mono />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Source" value={selected.source} />
              <Field label="Environment" value={selected.environment} />
              <Field label="Module" value={selected.module} />
              <Field label="Service" value={selected.service} />
              <Field label="Endpoint" value={selected.endpoint} mono />
              <Field label="Route/Screen" value={selected.route} />
              <Field label="Platform" value={selected.platform} />
              <Field label="App version" value={selected.appVersion} />
              <Field label="User ID" value={selected.userId} mono />
              <Field label="Correlation" value={selected.correlationId} mono />
              <Field label="IP" value={selected.ipAddress} mono />
              <Field
                label="When"
                value={
                  selected.timestamp
                    ? new Date(selected.timestamp).toLocaleString()
                    : undefined
                }
              />
            </div>

            {selected.stack ? (
              <div>
                <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <AlertTriangle size={12} /> Stack trace
                </div>
                <pre className="max-h-64 overflow-auto rounded-lg bg-slate-900 p-3 text-[11px] leading-relaxed text-slate-200">
                  {selected.stack}
                </pre>
              </div>
            ) : null}
          </div>
        ) : null}
      </Drawer>
    </>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "amber" | "red";
}) {
  const color =
    tone === "amber"
      ? "text-amber-600 dark:text-amber-400"
      : tone === "red"
        ? "text-red-600 dark:text-red-400"
        : "text-slate-900 dark:text-white";
  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <div className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className={`mt-1 text-xl font-semibold ${color}`}>{value}</div>
    </div>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div
        className={`mt-0.5 break-words text-slate-800 dark:text-slate-100 ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function PagerBtn({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {children}
    </button>
  );
}
