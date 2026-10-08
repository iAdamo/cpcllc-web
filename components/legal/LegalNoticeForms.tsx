"use client";

import { useState } from "react";
import { notify } from "@/lib/notify";
import { useFileDisputeNotice, useFileLegalNotice, useFileOptOut } from "@/hooks/useLegalRequests";
import {
  disputePayload,
  emptyDisputeForm,
  emptyLegalNoticeForm,
  emptyOptOutForm,
  legalNoticePayload,
  longDate,
  optOutPayload,
  type DisputeForm,
  type FieldErrors,
  type Filed as FiledResult,
  type LegalNoticeForm,
  type NoticeTab,
  type OptOutForm,
  NOTICE_TABS,
} from "@/lib/legalRequests";
import { CheckField, Filed, FormTabs, SubmitButton, TextArea, TextField } from "@/components/legal/FormFields";

/**
 * /legal-notice: the written notices the Terms of Service require. Notice of
 * Dispute (Section 39.2), Arbitration opt-out (Section 39.11), and any other
 * legal notice (Section 43). Each is recorded with the time received and a
 * reference, and the sender gets an email receipt.
 */
export default function LegalNoticeForms({ initial = "dispute" }: { initial?: NoticeTab }) {
  const [tab, setTab] = useState<NoticeTab>(initial);
  return (
    <div className="space-y-6">
      <FormTabs<NoticeTab> label="Kind of legal notice" active={tab} onChange={setTab} tabs={NOTICE_TABS} />
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "dispute" ? <DisputeNotice /> : tab === "opt-out" ? <OptOut /> : <OtherNotice />}
      </div>
    </div>
  );
}

function focusFirst(prefix: string, errors: FieldErrors) {
  document.getElementById(`${prefix}-${Object.keys(errors)[0]}`)?.focus();
}

const failed = (title: string, feature: string) => (err: unknown) =>
  notify.error(err, { title, module: "legal-requests", feature });

