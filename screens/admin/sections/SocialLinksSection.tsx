"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { notify } from "@/lib/notify";
import { useAdminAppConfig, useSaveSocialLinks } from "@/hooks/admin/useAppConfig";
import SocialIcon from "@/components/SocialIcon";
import {
  SOCIAL_META,
  SOCIAL_PLATFORMS,
  socialLinkProblem,
  type SocialLinks,
  type SocialPlatform,
} from "@/lib/socialLinks";

const blank = (): Record<SocialPlatform, string> =>
  Object.fromEntries(SOCIAL_PLATFORMS.map((p) => [p, ""])) as Record<SocialPlatform, string>;

/**
 * Companies Center's social media pages, shown in the website footer and the
 * app's Customer Support screen. Saving needs the app_config:write permission
 * (the API checks). An empty field hides that platform.
 */
export function SocialLinksSection() {
  const config = useAdminAppConfig();
  const save = useSaveSocialLinks();
  const [links, setLinks] = useState(blank);
  const [saved, setSaved] = useState(blank);
  const [errors, setErrors] = useState<Partial<Record<SocialPlatform, string>>>({});

  // Load what is stored into the form once it arrives (and after a save).
  useEffect(() => {
    const stored: SocialLinks = config.data?.socialLinks ?? {};
    const next = { ...blank(), ...stored } as Record<SocialPlatform, string>;
    setLinks(next);
    setSaved(next);
  }, [config.data]);

  const changed = SOCIAL_PLATFORMS.some((p) => links[p].trim() !== saved[p].trim());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const found: Partial<Record<SocialPlatform, string>> = {};
    for (const p of SOCIAL_PLATFORMS) {
      const problem = socialLinkProblem(p, links[p]);
      if (problem) found[p] = problem;
    }
    setErrors(found);
    const first = SOCIAL_PLATFORMS.find((p) => found[p]);
    if (first) {
      document.getElementById(`social-${first}`)?.focus();
      return;
    }
    const payload = Object.fromEntries(SOCIAL_PLATFORMS.map((p) => [p, links[p].trim()])) as SocialLinks;
    save.mutate(payload, {
      onSuccess: () => notify.success("The footer and the app show the new links.", { title: "Social links saved" }),
      onError: (err) => notify.error(err, { title: "Couldn't save the social links", module: "admin", feature: "social-links" }),
    });
  };

  if (config.isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500 py-6" role="status">
        <Loader2 size={16} className="animate-spin" aria-hidden /> Loading the social links…
      </div>
    );
  }
  if (config.isError) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
        <span>Couldn&apos;t load the social links.</span>
        <button type="button" onClick={() => config.refetch()} className="inline-flex items-center gap-1.5 font-medium hover:underline">
          <RefreshCw size={14} aria-hidden /> Try again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="grid gap-4 md:grid-cols-2">
        {SOCIAL_PLATFORMS.map((p) => {
          const error = errors[p];
          return (
            <div key={p}>
              <label htmlFor={`social-${p}`} className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                <span className="text-slate-500 dark:text-slate-400">
                  <SocialIcon platform={p} size={16} />
                </span>
                {SOCIAL_META[p].label}
              </label>
              <input
                id={`social-${p}`}
                type="url"
                inputMode="url"
                value={links[p]}
                placeholder={SOCIAL_META[p].example}
                onChange={(e) => {
                  const v = e.target.value;
                  setLinks((l) => ({ ...l, [p]: v }));
                  if (error) setErrors((x) => ({ ...x, [p]: undefined }));
                }}
                aria-invalid={!!error}
                aria-describedby={error ? `social-${p}-error` : undefined}
                className={`mt-1.5 h-10 w-full rounded-lg border bg-white dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand-500/30 ${
                  error ? "border-rose-400" : "border-slate-200 dark:border-slate-700"
                }`}
              />
              {error ? (
                <p id={`social-${p}-error`} role="alert" className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">Leave a field empty to hide that platform.</p>
        <button
          type="submit"
          disabled={!changed || save.isPending}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium disabled:opacity-50"
        >
          {save.isPending ? <Loader2 size={15} className="animate-spin" aria-hidden /> : null}
          Save social links
        </button>
      </div>
    </form>
  );
}
