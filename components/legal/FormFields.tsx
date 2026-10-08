"use client";

import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";

/**
 * Fields for the public request forms (/privacy-request, /dmca). Every
 * control has its own label; an error is tied to its control
 * (aria-describedby) and announced. Only one form is on screen at a time,
 * so no two controls share a name.
 */

const inputClass = (invalid: boolean) =>
  `w-full rounded-lg border px-3 text-sm outline-none transition-colors bg-white dark:bg-gray-950 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500/30 ${
    invalid
      ? "border-rose-400 focus:border-rose-500"
      : "border-gray-200 dark:border-gray-700 focus:border-brand-500"
  }`;

export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
      {error}
    </p>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  type = "text",
  autoComplete,
  required,
  maxLength,
  placeholder,
}: TextFieldProps) {
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ");
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-800 dark:text-gray-100">
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {hint}
        </p>
      ) : null}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-required={required}
        aria-describedby={describedBy || undefined}
        className={`mt-1.5 h-11 ${inputClass(!!error)}`}
      />
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

export function TextArea({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  required,
  rows = 4,
  maxLength = 5000,
  placeholder,
}: Omit<TextFieldProps, "type" | "autoComplete"> & { rows?: number }) {
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ");
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-800 dark:text-gray-100">
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {hint}
        </p>
      ) : null}
      <textarea
        id={id}
        value={value}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-required={required}
        aria-describedby={describedBy || undefined}
        className={`mt-1.5 py-2.5 ${inputClass(!!error)}`}
      />
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-800 dark:text-gray-100">
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-required={required}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-1.5 h-11 ${inputClass(!!error)}`}
      >
        {children}
      </select>
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

export function CheckField({
  id,
  checked,
  onChange,
  error,
  children,
  hint,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  children: ReactNode;
  hint?: string;
}) {
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ");
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-brand-700 focus:ring-brand-500"
        />
        <label htmlFor={id} className="text-sm text-gray-700 dark:text-gray-200">
          {children}
          {hint ? (
            <span id={`${id}-hint`} className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
              {hint}
            </span>
          ) : null}
        </label>
      </div>
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

/** Two or more choices, one picked (who is filing, where they live). */
export function ChoiceGroup<T extends string>({
  name,
  legend,
  value,
  onChange,
  options,
  error,
}: {
  name: string;
  legend: string;
  value: T | "";
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  error?: string;
}) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="text-sm font-semibold text-gray-800 dark:text-gray-100">
        {legend}
        <span className="text-rose-500"> *</span>
      </legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => {
          const id = `${name}-${o.value}`;
          const on = value === o.value;
          return (
            <label
              key={o.value}
              htmlFor={id}
              className={`cursor-pointer rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
                on
                  ? "border-brand-600 bg-brand-50 text-brand-800 dark:border-gold-400 dark:bg-brand-950/40 dark:text-gold-300"
                  : "border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:text-gray-200"
              }`}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={o.value}
                checked={on}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {o.label}
            </label>
          );
        })}
      </div>
      <FieldError id={`${name}-error`} error={error} />
    </fieldset>
  );
}

/** After filing: the reference, and what happens next. */
export function Filed({
  title,
  reference,
  children,
  onAnother,
  anotherLabel,
}: {
  title: string;
  reference: string;
  children: ReactNode;
  onAnother: () => void;
  anotherLabel: string;
}) {
  return (
    <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/30">
      <div className="flex items-start gap-3">
        <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
        <div className="min-w-0 space-y-3 text-sm text-gray-700 dark:text-gray-200">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          <p>
            Your reference is{" "}
            <span className="rounded bg-white px-1.5 py-0.5 font-mono font-bold text-gray-900 dark:bg-gray-900 dark:text-white">
              {reference}
            </span>
            . We are also sending it to you by email.
          </p>
          {children}
          <button
            type="button"
            onClick={onAnother}
            className="font-semibold text-brand-700 hover:underline dark:text-gold-400"
          >
            {anotherLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-900 px-6 text-sm font-bold text-white transition-colors hover:bg-brand-800 disabled:opacity-60 dark:bg-gold-500 dark:text-brand-950 dark:hover:bg-gold-400"
    >
      {pending ? "Sending…" : children}
    </button>
  );
}

/** Tabs that keep only one form mounted. */
export function FormTabs<T extends string>({
  label,
  tabs,
  active,
  onChange,
}: {
  label: string;
  tabs: { value: T; label: string }[];
  active: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
      {tabs.map((t) => (
        <button
          key={t.value}
          type="button"
          role="tab"
          id={`tab-${t.value}`}
          aria-selected={active === t.value}
          aria-controls={`panel-${t.value}`}
          onClick={() => onChange(t.value)}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
            active === t.value
              ? "bg-white text-gray-900 shadow-sm dark:bg-gray-950 dark:text-white"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
