"use client";

import { useState } from "react";
import { notify } from "@/lib/notify";
import { useFileCopyrightNotice, useFileCounterNotice } from "@/hooks/useLegalRequests";
import {
  copyrightPayload,
  counterPayload,
  emptyCopyrightForm,
  emptyCounterForm,
  longDate,
  type CopyrightForm,
  type CounterForm,
  type FieldErrors,
  type Filed as FiledResult,
} from "@/lib/legalRequests";
import {
  CheckField,
  ChoiceGroup,
  Filed,
  FormTabs,
  SubmitButton,
  TextArea,
  TextField,
} from "@/components/legal/FormFields";

type Tab = "notice" | "counter";

/** /dmca: send a copyright notice or a counter-notice. Each field is one of
 *  the parts 17 U.S.C. 512(c)(3) or 512(g)(3) requires. */
export default function CopyrightForms() {
  const [tab, setTab] = useState<Tab>("notice");
  return (
    <div className="space-y-6">
      <FormTabs<Tab>
        label="Copyright notice or counter-notice"
        active={tab}
        onChange={setTab}
        tabs={[
          { value: "notice", label: "Send a notice" },
          { value: "counter", label: "Send a counter-notice" },
        ]}
      />
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "notice" ? <NoticeForm /> : <CounterNoticeForm />}
      </div>
    </div>
  );
}

function focusFirst(prefix: string, errors: FieldErrors) {
  document.getElementById(`${prefix}-${Object.keys(errors)[0]}`)?.focus();
}

