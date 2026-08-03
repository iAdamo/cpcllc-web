"use client";

import { useEffect, useState } from "react";
import { Megaphone, Plus, Pencil, Trash2, X, Loader2, Power } from "lucide-react";
import {
  listAds,
  getAdsMode,
  setAdsMode,
  createAd,
  updateAd,
  toggleAd,
  deleteAd,
  type Ad,
  type AdMode,
} from "@/axios/ads";

const PLACEMENTS = ["home_banner", "home_inline", "search_top", "sidebar"];
const MODES: { key: AdMode; label: string; hint: string }[] = [
  { key: "off", label: "Off", hint: "No ads shown anywhere" },
  { key: "demo", label: "Demo", hint: "Show ads flagged as demo" },
  { key: "live", label: "Live", hint: "Show ads flagged as live" },
];

type Form = {
  title: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaUrl: string;
  placement: string;
  mode: "demo" | "live";
  order: string;
};
const empty: Form = {
  title: "",
  description: "",
  image: "",
  ctaLabel: "",
  ctaUrl: "",
  placement: "home_banner",
  mode: "demo",
  order: "0",
};

function errMsg(e: any, f: string) {
  return e?.appError?.message || e?.response?.data?.message || e?.message || f;
}

export function AdsView() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [mode, setMode] = useState<AdMode>("off");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Ad | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const [a, m] = await Promise.all([listAds(), getAdsMode()]);
      setAds(a);
      setMode(m.mode);
    } catch (e) {
      setError(errMsg(e, "Failed to load ads"));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refresh();
  }, []);

  const changeMode = async (m: AdMode) => {
    setMode(m);
    await setAdsMode(m).catch((e) => setError(errMsg(e, "Failed to set mode")));
  };

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setError(null);
    setOpen(true);
  };
  const openEdit = (a: Ad) => {
    setEditing(a);
    setForm({
      title: a.title,
      description: a.description ?? "",
      image: a.image ?? "",
      ctaLabel: a.ctaLabel ?? "",
      ctaUrl: a.ctaUrl ?? "",
      placement: a.placement,
      mode: a.mode,
      order: String(a.order ?? 0),
    });
    setError(null);
    setOpen(true);
  };
  const save = async () => {
    if (!form.title.trim()) return setError("Title is required");
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        image: form.image.trim() || undefined,
        ctaLabel: form.ctaLabel.trim() || undefined,
        ctaUrl: form.ctaUrl.trim() || undefined,
        placement: form.placement,
        mode: form.mode,
        order: Number(form.order) || 0,
      };
      if (editing) await updateAd(editing._id, payload);
      else await createAd(payload);
      setOpen(false);
      await refresh();
    } catch (e) {
      setError(errMsg(e, "Failed to save the ad"));
    } finally {
      setSaving(false);
    }
  };
  const onToggle = async (a: Ad) => {
    await toggleAd(a._id).catch(() => {});
    refresh();
  };
  const onDelete = async (a: Ad) => {
    if (!confirm(`Delete ad "${a.title}"?`)) return;
    await deleteAd(a._id).catch((e) => alert(errMsg(e, "Delete failed")));
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300 flex items-center justify-center">
            <Megaphone size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Ads</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage ad creatives and choose what shows across the app and site.
            </p>
          </div>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
        >
          <Plus size={16} /> New ad
        </button>
      </div>

      {/* Global mode */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2.5">
          Ad mode — what's shown to users right now
        </p>
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => changeMode(m.key)}
              className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                mode === m.key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400"
              }`}
              title={m.hint}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {MODES.find((m) => m.key === mode)?.hint}
        </p>
      </div>

      {loading && <p className="px-5 py-8 text-center text-slate-400 text-sm">Loading…</p>}
      {!loading && ads.length === 0 && (
        <div className="px-5 py-12 text-center text-slate-400 text-sm border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          No ads yet. Create your first one.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ads.map((a) => (
          <div
            key={a._id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            <div
              className="h-24 bg-slate-100 dark:bg-slate-800 bg-cover bg-center"
              style={{
                backgroundImage: a.image ? `url(${a.image})` : undefined,
                backgroundColor: a.backgroundColor || undefined,
              }}
            />
            <div className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {a.title}
                  </p>
                  {a.description && (
                    <p className="text-xs text-slate-500 truncate">{a.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => onToggle(a)}
                    title={a.isActive ? "Active" : "Paused"}
                    className={`p-1.5 rounded-md ${
                      a.isActive
                        ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
                        : "text-slate-400 bg-slate-100 dark:bg-slate-800"
                    }`}
                  >
                    <Power size={14} />
                  </button>
                  <button onClick={() => openEdit(a)} className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => onDelete(a)} className="p-1.5 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Tag>{a.placement}</Tag>
                <Tag tone={a.mode === "live" ? "green" : "amber"}>{a.mode}</Tag>
                <Tag>#{a.order}</Tag>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <p className="font-semibold text-slate-900 dark:text-white">{editing ? "Edit ad" : "New ad"}</p>
              <button onClick={() => setOpen(false)} className="p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              <F label="Title"><input autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inp} /></F>
              <F label="Description"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inp} h-16 resize-none`} /></F>
              <F label="Image URL"><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inp} placeholder="https://…" /></F>
              <div className="grid grid-cols-2 gap-3">
                <F label="CTA label"><input value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} className={inp} /></F>
                <F label="CTA URL"><input value={form.ctaUrl} onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })} className={inp} /></F>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <F label="Placement">
                  <select value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value })} className={inp}>
                    {PLACEMENTS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </F>
                <F label="Mode">
                  <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value as "demo" | "live" })} className={inp}>
                    <option value="demo">demo</option>
                    <option value="live">live</option>
                  </select>
                </F>
                <F label="Order"><input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className={inp} /></F>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={() => setOpen(false)} disabled={saving} className="px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button>
                <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50">
                  {saving && <Loader2 size={15} className="animate-spin" />} Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inp =
  "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500";

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      {children}
    </label>
  );
}
function Tag({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "green" | "amber" }) {
  const tones: Record<string, string> = {
    slate: "bg-slate-100 dark:bg-slate-800 text-slate-500",
    green: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600",
    amber: "bg-amber-100 dark:bg-amber-950/40 text-amber-600",
  };
  return <span className={`text-[10px] px-1.5 py-0.5 rounded ${tones[tone]}`}>{children}</span>;
}
