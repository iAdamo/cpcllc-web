"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Radio,
  Plus,
  Loader2,
  Send,
  Check,
  X,
  Rocket,
  Ban,
  Archive,
  Trash2,
  Users,
  Eye,
} from "lucide-react";
import { Drawer } from "@/components/admin/Drawer";
import { StatusPill } from "@/components/admin/StatusPill";
import {
  listBroadcasts,
  getBroadcastStats,
  createBroadcast,
  updateBroadcast,
  submitBroadcast,
  approveBroadcast,
  rejectBroadcast,
  publishBroadcast,
  cancelBroadcast,
  archiveBroadcast,
  deleteBroadcast,
  estimateAudience,
  getBroadcastAnalytics,
  type Broadcast,
  type BroadcastStatus,
  type BroadcastChannel,
  type Audience,
} from "@/axios/broadcast";

const TABS: { key: BroadcastStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "DRAFT", label: "Drafts" },
  { key: "PENDING_APPROVAL", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "SCHEDULED", label: "Scheduled" },
  { key: "PUBLISHED", label: "Published" },
  { key: "ARCHIVED", label: "Archived" },
];

const TEMPLATES = [
  "APP_UPDATE",
  "NEW_FEATURE",
  "PROMOTION",
  "SCHEDULED_MAINTENANCE",
  "SECURITY_ALERT",
  "EMERGENCY_NOTICE",
  "SERVICE_OUTAGE",
  "HOLIDAY_MESSAGE",
  "COMMUNITY_HIGHLIGHT",
  "EDUCATIONAL_TIP",
  "POLICY_UPDATE",
  "WELCOME",
  "CUSTOM",
] as const;
const CATEGORIES = [
  "PRODUCT",
  "PROMOTION",
  "SYSTEM",
  "SECURITY",
  "COMMUNITY",
  "EDUCATION",
  "POLICY",
] as const;
const PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;
const CHANNELS: BroadcastChannel[] = ["PUSH", "IN_APP", "EMAIL", "WEB"];
const AUDIENCES = [
  "EVERYONE",
  "CLIENTS",
  "PROVIDERS",
  "VERIFIED_USERS",
  "SELECTED_USERS",
] as const;

const statusTone = (s: BroadcastStatus): any =>
  s === "PUBLISHED"
    ? "green"
    : s === "REJECTED" || s === "CANCELLED"
    ? "rose"
    : s === "PENDING_APPROVAL" || s === "SUBMITTED"
    ? "amber"
    : s === "APPROVED" || s === "SCHEDULED"
    ? "blue"
    : "slate";

const EMPTY: Partial<Broadcast> = {
  title: "",
  subtitle: "",
  body: "",
  template: "CUSTOM",
  category: "PRODUCT",
  priority: "NORMAL",
  channels: ["IN_APP", "PUSH"],
  audience: { type: "EVERYONE" },
};