function DisputeNotice() {
  const [form, setForm] = useState<DisputeForm>(emptyDisputeForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [filed, setFiled] = useState<FiledResult | null>(null);
  const file = useFileDisputeNotice();
  const set = <K extends keyof DisputeForm>(k: K, v: DisputeForm[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const checked = disputePayload(form);
    if ("errors" in checked) {
      setErrors(checked.errors);
      focusFirst("dn", checked.errors);
      return;
    }
    setErrors({});
    file.mutate(checked.payload, {
      onSuccess: setFiled,
      onError: failed("We couldn't send your notice", "dispute-notice"),
    });
  };

  if (filed) {
    return (
      <Filed
        title="We received your Notice of Dispute"
        reference={filed.reference}
        anotherLabel="Back to the form"
        onAnother={() => {
          setFiled(null);
          setForm(emptyDisputeForm());
        }}
      >
        <p>
          It was received on <strong>{longDate(filed.receivedAt)}</strong>. The 60-day period to try to
          resolve it informally (Section 39.2 of the Terms of Service) runs from that date. We will contact
          you at the email address you gave.
        </p>
      </Filed>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Before starting arbitration, Section 39.2 of the Terms of Service asks you to send this notice and give us
        60 days to try to resolve the dispute with you.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="dn-name" label="Your full name" value={form.name} onChange={(v) => set("name", v)} error={errors.name} autoComplete="name" maxLength={120} required />
        <TextField id="dn-email" label="Account email address" type="email" value={form.email} onChange={(v) => set("email", v)} error={errors.email} autoComplete="email" maxLength={254} required />
      </div>
      <TextArea id="dn-description" label="The dispute" hint="What the disagreement is about." value={form.description} onChange={(v) => set("description", v)} error={errors.description} required />
      <TextArea id="dn-facts" label="Supporting facts" hint="Dates, references, and what happened." value={form.facts} onChange={(v) => set("facts", v)} error={errors.facts} required />
      <TextArea id="dn-relief" label="What you are asking for" value={form.relief} onChange={(v) => set("relief", v)} error={errors.relief} rows={3} maxLength={2000} required />
      <CheckField id="dn-accurate" checked={form.accurate} onChange={(v) => set("accurate", v)} error={errors.accurate}>
        The information in this notice is accurate.
      </CheckField>
      <TextField id="dn-signature" label="Signature" hint="Type your full name, as above. This is your personal signature." value={form.signature} onChange={(v) => set("signature", v)} error={errors.signature} maxLength={120} required />
      <SubmitButton pending={file.isPending}>Send Notice of Dispute</SubmitButton>
    </form>
  );
}

function OptOut() {
  const [form, setForm] = useState<OptOutForm>(emptyOptOutForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [filed, setFiled] = useState<FiledResult | null>(null);
  const file = useFileOptOut();
  const set = <K extends keyof OptOutForm>(k: K, v: OptOutForm[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const checked = optOutPayload(form);
    if ("errors" in checked) {
      setErrors(checked.errors);
      focusFirst("oo", checked.errors);
      return;
    }
    setErrors({});
    file.mutate(checked.payload, {
      onSuccess: setFiled,
      onError: failed("We couldn't record your opt-out", "arbitration-opt-out"),
    });
  };

  if (filed) {
    return (
      <Filed
        title="We recorded your arbitration opt-out"
        reference={filed.reference}
        anotherLabel="Back to the form"
        onAnother={() => {
          setFiled(null);
          setForm(emptyOptOutForm());
        }}
      >
        <p>
          It was received on <strong>{longDate(filed.receivedAt)}</strong>. An opt-out received within 30 days
          after you first accepted a version of the Terms of Service containing the arbitration agreement is
          effective. We will confirm by email once we have checked the date. Keep the email as your record.
        </p>
      </Filed>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        You can opt out of the arbitration agreement in Section 39 of the Terms of Service within 30 days after you
        first accept a version of the Terms that contains it. Opting out does not affect the rest of the Terms or your
        use of Companies Center. Only you can submit your own opt-out.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="oo-name" label="Your full name" value={form.name} onChange={(v) => set("name", v)} error={errors.name} autoComplete="name" maxLength={120} required />
        <TextField id="oo-email" label="Account email address" type="email" value={form.email} onChange={(v) => set("email", v)} error={errors.email} autoComplete="email" maxLength={254} required />
      </div>
      <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/40">
        <CheckField id="oo-optOut" checked={form.optOut} onChange={(v) => set("optOut", v)} error={errors.optOut}>
          I opt out of the arbitration agreement in Section 39 of the Companies Center Terms of Service.
        </CheckField>
        <CheckField id="oo-personal" checked={form.personal} onChange={(v) => set("personal", v)} error={errors.personal}>
          I am submitting this opt-out myself, for my own account.
        </CheckField>
      </div>
      <TextField id="oo-signature" label="Signature" hint="Type your full name, as above." value={form.signature} onChange={(v) => set("signature", v)} error={errors.signature} maxLength={120} required />
      <SubmitButton pending={file.isPending}>Opt out of arbitration</SubmitButton>
    </form>
  );
}

function OtherNotice() {
  const [form, setForm] = useState<LegalNoticeForm>(emptyLegalNoticeForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [filed, setFiled] = useState<FiledResult | null>(null);
  const file = useFileLegalNotice();
  const set = <K extends keyof LegalNoticeForm>(k: K, v: LegalNoticeForm[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const checked = legalNoticePayload(form);
    if ("errors" in checked) {
      setErrors(checked.errors);
      focusFirst("ln", checked.errors);
      return;
    }
    setErrors({});
    file.mutate(checked.payload, {
      onSuccess: setFiled,
      onError: failed("We couldn't send your notice", "legal-notice"),
    });
  };

  if (filed) {
    return (
      <Filed
        title="We received your legal notice"
        reference={filed.reference}
        anotherLabel="Send another notice"
        onAnother={() => {
          setFiled(null);
          setForm(emptyLegalNoticeForm());
        }}
      >
        <p>
          It was received on <strong>{longDate(filed.receivedAt)}</strong>. Where a response is needed, we aim to
          respond by <strong>{longDate(filed.dueAt)}</strong>.
        </p>
      </Filed>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        For formal legal notices to Companies Center LLC. For help with your account, use Customer Support in the app;
        for privacy requests or copyright notices, use the pages linked below.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="ln-name" label="Your full name" value={form.name} onChange={(v) => set("name", v)} error={errors.name} autoComplete="name" maxLength={120} required />
        <TextField id="ln-email" label="Email address" type="email" value={form.email} onChange={(v) => set("email", v)} error={errors.email} autoComplete="email" maxLength={254} required />
        <TextField id="ln-organization" label="Organization, if any" value={form.organization} onChange={(v) => set("organization", v)} error={errors.organization} autoComplete="organization" maxLength={160} />
        <TextField id="ln-title" label="Subject" value={form.title} onChange={(v) => set("title", v)} error={errors.title} maxLength={200} required />
      </div>
      <TextArea id="ln-details" label="The notice" value={form.details} onChange={(v) => set("details", v)} error={errors.details} rows={6} required />
      <SubmitButton pending={file.isPending}>Send legal notice</SubmitButton>
    </form>
  );
}