function NoticeForm() {
  const [form, setForm] = useState<CopyrightForm>(emptyCopyrightForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [filed, setFiled] = useState<FiledResult | null>(null);
  const file = useFileCopyrightNotice();
  const set = <K extends keyof CopyrightForm>(k: K, v: CopyrightForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const checked = copyrightPayload(form);
    if ("errors" in checked) {
      setErrors(checked.errors);
      focusFirst("cr", checked.errors);
      return;
    }
    setErrors({});
    file.mutate(checked.payload, {
      onSuccess: setFiled,
      onError: (err) =>
        notify.error(err, {
          title: "We couldn't send your notice",
          module: "legal-requests",
          feature: "copyright",
        }),
    });
  };

  if (filed) {
    return (
      <Filed
        title="We received your notice"
        reference={filed.reference}
        anotherLabel="Send another notice"
        onAnother={() => {
          setFiled(null);
          setForm(emptyCopyrightForm());
        }}
      >
        <p>
          We will review it by <strong>{longDate(filed.dueAt)}</strong>. If it is complete, we will remove or
          disable access to the material and tell the person who posted it. If they send a counter-notice, we
          will send you a copy.
        </p>
      </Filed>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <ChoiceGroup
        name="cr-relationship"
        legend="You are"
        value={form.relationship}
        onChange={(v) => set("relationship", v)}
        options={[
          { value: "owner", label: "The copyright owner" },
          { value: "agent", label: "Authorised to act for the owner" },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="cr-name"
          label="Your full legal name"
          value={form.name}
          onChange={(v) => set("name", v)}
          error={errors.name}
          autoComplete="name"
          maxLength={120}
          required
        />
        {form.relationship === "agent" ? (
          <TextField
            id="cr-organization"
            label="Copyright owner you act for"
            value={form.organization}
            onChange={(v) => set("organization", v)}
            error={errors.organization}
            autoComplete="organization"
            maxLength={160}
            required
          />
        ) : null}
        <TextField
          id="cr-email"
          label="Email address"
          type="email"
          value={form.email}
          onChange={(v) => set("email", v)}
          error={errors.email}
          autoComplete="email"
          maxLength={254}
          required
        />
        <TextField
          id="cr-phone"
          label="Phone number"
          type="tel"
          value={form.phone}
          onChange={(v) => set("phone", v)}
          error={errors.phone}
          autoComplete="tel"
          maxLength={40}
        />
      </div>
      <TextArea
        id="cr-address"
        label="Postal address"
        value={form.address}
        onChange={(v) => set("address", v)}
        error={errors.address}
        rows={2}
        maxLength={500}
        required
      />
      <TextArea
        id="cr-work"
        label="The copyrighted work"
        hint="Describe the work you say is infringed, or link to where it is published. For several works, list them."
        value={form.work}
        onChange={(v) => set("work", v)}
        error={errors.work}
        maxLength={2000}
        required
      />
      <TextArea
        id="cr-urls"
        label="Where the material is on Companies Center"
        hint="The link to each post, photo, listing or profile, one per line (up to 20)."
        value={form.urls}
        onChange={(v) => set("urls", v)}
        error={errors.urls}
        rows={3}
        placeholder="https://companiescenter.com/post/…"
        required
      />
      <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/40">
        <CheckField id="cr-goodFaith" checked={form.goodFaith} onChange={(v) => set("goodFaith", v)} error={errors.goodFaith}>
          I have a good-faith belief that the use of the material in the manner complained of is not authorised
          by the copyright owner, its agent, or the law.
        </CheckField>
        <CheckField id="cr-accurate" checked={form.accurate} onChange={(v) => set("accurate", v)} error={errors.accurate}>
          The information in this notice is accurate, and under penalty of perjury, I am the owner, or
          authorised to act on behalf of the owner, of an exclusive right that is allegedly infringed.
        </CheckField>
      </div>
      <TextField
        id="cr-signature"
        label="Signature"
        hint="Type your full legal name, as above. This is your electronic signature."
        value={form.signature}
        onChange={(v) => set("signature", v)}
        error={errors.signature}
        maxLength={120}
        required
      />
      <SubmitButton pending={file.isPending}>Send notice</SubmitButton>
    </form>
  );
}

function CounterNoticeForm() {
  const [form, setForm] = useState<CounterForm>(emptyCounterForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [filed, setFiled] = useState<FiledResult | null>(null);
  const file = useFileCounterNotice();
  const set = <K extends keyof CounterForm>(k: K, v: CounterForm[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const checked = counterPayload(form);
    if ("errors" in checked) {
      setErrors(checked.errors);
      focusFirst("cn", checked.errors);
      return;
    }
    setErrors({});
    file.mutate(checked.payload, {
      onSuccess: setFiled,
      onError: (err) =>
        notify.error(err, {
          title: "We couldn't send your counter-notice",
          module: "legal-requests",
          feature: "counter-notice",
        }),
    });
  };

  if (filed) {
    return (
      <Filed
        title="We received your counter-notice"
        reference={filed.reference}
        anotherLabel="Back to the form"
        onAnother={() => {
          setFiled(null);
          setForm(emptyCounterForm());
        }}
      >
        <p>
          We will send a copy, including your name and contact details, to the person who sent the original
          notice. Unless they tell us they have filed a court action, we will restore the material from{" "}
          <strong>{longDate(filed.dueAt)}</strong>, and no later than 14 working days after today.
        </p>
      </Filed>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Use this if we removed something you posted after a copyright notice and you believe it was removed by
        mistake or misidentified. We send a copy of your counter-notice, including your name and contact
        details, to the person who sent the notice.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="cn-name"
          label="Your full legal name"
          value={form.name}
          onChange={(v) => set("name", v)}
          error={errors.name}
          autoComplete="name"
          maxLength={120}
          required
        />
        <TextField
          id="cn-email"
          label="Email address"
          type="email"
          value={form.email}
          onChange={(v) => set("email", v)}
          error={errors.email}
          autoComplete="email"
          maxLength={254}
          required
        />
        <TextField
          id="cn-phone"
          label="Phone number"
          type="tel"
          value={form.phone}
          onChange={(v) => set("phone", v)}
          error={errors.phone}
          autoComplete="tel"
          maxLength={40}
          required
        />
        <TextField
          id="cn-claimReference"
          label="Notice reference, if you have it"
          hint="From our email, like CR-7K3Q9X."
          value={form.claimReference}
          onChange={(v) => set("claimReference", v)}
          error={errors.claimReference}
          maxLength={20}
        />
      </div>
      <TextArea
        id="cn-address"
        label="Postal address"
        value={form.address}
        onChange={(v) => set("address", v)}
        error={errors.address}
        rows={2}
        maxLength={500}
        required
      />
      <TextArea
        id="cn-urls"
        label="What was removed, and where it was"
        hint="The link where each item was before we removed it, one per line (up to 20)."
        value={form.urls}
        onChange={(v) => set("urls", v)}
        error={errors.urls}
        rows={3}
        placeholder="https://companiescenter.com/post/…"
        required
      />
      <TextArea
        id="cn-explanation"
        label="Anything we should know"
        value={form.explanation}
        onChange={(v) => set("explanation", v)}
        error={errors.explanation}
      />
      <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/40">
        <CheckField id="cn-mistake" checked={form.mistake} onChange={(v) => set("mistake", v)} error={errors.mistake}>
          Under penalty of perjury, I have a good-faith belief that the material was removed or disabled as a
          result of mistake or misidentification of the material to be removed or disabled.
        </CheckField>
        <CheckField
          id="cn-jurisdiction"
          checked={form.jurisdiction}
          onChange={(v) => set("jurisdiction", v)}
          error={errors.jurisdiction}
        >
          I consent to the jurisdiction of the Federal District Court for the judicial district in which my
          address is located (or, if my address is outside the United States, any judicial district in which
          Companies Center may be found), and I will accept service of process from the person who sent the
          notice, or their agent.
        </CheckField>
      </div>
      <TextField
        id="cn-signature"
        label="Signature"
        hint="Type your full legal name, as above. This is your electronic signature."
        value={form.signature}
        onChange={(v) => set("signature", v)}
        error={errors.signature}
        maxLength={120}
        required
      />
      <SubmitButton pending={file.isPending}>Send counter-notice</SubmitButton>
    </form>
  );
}