export function BroadcastCenterView() {
  const [tab, setTab] = useState<BroadcastStatus | "ALL">("ALL");
  const [items, setItems] = useState<Broadcast[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [builderId, setBuilderId] = useState<string | "new" | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [list, s] = await Promise.all([
        listBroadcasts(tab === "ALL" ? {} : { status: tab, limit: 50 }),
        getBroadcastStats(),
      ]);
      setItems(list.items);
      setStats(s.byStatus);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-600 dark:text-fuchsia-300 flex items-center justify-center">
            <Radio size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Broadcast Center
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              One source of truth for push, in-app, web, and email announcements.
            </p>
          </div>
        </div>
        <button
          onClick={() => setBuilderId("new")}
          className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
        >
          <Plus size={16} /> New Broadcast
        </button>
      </div>

      {/* Tabs with counts */}
      <div className="flex gap-1 flex-wrap border-b border-slate-100 dark:border-slate-800">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`text-sm px-3 py-2 -mb-px border-b-2 ${
              tab === t.key
                ? "border-fuchsia-600 text-fuchsia-700 dark:text-fuchsia-300 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.label}
            {t.key !== "ALL" && stats[t.key] ? (
              <span className="ml-1.5 text-xs text-slate-400">{stats[t.key]}</span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-16 flex justify-center text-slate-400">
            <Loader2 className="animate-spin" size={20} />
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center">
            <Radio className="mx-auto text-slate-300 mb-2" size={28} />
            <p className="text-sm text-slate-400">
              Nothing here yet. Create your first broadcast.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((b) => (
              <button
                key={b._id}
                onClick={() => setDetailId(b._id)}
                className="w-full text-left px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {b.title || "(untitled)"}
                    </p>
                    <StatusPill label={b.status} tone={statusTone(b.status)} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {b.category} · {b.channels?.join(", ")} ·{" "}
                    {b.audience?.type?.toLowerCase()}
                  </p>
                </div>
                {b.status === "PUBLISHED" && (
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {b.analytics?.delivered ?? 0} sent
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {builderId && (
        <BroadcastBuilder
          id={builderId}
          onClose={() => setBuilderId(null)}
          onSaved={() => {
            setBuilderId(null);
            void load();
          }}
        />
      )}
      {detailId && (
        <BroadcastDetail
          id={detailId}
          onClose={() => setDetailId(null)}
          onEdit={(id) => {
            setDetailId(null);
            setBuilderId(id);
          }}
          onChanged={() => void load()}
        />
      )}
    </div>
  );
}

/* ─── Builder ─────────────────────────────────────────────────────────────── */

const input =
  "w-full text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 focus:outline-none focus:border-fuchsia-400";

function BroadcastBuilder({
  id,
  onClose,
  onSaved,
}: {
  id: string | "new";
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<Broadcast>>({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [estimate, setEstimate] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (id !== "new") {
      import("@/axios/broadcast").then(({ getBroadcast }) =>
        getBroadcast(id).then((b) => setForm(b)).catch(() => {})
      );
    }
  }, [id]);

  const audience = form.audience ?? { type: "EVERYONE" as const };

  // Live audience estimate whenever targeting changes.
  useEffect(() => {
    let cancelled = false;
    estimateAudience(audience as Audience)
      .then((r) => !cancelled && setEstimate(r.count))
      .catch(() => !cancelled && setEstimate(null));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(audience)]);

  const set = (k: keyof Broadcast, v: any) =>
    setForm((f) => ({ ...f, [k]: v }));
  const setAud = (patch: Partial<Audience>) =>
    setForm((f) => ({ ...f, audience: { ...(f.audience as Audience), ...patch } }));

  const toggleChannel = (c: BroadcastChannel) =>
    setForm((f) => {
      const cur = new Set(f.channels ?? []);
      cur.has(c) ? cur.delete(c) : cur.add(c);
      return { ...f, channels: Array.from(cur) };
    });

  const save = async (thenSubmit = false) => {
    if (!form.title?.trim()) {
      setErr("A title is required");
      return;
    }
    setSaving(true);
    setErr(null);
    try {
      const saved =
        id === "new"
          ? await createBroadcast(form)
          : await updateBroadcast(id, form);
      if (thenSubmit) await submitBroadcast(saved._id);
      onSaved();
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      open
      onClose={onClose}
      title={id === "new" ? "New Broadcast" : "Edit Broadcast"}
      subtitle="Fill in the content and targeting — the apps render the template."
    >
      <div className="space-y-4">
        {/* Live preview */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {form.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.coverImage}
              alt=""
              className="w-full h-28 object-cover"
            />
          ) : (
            <div className="h-2 bg-gradient-to-r from-fuchsia-500 to-indigo-500" />
          )}
          <div className="p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-fuchsia-600">
              {form.category}
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {form.title || "Your title"}
            </p>
            {form.subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{form.subtitle}</p>
            )}
            {form.ctaLabel && (
              <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-fuchsia-600 text-white">
                {form.ctaLabel}
              </span>
            )}
          </div>
        </div>

        <Field label="Template">
          <select
            className={input}
            value={form.template}
            onChange={(e) => set("template", e.target.value)}
          >
            {TEMPLATES.map((t) => (
              <option key={t} value={t}>
                {t.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Title">
          <input
            className={input}
            value={form.title ?? ""}
            onChange={(e) => set("title", e.target.value)}
          />
        </Field>
        <Field label="Subtitle">
          <input
            className={input}
            value={form.subtitle ?? ""}
            onChange={(e) => set("subtitle", e.target.value)}
          />
        </Field>
        <Field label="Body (rich text / basic HTML)">
          <textarea
            className={`${input} resize-none`}
            rows={4}
            value={form.body ?? ""}
            onChange={(e) => set("body", e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Cover image URL">
            <input
              className={input}
              value={form.coverImage ?? ""}
              onChange={(e) => set("coverImage", e.target.value)}
            />
          </Field>
          <Field label="CTA label">
            <input
              className={input}
              value={form.ctaLabel ?? ""}
              onChange={(e) => set("ctaLabel", e.target.value)}
            />
          </Field>
        </div>
        <Field label="CTA link (deep link or URL)">
          <input
            className={input}
            placeholder="/updates or https://…"
            value={form.ctaUrl ?? ""}
            onChange={(e) => set("ctaUrl", e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <select
              className={input}
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Priority">
            <select
              className={input}
              value={form.priority}
              onChange={(e) => set("priority", e.target.value)}
            >
              {PRIORITIES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Delivery channels">
          <div className="flex flex-wrap gap-2">
            {CHANNELS.map((c) => {
              const on = form.channels?.includes(c);
              return (
                <button
                  key={c}
                  onClick={() => toggleChannel(c)}
                  className={`text-xs px-3 py-1.5 rounded-full border ${
                    on
                      ? "bg-fuchsia-600 text-white border-fuchsia-600"
                      : "border-slate-200 dark:border-slate-700 text-slate-500"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </Field>

        {/* Audience builder */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
            <Users size={14} /> Audience
            <span className="ml-auto text-xs font-normal text-slate-500">
              {estimate === null ? "—" : `≈ ${estimate.toLocaleString()} recipients`}
            </span>
          </div>
          <select
            className={input}
            value={audience.type}
            onChange={(e) => setAud({ type: e.target.value as any })}
          >
            {AUDIENCES.map((a) => (
              <option key={a} value={a}>
                {a.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input
              className={input}
              placeholder="Country (optional)"
              value={audience.filters?.country ?? ""}
              onChange={(e) =>
                setAud({
                  filters: { ...audience.filters, country: e.target.value },
                })
              }
            />
            <label className="flex items-center gap-2 text-xs text-slate-500">
              <input
                type="checkbox"
                checked={!!audience.filters?.verified}
                onChange={(e) =>
                  setAud({
                    filters: { ...audience.filters, verified: e.target.checked },
                  })
                }
              />
              Verified only
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Schedule (optional)">
            <input
              type="datetime-local"
              className={input}
              value={form.scheduledAt?.slice(0, 16) ?? ""}
              onChange={(e) =>
                set(
                  "scheduledAt",
                  e.target.value ? new Date(e.target.value).toISOString() : undefined
                )
              }
            />
          </Field>
          <Field label="Expires (optional)">
            <input
              type="datetime-local"
              className={input}
              value={form.expiresAt?.slice(0, 16) ?? ""}
              onChange={(e) =>
                set(
                  "expiresAt",
                  e.target.value ? new Date(e.target.value).toISOString() : undefined
                )
              }
            />
          </Field>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-xs text-slate-500">
            <input
              type="checkbox"
              checked={!!form.pinned}
              onChange={(e) => set("pinned", e.target.checked)}
            />
            Pinned
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-500">
            <input
              type="checkbox"
              checked={!!form.featured}
              onChange={(e) => set("featured", e.target.checked)}
            />
            Featured
          </label>
        </div>

        {err && <p className="text-xs text-rose-600">{err}</p>}

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => save(false)}
            disabled={saving}
            className="text-sm px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save draft"}
          </button>
          <button
            onClick={() => save(true)}
            disabled={saving}
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 text-white disabled:opacity-40"
          >
            <Send size={14} /> Save & submit for approval
          </button>
        </div>
      </div>
    </Drawer>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] text-slate-400">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

/* ─── Detail + workflow ─────────────────────────────────────────────────────── */

function BroadcastDetail({
  id,
  onClose,
  onEdit,
  onChanged,
}: {
  id: string;
  onClose: () => void;
  onEdit: (id: string) => void;
  onChanged: () => void;
}) {
  const [b, setB] = useState<Broadcast | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    import("@/axios/broadcast").then(({ getBroadcast }) =>
      getBroadcast(id).then(setB).catch(() => {})
    );
  }, [id]);
  useEffect(() => load(), [load]);

  const run = async (fn: () => Promise<any>) => {
    setBusy(true);
    try {
      await fn();
      load();
      onChanged();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? e?.message ?? "Action failed");
    } finally {
      setBusy(false);
    }
  };

  const a = b?.analytics;
  const openRate =
    a && a.delivered ? Math.round((a.read / a.delivered) * 100) : 0;

  return (
    <Drawer
      open
      onClose={onClose}
      title={b?.title ?? "Broadcast"}
      subtitle={b?.status}
    >
      {!b ? (
        <div className="py-16 flex justify-center text-slate-400">
          <Loader2 className="animate-spin" size={20} />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusPill label={b.status} tone={statusTone(b.status)} />
            <StatusPill label={b.category} tone="slate" />
            <StatusPill label={b.priority} tone="slate" />
          </div>

          {b.rejectionReason && (
            <div className="text-xs text-rose-700 bg-rose-50 dark:bg-rose-950/30 rounded-lg px-3 py-2">
              Rejected: {b.rejectionReason}
            </div>
          )}

          <div className="text-sm text-slate-700 dark:text-slate-200">
            {b.subtitle && <p className="text-slate-500">{b.subtitle}</p>}
            <div
              className="prose prose-sm dark:prose-invert mt-1 max-w-none"
              dangerouslySetInnerHTML={{ __html: b.body || "" }}
            />
          </div>

          <div className="text-xs text-slate-500 space-y-1">
            <p>Channels: {b.channels?.join(", ")}</p>
            <p>Audience: {b.audience?.type?.toLowerCase()}</p>
            <p>Created by {name(b.createdBy)}</p>
            {b.approvedBy && <p>Approved by {name(b.approvedBy)}</p>}
            {b.publishedBy && <p>Published by {name(b.publishedBy)}</p>}
          </div>

          {b.status === "PUBLISHED" && a && (
            <div className="grid grid-cols-3 gap-2">
              <Metric label="Recipients" value={a.recipients} />
              <Metric label="Delivered" value={a.delivered} />
              <Metric label="Failed" value={a.failed} />
              <Metric label="Read" value={a.read} />
              <Metric label="Clicked" value={a.clicked} />
              <Metric label="Open rate" value={`${openRate}%`} />
            </div>
          )}

          {/* Workflow actions */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {(b.status === "DRAFT" || b.status === "REJECTED") && (
              <>
                <Action
                  onClick={() => onEdit(b._id)}
                  icon={<Eye size={14} />}
                  label="Edit"
                />
                <Action
                  onClick={() => run(() => submitBroadcast(b._id))}
                  icon={<Send size={14} />}
                  label="Submit"
                  busy={busy}
                />
              </>
            )}
            {b.status === "PENDING_APPROVAL" && (
              <>
                <Action
                  tone="green"
                  onClick={() => run(() => approveBroadcast(b._id))}
                  icon={<Check size={14} />}
                  label="Approve"
                  busy={busy}
                />
                <Action
                  tone="rose"
                  onClick={() => {
                    const r = prompt("Reason for rejection?");
                    if (r) run(() => rejectBroadcast(b._id, r));
                  }}
                  icon={<X size={14} />}
                  label="Reject"
                  busy={busy}
                />
              </>
            )}
            {(b.status === "APPROVED" || b.status === "SCHEDULED") && (
              <Action
                tone="fuchsia"
                onClick={() => run(() => publishBroadcast(b._id))}
                icon={<Rocket size={14} />}
                label="Publish now"
                busy={busy}
              />
            )}
            {["DRAFT", "SUBMITTED", "PENDING_APPROVAL", "APPROVED", "SCHEDULED"].includes(
              b.status
            ) && (
              <Action
                onClick={() => run(() => cancelBroadcast(b._id))}
                icon={<Ban size={14} />}
                label="Cancel"
                busy={busy}
              />
            )}
            {b.status === "PUBLISHED" && (
              <Action
                onClick={() => run(() => archiveBroadcast(b._id))}
                icon={<Archive size={14} />}
                label="Archive"
                busy={busy}
              />
            )}
            <Action
              tone="rose"
              onClick={() => {
                if (confirm("Delete this broadcast?"))
                  run(() => deleteBroadcast(b._id).then(onClose));
              }}
              icon={<Trash2 size={14} />}
              label="Delete"
              busy={busy}
            />
          </div>
        </div>
      )}
    </Drawer>
  );
}

function Metric({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2.5 text-center">
      <p className="text-lg font-semibold text-slate-900 dark:text-white">
        {value}
      </p>
      <p className="text-[10px] text-slate-500">{label}</p>
    </div>
  );
}

function Action({
  onClick,
  icon,
  label,
  tone = "slate",
  busy,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  tone?: "slate" | "green" | "rose" | "fuchsia";
  busy?: boolean;
}) {
  const tones: Record<string, string> = {
    slate:
      "border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200",
    green: "bg-emerald-600 hover:bg-emerald-700 text-white",
    rose: "bg-rose-600 hover:bg-rose-700 text-white",
    fuchsia: "bg-fuchsia-600 hover:bg-fuchsia-700 text-white",
  };
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg disabled:opacity-40 ${tones[tone]}`}
    >
      {icon} {label}
    </button>
  );
}

function name(u: any): string {
  if (!u) return "—";
  return `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.email || "—";
}
