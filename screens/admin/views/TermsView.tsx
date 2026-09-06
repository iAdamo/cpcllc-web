"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ShieldCheck,
  FileText,
  CreditCard,
  AlertTriangle,
  Check,
  Loader2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { adminKeys } from "@/hooks/admin/adminQueryKeys";
import {
  getAdminTerms,
  publishTerms,
  type AdminTerms,
  type TermsType,
} from "@/axios/terms";

const TYPES: {
  type: TermsType;
  label: string;
  icon: typeof ShieldCheck;
  defaultUrl: string;
}[] = [
  {
    type: "privacy",
    label: "Privacy Policy",
    icon: ShieldCheck,
    defaultUrl: "https://companiescenter.com/privacy-policy",
  },
  {
    type: "service",
    label: "Terms of Service",
    icon: FileText,
    defaultUrl: "https://companiescenter.com/terms-of-service",
  },
  {
    type: "payments",
    label: "Payments Terms",
    icon: CreditCard,
    defaultUrl: "",
  },
];

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
}

export function TermsView() {
  const qc = useQueryClient();
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: adminKeys.terms,
    queryFn: getAdminTerms,
  });

  const byType = useMemo(() => {
    const m = new Map<TermsType, AdminTerms>();
    (data ?? []).forEach((t) => m.set(t.termsType, t));
    return m;
  }, [data]);

  const [type, setType] = useState<TermsType>("privacy");
  const [version, setVersion] = useState("");
  const [contentUrl, setContentUrl] = useState(TYPES[0].defaultUrl);
  const [confirming, setConfirming] = useState(false);

  const publish = useMutation({
    mutationFn: () => publishTerms({ termsType: type, version: version.trim(), contentUrl: contentUrl.trim() }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.terms });
      setConfirming(false);
      setVersion("");
    },
  });

  const selectType = (t: TermsType) => {
    setType(t);
    setContentUrl(TYPES.find((x) => x.type === t)?.defaultUrl ?? "");
    setConfirming(false);
    publish.reset();
  };

  const activeLabel = TYPES.find((x) => x.type === type)?.label ?? type;
  const canPublish = version.trim().length > 0 && contentUrl.trim().length > 0;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Terms &amp; Versions
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Publish a new version of a policy to require every user to re-accept
            it. The document text lives on the website; here you bump the version
            that users accept.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RefreshCw
            size={15}
            className={isFetching ? "animate-spin" : undefined}
          />
          Refresh
        </button>
      </div>

      {/* Current versions */}
      {isLoading ? (
        <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white p-8 text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          <Loader2 size={16} className="animate-spin" /> Loading current
          versions…
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          Could not load terms. Check that you are signed in as an admin, then
          Refresh.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {TYPES.map(({ type: t, label, icon: Icon }) => {
            const active = byType.get(t);
            return (
              <div
                key={t}
                className="rounded-xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                    <Icon size={17} />
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {label}
                  </span>
                </div>
                {active ? (
                  <>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                      {active.version}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Effective {fmtDate(active.effectiveFrom)}
                    </p>
                    <a
                      href={active.contentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline dark:text-brand-300"
                    >
                      View document <ExternalLink size={12} />
                    </a>
                  </>
                ) : (
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    Not published yet
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Publish new version */}
      <div className="mt-8 rounded-xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Publish a new version
        </h2>

        {/* Type selector */}
        <div className="mt-4 flex flex-wrap gap-2">
          {TYPES.map(({ type: t, label }) => (
            <button
              key={t}
              type="button"
              onClick={() => selectType(t)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                type === t
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              New version
            </span>
            <input
              value={version}
              onChange={(e) => {
                setVersion(e.target.value);
                setConfirming(false);
              }}
              placeholder="e.g. v1.1"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Content URL
            </span>
            <input
              value={contentUrl}
              onChange={(e) => {
                setContentUrl(e.target.value);
                setConfirming(false);
              }}
              placeholder="https://companiescenter.com/…"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </label>
        </div>

        {/* Warning */}
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          <span>
            Publishing sets this as the active {activeLabel} and invalidates
            every user&apos;s acceptance — all users will be prompted to re-accept
            on next app open. This cannot be undone (you would publish another
            version to change it).
          </span>
        </div>

        {publish.isError && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">
            Publish failed. Check the version and URL, then try again.
          </p>
        )}
        {publish.isSuccess && (
          <p className="mt-3 flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
            <Check size={15} /> Published. Users will re-accept on next open.
          </p>
        )}

        {/* Action */}
        <div className="mt-4 flex items-center justify-end gap-2">
          {confirming ? (
            <>
              <span className="mr-auto text-sm text-slate-600 dark:text-slate-300">
                Publish <strong>{version.trim()}</strong> of {activeLabel} for
                all users?
              </span>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={publish.isPending}
                onClick={() => publish.mutate()}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {publish.isPending && (
                  <Loader2 size={15} className="animate-spin" />
                )}
                Confirm publish
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={!canPublish}
              onClick={() => setConfirming(true)}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Publish new version
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
