"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { PanelCard } from "@/components/admin/PanelCard";
import { CheckField, ChoiceGroup, SelectField, TextArea, TextField } from "@/components/legal/FormFields";
import { useRecordLegalRequest } from "@/hooks/admin/useLegalRequests";
import { notify } from "@/lib/notify";
import {
  KIND_LABELS,
  RIGHT_OPTIONS,
  emptyRecordForm,
  isoDay,
  recordPayload,
  type FieldErrors,
  type LegalRequestDetail,
  type LegalRequestKind,
  type PrivacyRight,
  type RecordForm,
} from "@/lib/legalRequests";

export const RECORD_KINDS: LegalRequestKind[] = [
  "privacy",
  "appeal",
  "copyright",
  "counter_notice",
  "dispute_notice",
  "arbitration_opt_out",
  "legal_notice",
];

/**
 * Record a request or notice that came by email or post (POST
 * admin/legal-requests), so it is worked, kept and counted like one filed
 * on the website. The Terms accept a Notice of Dispute and an arbitration
 * opt-out by email or post, from the person or someone they authorise
 * (Sections 39.2, 39.11); an opt-out's 30 days count from the day it was
 * sent or postmarked. Field ids start "rec-" so none clash with the
 * request panel's.
 */
export function RecordRequestForm({
  onRecorded,
  onCancel,
  initial,
  today = isoDay(new Date()),
}: {
  onRecorded: (doc: LegalRequestDetail) => void;
  onCancel: () => void;
  /** A filled-in form, for tests. */
  initial?: RecordForm;
  today?: string;
}) {
  const [form, setForm] = useState<RecordForm>(() => initial ?? emptyRecordForm(today));
  const [errors, setErrors] = useState<FieldErrors>({});
  const record = useRecordLegalRequest();
  const set = <K extends keyof RecordForm>(k: K, v: RecordForm[K]) => setForm((f) => ({ ...f, [k]: v }));
  const toggleRight = (r: PrivacyRight, on: boolean) =>
    set("rights", on ? [...form.rights, r] : form.rights.filter((x) => x !== r));
  const post = form.receivedBy === "post";
  const receiptTo = form.byRepresentative ? form.repEmail.trim() : form.email.trim();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const checked = recordPayload(form, today);
    if ("errors" in checked) {
      setErrors(checked.errors);
      document.getElementById(`rec-${Object.keys(checked.errors)[0]}`)?.focus();
      return;
    }
    setErrors({});
    record.mutate(checked.payload, {
      onSuccess: (doc) => {
        notify.success(
          checked.payload.sendReceipt
            ? `Recorded as ${doc.reference}. The receipt is being emailed.`
            : `Recorded as ${doc.reference}. Nothing was emailed.`,
          { title: "Recorded" },
        );
        onRecorded(doc);
      },
      onError: (err) => notify.error(err, { title: "Couldn't record it", module: "admin", feature: "legal-request-record" }),
    });
  };

  return (
    <PanelCard
      title="Record an email or letter"
      action={
        <button type="button" onClick={onCancel} aria-label="Close the record form" className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
          <X size={16} aria-hidden />
        </button>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-5">
        <p className="text-sm text-slate-500">
          For a request or notice that came by email or post, not through the website. It is answered and kept like
          one filed on the website.
        </p>

        <SelectField id="rec-kind" label="What it is" value={form.kind} onChange={(v) => set("kind", v as LegalRequestKind)} error={errors.kind} required>
          <option value="">Choose…</option>
          {RECORD_KINDS.map((k) => (
            <option key={k} value={k}>
              {KIND_LABELS[k]}
            </option>
          ))}
        </SelectField>

        <ChoiceGroup
          name="rec-receivedBy"
          legend="How it came"
          value={form.receivedBy}
          onChange={(v) => set("receivedBy", v)}
          options={[
            { value: "email", label: "By email" },
            { value: "post", label: "By post" },
          ]}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="rec-sentAt"
            type="date"
            label={post ? "Postmark date" : "Day it was sent"}
            hint="An opt-out's 30 days count from this day (Terms 39.11)."
            value={form.sentAt}
            onChange={(v) => set("sentAt", v)}
            error={errors.sentAt}
            required
          />
          <TextField
            id="rec-receivedAt"
            type="date"
            label="Day it arrived"
            hint="The answer-by date counts from this day."
            value={form.receivedAt}
            onChange={(v) => set("receivedAt", v)}
            error={errors.receivedAt}
            required
          />
        </div>

        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-gray-800 dark:text-gray-100">Whose request it is</legend>
          <TextField id="rec-name" label="Their full name" value={form.name} onChange={(v) => set("name", v)} error={errors.name} maxLength={120} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="rec-email"
              type="email"
              label="Their email address"
              hint="Empty if they gave none. Finds their account."
              value={form.email}
              onChange={(v) => set("email", v)}
              error={errors.email}
              maxLength={254}
            />
            <TextArea
              id="rec-address"
              label="Their postal address"
              rows={2}
              maxLength={500}
              value={form.address}
              onChange={(v) => set("address", v)}
              error={errors.address}
            />
          </div>
          <CheckField
            id="rec-byRepresentative"
            checked={form.byRepresentative}
            onChange={(v) => set("byRepresentative", v)}
            hint="A lawyer, an agent, or an officer of their business. Check their authority before deciding."
          >
            Someone else sent it for them
          </CheckField>
          {form.byRepresentative ? (
            <div className="space-y-4 rounded-lg border border-slate-100 p-4 dark:border-slate-800">
              <TextField id="rec-repName" label="Representative's full name" value={form.repName} onChange={(v) => set("repName", v)} error={errors.repName} maxLength={120} required />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  id="rec-repEmail"
                  type="email"
                  label="Representative's email address"
                  value={form.repEmail}
                  onChange={(v) => set("repEmail", v)}
                  error={errors.repEmail}
                  maxLength={254}
                />
                <TextArea
                  id="rec-repAddress"
                  label="Representative's postal address"
                  rows={2}
                  maxLength={500}
                  value={form.repAddress}
                  onChange={(v) => set("repAddress", v)}
                  error={errors.repAddress}
                />
              </div>
            </div>
          ) : null}
        </fieldset>

        {form.kind === "privacy" ? (
          <>
            <fieldset aria-describedby={errors.rights ? "rec-rights-error" : undefined}>
              <legend className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                They asked to<span className="text-rose-500"> *</span>
              </legend>
              <div className="mt-2 space-y-2">
                {RIGHT_OPTIONS.map((o, i) => (
                  <CheckField
                    key={o.value}
                    id={i === 0 ? "rec-rights" : `rec-right-${o.value}`}
                    checked={form.rights.includes(o.value)}
                    onChange={(on) => toggleRight(o.value, on)}
                  >
                    {o.label}
                  </CheckField>
                ))}
              </div>
              {errors.rights ? (
                <p id="rec-rights-error" role="alert" className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                  {errors.rights}
                </p>
              ) : null}
            </fieldset>
            <SelectField id="rec-region" label="Where they live" value={form.region} onChange={(v) => set("region", v as RecordForm["region"])}>
              <option value="">Not stated</option>
              <option value="us">United States</option>
              <option value="other">Elsewhere</option>
            </SelectField>
          </>
        ) : null}

        {form.kind === "appeal" ? (
          <TextField
            id="rec-appealOf"
            label="Reference of the decided request"
            hint="Like PR-7K3Q9X."
            value={form.appealOf}
            onChange={(v) => set("appealOf", v)}
            error={errors.appealOf}
            maxLength={20}
            required
          />
        ) : null}

        {form.kind === "copyright" || form.kind === "counter_notice" ? (
          <TextArea
            id="rec-urls"
            label="Links to the material"
            hint="One per line, if it names any."
            rows={3}
            maxLength={10000}
            value={form.urls}
            onChange={(v) => set("urls", v)}
            error={errors.urls}
          />
        ) : null}

        <TextField id="rec-title" label="Subject line" hint="Optional: the email's subject, or what the letter is about." value={form.title} onChange={(v) => set("title", v)} error={errors.title} maxLength={200} />
        <TextArea
          id="rec-details"
          label="What it says"
          hint={post ? "Summarise the letter, and keep the letter on file." : "Paste the email."}
          rows={6}
          value={form.details}
          onChange={(v) => set("details", v)}
          error={errors.details}
          required
        />

        <CheckField
          id="rec-sendReceipt"
          checked={form.sendReceipt}
          onChange={(v) => set("sendReceipt", v)}
          error={errors.sendReceipt}
          hint={
            receiptTo
              ? `To ${receiptTo}. It gives the reference and says it was sent to us by ${form.receivedBy}.`
              : form.byRepresentative
                ? "Goes to the representative, who gave no email address. Untick this and answer by post."
                : "Needs their email address. Without one, answer by post."
          }
        >
          Email them the receipt with the reference
        </CheckField>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={record.isPending}
            aria-busy={record.isPending}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium disabled:opacity-50"
          >
            {record.isPending ? <Loader2 size={15} className="animate-spin" aria-hidden /> : null}
            Record it
          </button>
          <button type="button" onClick={onCancel} className="h-9 px-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:underline">
            Cancel
          </button>
        </div>
      </form>
    </PanelCard>
  );
}
