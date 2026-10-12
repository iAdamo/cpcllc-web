"use client";

import { US_DIAL_CODE, US_LOCAL_DIGITS } from "@/utils/phone";

interface PhoneNumberInputProps {
  /** The ten local digits after +1. */
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  touched?: boolean;
  error?: boolean;
}

/** A US phone number: +1 shown in front, ten digits typed after it. */
export default function PhoneNumberInput({
  value,
  onChange,
  onBlur,
  touched = false,
  error = false,
}: PhoneNumberInputProps) {
  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = event.target.value.replace(/\D/g, "");
    onChange(digitsOnly.slice(0, US_LOCAL_DIGITS));
  };

  return (
    <div className="space-y-2">
      <div
        className={`flex overflow-hidden rounded-xl border-2 transition-all outline-none focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/20 dark:focus-within:border-brand-500 ${
          touched && error
            ? "border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950/20"
            : touched && !error
            ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/20"
            : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
        }`}
      >
        <span
          aria-hidden="true"
          className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          {US_DIAL_CODE}
        </span>
        <input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          required
          value={value}
          onChange={handleNumberChange}
          onBlur={onBlur}
          className="w-full bg-transparent px-4 py-3 text-sm outline-none"
          placeholder="555 123 4567"
        />
      </div>
    </div>
  );
}
