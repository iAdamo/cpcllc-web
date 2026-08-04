"use client";

import { useEffect, useState } from "react";
import { Megaphone, Loader2, Smartphone, Apple } from "lucide-react";
import {
  getAdConfig,
  updateAdConfig,
  type AdMobConfig,
  type PlatformUnits,
} from "@/axios/ads";

const empty: AdMobConfig = {
  enabled: false,
  testMode: true,
  android: {},
  ios: {},
};

function errMsg(e: any, f: string) {
  return e?.appError?.message || e?.response?.data?.message || e?.message || f;
}

export function AdsView() {
  const [cfg, setCfg] = useState<AdMobConfig>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAdConfig()
      .then((c) => setCfg({ ...empty, ...c, android: c.android ?? {}, ios: c.ios ?? {} }))
      .catch((e) => setError(errMsg(e, "Failed to load AdMob config")))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const next = await updateAdConfig(cfg);
      setCfg({ ...empty, ...next, android: next.android ?? {}, ios: next.ios ?? {} });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(errMsg(e, "Failed to save"));
    } finally {
      setSaving(false);
    }
  };

  const setPlat = (os: "android" | "ios", k: keyof PlatformUnits, v: string) =>
    setCfg((c) => ({ ...c, [os]: { ...c[os], [k]: v } }));

  if (loading) return <p className="px-5 py-10 text-center text-slate-400 text-sm">Loading…</p>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300 flex items-center justify-center">
          <Megaphone size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Ads (AdMob)</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Control the in-app Google AdMob units from here — no app release needed.
          </p>
        </div>
      </div>

      {/* Master toggles */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4 space-y-3">
        <Toggle
          label="Ads enabled"
          hint="Master switch. Off = no ads shown in the app."
          value={cfg.enabled}
          onChange={(v) => setCfg((c) => ({ ...c, enabled: v }))}
        />
        <Toggle
          label={`Mode: ${cfg.testMode ? "Demo (test ads)" : "Live"}`}
          hint="Demo shows Google's test ads (safe, no revenue). Turn off for live units."
          value={cfg.testMode}
          onChange={(v) => setCfg((c) => ({ ...c, testMode: v }))}
        />
      </div>

      {/* Unit ids per platform */}
      <PlatformCard os="android" icon={<Smartphone size={16} />} units={cfg.android} onSet={setPlat} />
      <PlatformCard os="ios" icon={<Apple size={16} />} units={cfg.ios} onSet={setPlat} />

      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50"
        >
          {saving && <Loader2 size={15} className="animate-spin" />} Save config
        </button>
        {saved && <span className="text-sm text-emerald-600">Saved</span>}
      </div>
      <p className="text-xs text-slate-400">
        In Demo mode the app uses Google's test ad unit ids automatically, so
        these fields are only required for Live. The app reads this config on
        launch — changes take effect without shipping an update.
      </p>
    </div>
  );
}

function PlatformCard({
  os,
  icon,
  units,
  onSet,
}: {
  os: "android" | "ios";
  icon: React.ReactNode;
  units: PlatformUnits;
  onSet: (os: "android" | "ios", k: keyof PlatformUnits, v: string) => void;
}) {
  const fields: { k: keyof PlatformUnits; label: string; ph: string }[] = [
    { k: "appId", label: "App ID", ph: "ca-app-pub-…~…" },
    { k: "banner", label: "Banner unit", ph: "ca-app-pub-…/…" },
    { k: "interstitial", label: "Interstitial unit", ph: "ca-app-pub-…/…" },
    { k: "rewarded", label: "Rewarded unit", ph: "ca-app-pub-…/…" },
  ];
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 capitalize">
        {icon} {os}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map((f) => (
          <label key={f.k} className="block space-y-1">
            <span className="text-xs font-medium text-slate-500">{f.label}</span>
            <input
              value={units[f.k] ?? ""}
              onChange={(e) => onSet(os, f.k, e.target.value)}
              placeholder={f.ph}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
            />
          </label>
        ))}
      </div>
    </div>
  );
}

function Toggle({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
        <p className="text-xs text-slate-400">{hint}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
          value ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            value ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}
