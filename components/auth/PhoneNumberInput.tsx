"use client";

import { useMemo } from "react";

export type SupportedPhoneCountryCode = "US" | "NG";

export interface PhoneCountryOption {
  code: SupportedPhoneCountryCode;
  name: string;
  dialCode: string;
  // flag: string;
  maxLength: number;
  placeholder: string;
}

export const phoneCountryOptions: PhoneCountryOption[] = [
  {
    code: "US",
    name: "United States",
    dialCode: "+1",
    // flag: "🇺🇸",
    maxLength: 10,
    placeholder: "555 123 4567",
  },
  {
    code: "NG",
    name: "Nigeria",
    dialCode: "+234",
    // flag: "🇳🇬",
    maxLength: 10,
    placeholder: "801 234 5678",
  },
];

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  countryCode: SupportedPhoneCountryCode;
  onCountryChange: (value: SupportedPhoneCountryCode) => void;
  onBlur?: () => void;
  touched?: boolean;
  error?: boolean;
}

export default function PhoneNumberInput({
  value,
  onChange,
  countryCode,
  onCountryChange,
  onBlur,
  touched = false,
  error = false,
}: PhoneNumberInputProps) {
  const selectedCountry = useMemo(
    () =>
      phoneCountryOptions.find((option) => option.code === countryCode) ??
      phoneCountryOptions[0],
    [countryCode]
  );

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = event.target.value.replace(/\D/g, "");
    onChange(digitsOnly.slice(0, selectedCountry.maxLength));
  };

  return (
    <div className="space-y-2">
      <div
        className={`flex overflow-hidden rounded-xl border-2 transition-all outline-none focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 dark:focus-within:border-blue-500 ${
          touched && error
            ? "border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950/20"
            : touched && !error
            ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/20"
            : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
        }`}
      >
        <label className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          <select
            aria-label="Phone country"
            value={countryCode}
            onChange={(event) =>
              onCountryChange(event.target.value as SupportedPhoneCountryCode)
            }
            className="bg-transparent pr-1 outline-none"
          >
            {phoneCountryOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.code}
              </option>
            ))}
          </select>
        </label>
        <input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          value={value}
          onChange={handleNumberChange}
          onBlur={onBlur}
          className="w-full bg-transparent px-4 py-3 text-sm outline-none"
          placeholder={selectedCountry.placeholder}
        />
      </div>
      {/* <p className="text-xs text-slate-500 dark:text-slate-400">
        We currently support {phoneCountryOptions.map((option) => option.name).join(" and ")}.
      </p> */}
    </div>
  );
}
