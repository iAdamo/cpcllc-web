"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Scale, ArrowLeft, Loader2 } from "lucide-react";
import useGlobalStore from "@/stores";
import { getTermsStatus, decideTerms } from "@/axios/terms";
import { notify } from "@/lib/notify";
import { safeNextPath } from "@/lib/safeNext";
import {
  LEGAL_END_ATTR,
  TERMS_DOCS,
  orderRequired,
  reachedEnd,
  termsPageFor,
  type RequiredTerms,
  type ShownTermsType,
} from "@/lib/terms";

const ICONS = { privacy: Shield, service: Scale } as const;

/**
 * The website's Terms and Privacy acceptance, the same as the app: each
 * current policy the account hasn't accepted, Privacy first, shown in full;
 * Accept unlocks at the end of the document; Decline signs out. Only the
 * person's own decision is recorded (platform "web"). Reached after email
 * verification, or whenever the API answers TERMS_NOT_ACCEPTED (axios/conf).
 */
export default function TermsAcceptancePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"));
  const logout = useGlobalStore((s) => s.logout);

  const [required, setRequired] = useState<
    Array<RequiredTerms & { termsType: ShownTermsType }> | null
  >(null);
  const [index, setIndex] = useState(0);
  // Per document, so "read" can't carry from one policy to the next.
  const [readTypes, setReadTypes] = useState<ReadonlySet<ShownTermsType>>(
    () => new Set(),
  );
  const [saving, setSaving] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const stopWatching = useRef<(() => void) | null>(null);

  useEffect(() => {
    getTermsStatus()
      .then((s) => {
        const docs = orderRequired(s.requiredTerms);
        if (s.ok || docs.length === 0) router.replace(next);
        else setRequired(docs);
      })
      .catch((error) => {
        // Not signed in (or the session ended): sign in first, then come back.
        if (error?.response?.status === 401) {
          router.replace(
            `/auth/signin?next=${encodeURIComponent(termsPageFor(next))}`,
          );
        } else {
          notify.error(error, { module: "auth", feature: "terms-status" });
        }
      });
  }, [next, router]);

  const current = required?.[index];
  const doc = current ? TERMS_DOCS[current.termsType] : null;
  const Icon = current ? ICONS[current.termsType] : Shield;

  // "Read to the end": the policy is on this site, so its frame is readable.
  // The frame loads an empty shell and the text arrives after hydration, so
  // watch for the end marker to appear, then to scroll into view.
  const watchFrame = useCallback((termsType: ShownTermsType) => {
    stopWatching.current?.();
    const win = frameRef.current?.contentWindow;
    const frameDoc = win?.document;
    if (!win || !frameDoc) return;
    const check = () => {
      const end = frameDoc.querySelector(`[${LEGAL_END_ATTR}]`);
      if (!reachedEnd(end?.getBoundingClientRect().top ?? null, win.innerHeight)) return;
      setReadTypes((prev) => new Set(prev).add(termsType));
      stop();
    };
    const observer = new MutationObserver(check);
    const stop = () => {
      observer.disconnect();
      frameDoc.removeEventListener("scroll", check, { capture: true });
      win.removeEventListener("resize", check);
      stopWatching.current = null;
    };
    observer.observe(frameDoc.documentElement, { childList: true, subtree: true });
    frameDoc.addEventListener("scroll", check, { capture: true, passive: true });
    win.addEventListener("resize", check);
    stopWatching.current = stop;
    check();
  }, []);

  useEffect(() => () => stopWatching.current?.(), []);

  const accept = async () => {
    if (!required) return;
    if (index < required.length - 1) {
      setIndex((i) => i + 1);
      return;
    }
    setSaving(true);
    try {
      await decideTerms(
        required.map((t) => ({ termsType: t.termsType, status: "accepted" })),
      );
      router.replace(next);
    } catch (error) {
      notify.error(error, {
        title: "Couldn't save your acceptance",
        module: "auth",
        feature: "accept-terms",
      });
    } finally {
      setSaving(false);
    }
  };

  const decline = async () => {
    await logout();
    router.replace("/auth/signin");
  };

  if (!required || !current || !doc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-brand-600" aria-label="Loading" />
      </div>
    );
  }

  const read = readTypes.has(current.termsType);
  const last = index === required.length - 1;
  const effective = current.effectiveFrom
    ? new Date(current.effectiveFrom).toLocaleDateString()
    : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          {index > 0 && (
            <button
              type="button"
              onClick={() => setIndex((i) => i - 1)}
              aria-label="Back to the previous document"
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="w-11 h-11 rounded-xl bg-brand-600/10 text-brand-600 flex items-center justify-center">
            <Icon size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
              {doc.title}
            </h1>
            <p className="text-xs text-slate-500">
              Version {current.version}
              {effective ? ` · Effective ${effective}` : ""}
            </p>
          </div>
          {required.length > 1 && (
            <span className="text-xs text-slate-500">
              {index + 1} of {required.length}
            </span>
          )}
        </div>

        {/* The document itself */}
        <iframe
          key={current.termsType}
          ref={frameRef}
          src={`${doc.path}?embedded=1`}
          title={doc.title}
          onLoad={() => watchFrame(current.termsType)}
          className="w-full h-[60vh] bg-white"
        />

        {/* Decision */}
        <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          {!read && (
            <p className="text-xs text-slate-500 text-center">
              Scroll to the end of the {doc.title} to continue.
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={index === 0 ? decline : () => setIndex((i) => i - 1)}
              disabled={saving}
              className="flex-1 h-11 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 disabled:opacity-50"
            >
              {index === 0 ? "Decline" : "Back"}
            </button>
            <button
              type="button"
              onClick={accept}
              disabled={!read || saving}
              className="flex-1 h-11 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : last ? (
                "Accept & Continue"
              ) : (
                "Accept & Next"
              )}
            </button>
          </div>
          {index === 0 && (
            <p className="text-[11px] text-slate-400 text-center">
              Declining signs you out. You can&apos;t use your account until you
              accept the current Privacy Policy and Terms of Service.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
