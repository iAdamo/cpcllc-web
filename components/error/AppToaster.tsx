"use client";

import { useEffect } from "react";
import { useToastStore, type Toast, type ToastVariant } from "@/stores/toastStore";

const VARIANT_STYLES: Record<
  ToastVariant,
  { bar: string; icon: string; ring: string }
> = {
  success: {
    bar: "bg-emerald-500",
    ring: "ring-emerald-500/20",
    icon: "M20 6 9 17l-5-5",
  },
  error: {
    bar: "bg-red-500",
    ring: "ring-red-500/20",
    icon: "M18 6 6 18M6 6l12 12",
  },
  warning: {
    bar: "bg-amber-500",
    ring: "ring-amber-500/20",
    icon: "M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
  },
  info: {
    bar: "bg-blue-500",
    ring: "ring-blue-500/20",
    icon: "M12 16v-4m0-4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z",
  },
};

function ToastRow({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const style = VARIANT_STYLES[toast.variant];

  useEffect(() => {
    const t = setTimeout(() => dismiss(toast.id), toast.durationMs);
    return () => clearTimeout(t);
  }, [toast.id, toast.durationMs, dismiss]);

  return (
    <div
      role={toast.variant === "error" ? "alert" : "status"}
      className={`pointer-events-auto flex w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-lg ring-1 ${style.ring} dark:bg-neutral-900 dark:ring-white/10 animate-[toastIn_180ms_ease-out]`}
    >
      <div className={`w-1.5 shrink-0 ${style.bar}`} />
      <div className="flex flex-1 items-start gap-3 p-3.5">
        <svg
          className={`mt-0.5 h-5 w-5 shrink-0 text-white rounded-full p-0.5 ${style.bar}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={style.icon} />
        </svg>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {toast.title}
          </p>
          {toast.message ? (
            <p className="mt-0.5 text-sm text-gray-600 dark:text-neutral-300 break-words">
              {toast.message}
            </p>
          ) : null}
          {toast.action ? (
            <button
              type="button"
              onClick={() => {
                toast.action?.onPress();
                dismiss(toast.id);
              }}
              className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {toast.action.label}
            </button>
          ) : null}
          {toast.reference ? (
            <p className="mt-1.5 font-mono text-[10px] text-gray-400 dark:text-neutral-500">
              Ref: {toast.reference.slice(0, 8)}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => dismiss(toast.id)}
          aria-label="Dismiss"
          className="ml-1 shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/**
 * The single toast surface for the whole web app. Mount once at the root.
 * Fixed top-right on desktop, full-width top on mobile.
 */
export function AppToaster() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <>
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(-8px) scale(.98)}to{opacity:1;transform:none}}`}</style>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[9999] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end">
        {toasts.map((toast) => (
          <ToastRow key={toast.id} toast={toast} />
        ))}
      </div>
    </>
  );
}

export default AppToaster;
