"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { notify } from "@/lib/notify";
import { useAdminAppConfig, useSaveAppRelease } from "@/hooks/admin/useAppConfig";
import {
  APPLE_EXAMPLE,
  PLAY_EXAMPLE,
  RELEASE_LABELS,
  STORE_LINK_FIELDS,
  VERSION_FIELDS,
  compareVersions,
  releaseProblems,
  type StoreLinkField,
  type VersionField,
} from "@/lib/appRelease";

type Field = StoreLinkField | VersionField;
const FIELDS: Field[] = [...STORE_LINK_FIELDS, ...VERSION_FIELDS];
const blank = () => Object.fromEntries(FIELDS.map((f) => [f, ""])) as Record<Field, string>;

const PLATFORMS = [
  { name: "iPhone", store: "iosStoreUrl", min: "minVersionIOS", latest: "latestVersionIOS", storeName: "App Store" },
  { name: "Android", store: "androidStoreUrl", min: "minVersionAndroid", latest: "latestVersionAndroid", storeName: "Google Play" },
] as const;

/**
 * The app's store pages and version numbers. A store link shows that store's
 * button on the website and is where the app's update screens send people;
 * leave it empty until the app is live there. Saving needs app_config:write
 * (the API checks, and says what's wrong).
 */
export function AppReleaseSection() {
  const config = useAdminAppConfig();
  const save = useSaveAppRelease();
  const [form, setForm] = useState(blank);
  const [saved, setSaved] = useState(blank);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  useEffect(() => {
    const data = (config.data ?? {}) as Partial<Record<Field, string>>;
    const next = Object.fromEntries(FIELDS.map((f) => [f, data[f] ?? ""])) as Record<Field, string>;
    setForm(next);
    setSaved(next);
  }, [config.data]);

  const changed = FIELDS.some((f) => form[f].trim() !== saved[f].trim());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = releaseProblems(form);
    setErrors(found);
    const first = FIELDS.find((f) => found[f]);
    if (first) {
      document.getElementById(`release-${first}`)?.focus();
      return;
    }
    const payload = Object.fromEntries(FIELDS.map((f) => [f, form[f].trim()]));
    save.mutate(payload, {
      onSuccess: () =>
        notify.success("Store buttons and the app's update checks use these now.", { title: "App release saved" }),
      onError: (err) => notify.error(err, { title: "Couldn't save the app release", module: "admin", feature: "app-release" }),
    });
  };

  if (config.isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500 py-6" role="status">
        <Loader2 size={16} className="animate-spin" aria-hidden /> Loading the app release…
      </div>
    );
  }
  if (config.isError) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
        <span>Couldn&apos;t load the app release.</span>
        <button type="button" onClick={() => config.refetch()} className="inline-flex items-center gap-1.5 font-medium hover:underline">
          <RefreshCw size={14} aria-hidden /> Try again
        </button>
      </div>
    );
  }

  const input = (f: Field, placeholder: string, inputMode: "url" | "decimal") => {
    const error = errors[f];
    return (
      <div key={f}>
        <label htmlFor={`release-${f}`} className="block text-sm font-medium text-slate-800 dark:text-slate-100">
          {RELEASE_LABELS[f]}
        </label>
        <input
          id={`release-${f}`}
          type={inputMode === "url" ? "url" : "text"}
          inputMode={inputMode}
          value={form[f]}
          placeholder={placeholder}
          onChange={(e) => {
            const v = e.target.value;
            setForm((x) => ({ ...x, [f]: v }));
            if (error) setErrors((x) => ({ ...x, [f]: undefined }));
          }}
          aria-invalid={!!error}
          aria-describedby={error ? `release-${f}-error` : undefined}
          className={`mt-1.5 h-10 w-full rounded-lg border bg-white dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand-500/30 tabular-nums ${
            error ? "border-rose-400" : "border-slate-200 dark:border-slate-700"
          }`}
        />
        {error ? (
          <p id={`release-${f}-error`} role="alert" className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
            {error}
          </p>
        ) : null}
      </div>
    );
  };

  // Raising a minimum sends people to the store; say so when there's no link.
  const stranded = PLATFORMS.filter(
    (p) =>
      !form[p.store].trim() &&
      form[p.min].trim() &&
      saved[p.min].trim() &&
      compareVersions(form[p.min].trim(), saved[p.min].trim()) > 0,
  );

  return (
    <form onSubmit={submit} noValidate className="space-y-5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-slate-900 dark:text-white">Store links</legend>
        <p className="text-xs text-slate-500">
          Leave a link empty until the app is live in that store: the website shows a store&apos;s button only once its
          link is set.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {input("iosStoreUrl", APPLE_EXAMPLE, "url")}
          {input("androidStoreUrl", PLAY_EXAMPLE, "url")}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-slate-900 dark:text-white">Versions</legend>
        <p className="text-xs text-slate-500">
          Below the minimum, the app asks people to update before they can use it. Below the latest, it offers an update.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {PLATFORMS.map((p) => (
            <div key={p.name} className="grid grid-cols-2 gap-3">
              {input(p.min, "1.0.0", "decimal")}
              {input(p.latest, "1.0.0", "decimal")}
            </div>
          ))}
        </div>
      </fieldset>

      {stranded.length ? (
        <p role="status" className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" aria-hidden />
          {stranded
            .map((p) => `${p.name} users below ${form[p.min].trim()} will be asked to update, but there's no ${p.storeName} link to send them to.`)
            .join(" ")}
        </p>
      ) : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!changed || save.isPending}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium disabled:opacity-50"
        >
          {save.isPending ? <Loader2 size={15} className="animate-spin" aria-hidden /> : null}
          Save app release
        </button>
      </div>
    </form>
  );
}
