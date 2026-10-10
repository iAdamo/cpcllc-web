"use client";

import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { IMAGE_ACCEPT, imageFileProblem } from "@/lib/broadcastPopup";

const input =
  "w-full text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 focus:outline-none focus:border-fuchsia-400";

/**
 * An image as a web address, typed or uploaded. The caller owns the upload
 * (`onUpload` returns the hosted url), so this stays free of the API client.
 */
export function ImageField({
  id,
  label,
  value,
  onChange,
  onUpload,
  hint,
  compact = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  onUpload: (file: File) => Promise<string>;
  hint?: string;
  /** No visible label (inside a slide row); the label still names it. */
  compact?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    const problem = imageFileProblem(file);
    if (problem) {
      setErr(problem);
      return;
    }
    setErr(null);
    setBusy(true);
    try {
      onChange(await onUpload(file));
    } catch (e) {
      setErr(e instanceof Error && e.message ? e.message : "Upload failed. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label
        htmlFor={id}
        className={compact ? "sr-only" : "text-[11px] text-slate-400"}
      >
        {label}
      </label>
      <div className={`${compact ? "" : "mt-1 "}flex gap-2`}>
        <input
          id={id}
          className={input}
          placeholder="https://… or upload"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <label
          className={`relative shrink-0 inline-flex items-center gap-1.5 text-xs px-3 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus-within:ring-2 focus-within:ring-fuchsia-400 ${
            busy ? "opacity-60 pointer-events-none" : "cursor-pointer"
          }`}
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {busy ? "Uploading…" : "Upload"}
          <input
            type="file"
            accept={IMAGE_ACCEPT}
            className="sr-only"
            aria-label={`Upload ${label.toLowerCase()}`}
            disabled={busy}
            onChange={(e) => {
              void pick(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      {err ? (
        <p role="alert" className="text-xs text-rose-600 mt-1">
          {err}
        </p>
      ) : hint ? (
        <p className="text-[11px] text-slate-400 mt-1">{hint}</p>
      ) : null}
    </div>
  );
}
