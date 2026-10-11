"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { notify } from "@/lib/notify";
import { useAdminAppConfig, useSaveContact } from "@/hooks/admin/useAppConfig";
import { MAX_ADDRESS_LINES, contactProblems, shownContact, type ContactDetails } from "@/lib/contact";

type Form = { email: string; phone: string; address: string };

const toForm = (c: ContactDetails): Form => ({ email: c.email, phone: c.phone, address: c.address.join("\n") });
const fromForm = (f: Form): ContactDetails => ({
  email: f.email.trim(),
  phone: f.phone.trim(),
  address: f.address
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean),
});

const FIELDS = ["email", "phone", "address"] as const;
const INPUT =
  "mt-1.5 w-full rounded-lg border bg-white dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand-500/30";

/**
 * The contact email, phone and postal address shown in the website footer and
 * /contact, the app's Customer Support screen, and the emails ("Questions?",
 * footer address, account-block messages). One save changes them all; no
 * deploy or app release. Saving needs app_config:write (the API checks).
 */
export function ContactDetailsSection() {
  const config = useAdminAppConfig();
  const save = useSaveContact();
  const [form, setForm] = useState<Form>(() => toForm(shownContact(config.data?.contact)));
  const [saved, setSaved] = useState<Form>(form);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});

  // Load what is stored into the form once it arrives (and after a save).
  useEffect(() => {
    if (!config.data) return;
    const next = toForm(shownContact(config.data.contact));
    setForm(next);
    setSaved(next);
  }, [config.data]);

  const changed = FIELDS.some((f) => form[f].trim() !== saved[f].trim());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const details = fromForm(form);
    const found = contactProblems(details);
    setErrors(found);
    const first = FIELDS.find((f) => found[f]);
    if (first) {
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    save.mutate(details, {
      onSuccess: () =>
        notify.success("The website, the app and new emails show the new details. Update the Privacy Policy (section 35) too.", {
          title: "Contact details saved",
        }),
      onError: (err) => notify.error(err, { title: "Couldn't save the contact details", module: "admin", feature: "contact-details" }),
    });
  };

  if (config.isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500 py-6" role="status">
        <Loader2 size={16} className="animate-spin" aria-hidden /> Loading the contact details…
      </div>
    );
  }
  if (config.isError) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
        <span>Couldn&apos;t load the contact details.</span>
        <button type="button" onClick={() => config.refetch()} className="inline-flex items-center gap-1.5 font-medium hover:underline">
          <RefreshCw size={14} aria-hidden /> Try again
        </button>
      </div>
    );
  }

  const field = (key: keyof Form, label: string, input: React.ReactNode, hint?: string) => (
    <div>
      <label htmlFor={`contact-${key}`} className="text-sm font-medium text-slate-800 dark:text-slate-100">
        {label}
      </label>
      {input}
      {errors[key] ? (
        <p id={`contact-${key}-error`} role="alert" className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
          {errors[key]}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
  const bind = (key: keyof Form) => ({
    id: `contact-${key}`,
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const v = e.target.value;
      setForm((f) => ({ ...f, [key]: v }));
      if (errors[key]) setErrors((x) => ({ ...x, [key]: undefined }));
    },
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `contact-${key}-error` : undefined,
  });
  const border = (key: keyof Form) => (errors[key] ? "border-rose-400" : "border-slate-200 dark:border-slate-700");

  return (
    <form onSubmit={submit} noValidate className="space-y-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="grid gap-4 md:grid-cols-2">
        {field("email", "Email", <input type="email" inputMode="email" {...bind("email")} className={`${INPUT} h-10 ${border("email")}`} />)}
        {field(
          "phone",
          "Phone",
          <input type="tel" inputMode="tel" {...bind("phone")} className={`${INPUT} h-10 ${border("phone")}`} />,
          "Leave empty to hide the phone.",
        )}
      </div>
      {field(
        "address",
        "Postal address",
        <textarea rows={MAX_ADDRESS_LINES} {...bind("address")} className={`${INPUT} py-2 ${border("address")}`} />,
        `One line per row, up to ${MAX_ADDRESS_LINES}. It is also the postal address in every marketing email.`,
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500 max-w-md">
          The Privacy Policy (section 35) lists these too. After a change, update it and publish the new version.
        </p>
        <button
          type="submit"
          disabled={!changed || save.isPending}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium disabled:opacity-50"
        >
          {save.isPending ? <Loader2 size={15} className="animate-spin" aria-hidden /> : null}
          Save contact details
        </button>
      </div>
    </form>
  );
}
