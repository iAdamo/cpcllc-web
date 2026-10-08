"use client";

import { useState } from "react";
import { notify } from "@/lib/notify";
import { useFileAppeal, useFilePrivacyRequest } from "@/hooks/useLegalRequests";
import {
  RIGHT_OPTIONS,
  US_STATES,
  appealPayload,
  emptyPrivacyForm,
  longDate,
  privacyPayload,
  type AppealForm,
  type FieldErrors,
  type Filed as FiledResult,
  type PrivacyForm,
  type PrivacyRight,
} from "@/lib/legalRequests";
import {
  CheckField,
  ChoiceGroup,
  FieldError,
  Filed,
  FormTabs,
  SelectField,
  SubmitButton,
  TextArea,
  TextField,
} from "@/components/legal/FormFields";

type Tab = "request" | "appeal";

/**
 * /privacy-request: file a privacy request, or appeal a decision on one.
 * `appeal` comes from the link in our decision email
 * (/privacy-request?appeal=PR-XXXXXX) and opens the appeal tab filled in.
 */
export default function PrivacyRequestForm({ appeal }: { appeal?: string }) {
  const [tab, setTab] = useState<Tab>(appeal ? "appeal" : "request");
  return (
    <div className="space-y-6">
      <FormTabs<Tab>
        label="Privacy request or appeal"
        active={tab}
        onChange={setTab}
        tabs={[
          { value: "request", label: "Make a request" },
          { value: "appeal", label: "Appeal a decision" },
        ]}
      />
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "request" ? <RequestForm /> : <AppealFormView initialReference={appeal ?? ""} />}
      </div>
    </div>
  );
}

function RequestForm() {
  const [form, setForm] = useState<PrivacyForm>(emptyPrivacyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [filed, setFiled] = useState<FiledResult | null>(null);
  const file = useFilePrivacyRequest();
  const set = <K extends keyof PrivacyForm>(k: K, v: PrivacyForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));
  const agent = form.relationship === "agent";

  const toggleRight = (r: PrivacyRight, on: boolean) =>
    set("rights", on ? [...form.rights, r] : form.rights.filter((x) => x !== r));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const checked = privacyPayload(form);
    if ("errors" in checked) {
      setErrors(checked.errors);
      document.getElementById(`pr-${Object.keys(checked.errors)[0]}`)?.focus();
      return;
    }
    setErrors({});
    file.mutate(checked.payload, {
      onSuccess: setFiled,
      onError: (err) =>
        notify.error(err, {
          title: "We couldn't send your request",
          module: "legal-requests",
          feature: "privacy",
        }),
    });
  };

  if (filed) {
    return (
      <Filed
        title="We received your request"
        reference={filed.reference}
        anotherLabel="Make another request"
        onAnother={() => {
          setFiled(null);
          setForm(emptyPrivacyForm());
        }}
      >
        <p>
          Before we act on it we may need to confirm it is {agent ? "the person you act for" : "you"}, for
          example by asking {agent ? "them" : "you"} to sign in or to reply from the email address on the
          account. We aim to reply by <strong>{longDate(filed.dueAt)}</strong>.
        </p>
        <p>Keep the reference: you will need it if you want to appeal our decision.</p>
      </Filed>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <ChoiceGroup
        name="pr-relationship"
        legend="Who is this request about?"
        value={form.relationship}
        onChange={(v) => set("relationship", v)}
        options={[
          { value: "self", label: "Me" },
          { value: "agent", label: "Someone I'm authorised to act for" },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="pr-name"
          label={agent ? "Your full name (the agent)" : "Your full name"}
          value={form.name}
          onChange={(v) => set("name", v)}
          error={errors.name}
          autoComplete="name"
          maxLength={120}
          required
        />
        <TextField
          id="pr-email"
          label={agent ? "Your email address (the agent)" : "Your email address"}
          hint={agent ? undefined : "Use the address on your Companies Center account, if you have one."}
          type="email"
          value={form.email}
          onChange={(v) => set("email", v)}
          error={errors.email}
          autoComplete="email"
          maxLength={254}
          required
        />
      </div>

      {agent ? (
        <div className="grid gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:grid-cols-2 dark:border-gray-800 dark:bg-gray-950/40">
          <TextField
            id="pr-subjectName"
            label="Their full name"
            value={form.subjectName}
            onChange={(v) => set("subjectName", v)}
            error={errors.subjectName}
            maxLength={120}
            required
          />
          <TextField
            id="pr-subjectEmail"
            label="Their email address"
            hint="The address they use with Companies Center."
            type="email"
            value={form.subjectEmail}
            onChange={(v) => set("subjectEmail", v)}
            error={errors.subjectEmail}
            maxLength={254}
            required
          />
          <p className="text-xs text-gray-500 sm:col-span-2 dark:text-gray-400">
            We will ask for their signed permission and may confirm directly with them before acting.
          </p>
        </div>
      ) : null}

      <fieldset aria-describedby={errors.rights ? "pr-rights-error" : undefined}>
        <legend className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          What would you like us to do?<span className="text-rose-500"> *</span>
        </legend>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Choose all that apply.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {RIGHT_OPTIONS.map((o) => (
            <CheckField
              key={o.value}
              id={o.value === RIGHT_OPTIONS[0].value ? "pr-rights" : `pr-right-${o.value}`}
              checked={form.rights.includes(o.value)}
              onChange={(on) => toggleRight(o.value, on)}
              hint={o.hint}
            >
              {o.label}
            </CheckField>
          ))}
        </div>
        <FieldError id="pr-rights-error" error={errors.rights} />
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          id="pr-region"
          label={agent ? "Where do they live?" : "Where do you live?"}
          value={form.region}
          onChange={(v) => set("region", v as PrivacyForm["region"])}
          error={errors.region}
          required
        >
          <option value="">Choose…</option>
          <option value="us">United States</option>
          <option value="ng">Nigeria</option>
          <option value="other">Somewhere else</option>
        </SelectField>
        {form.region === "us" ? (
          <SelectField
            id="pr-usState"
            label="State"
            value={form.usState}
            onChange={(v) => set("usState", v)}
            error={errors.usState}
            required
          >
            <option value="">Choose…</option>
            {US_STATES.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </SelectField>
        ) : null}
      </div>

      <TextArea
        id="pr-details"
        label="Anything we should know"
        hint="For example, what to correct, or which information you want. Don't include passwords, card or bank numbers, or ID documents."
        value={form.details}
        onChange={(v) => set("details", v)}
        error={errors.details}
      />

      <CheckField
        id="pr-confirm"
        checked={form.confirm}
        onChange={(v) => set("confirm", v)}
        error={errors.confirm}
      >
        {agent
          ? "I am authorised to make this request for the person named above."
          : "This request is about my own information."}
      </CheckField>

      <SubmitButton pending={file.isPending}>Send request</SubmitButton>
    </form>
  );
}

function AppealFormView({ initialReference }: { initialReference: string }) {
  const [form, setForm] = useState<AppealForm>({ reference: initialReference, email: "", reason: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [filed, setFiled] = useState<FiledResult | null>(null);
  const file = useFileAppeal();
  const set = <K extends keyof AppealForm>(k: K, v: AppealForm[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const checked = appealPayload(form);
    if ("errors" in checked) {
      setErrors(checked.errors);
      document.getElementById(`ap-${Object.keys(checked.errors)[0]}`)?.focus();
      return;
    }
    setErrors({});
    file.mutate(checked.payload, {
      onSuccess: setFiled,
      onError: (err) =>
        notify.error(err, {
          title: "We couldn't send your appeal",
          module: "legal-requests",
          feature: "appeal",
        }),
    });
  };

  if (filed) {
    return (
      <Filed
        title="We received your appeal"
        reference={filed.reference}
        anotherLabel="Back to the form"
        onAnother={() => {
          setFiled(null);
          setForm({ reference: "", email: "", reason: "" });
        }}
      >
        <p>
          We will look at our decision again and reply by <strong>{longDate(filed.dueAt)}</strong>.
        </p>
      </Filed>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        If we completed or denied your request and you disagree with how we handled it, tell us why. You can
        appeal each decision once.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="ap-reference"
          label="Request reference"
          hint="From our email, like PR-7K3Q9X."
          value={form.reference}
          onChange={(v) => set("reference", v)}
          error={errors.reference}
          maxLength={20}
          required
        />
        <TextField
          id="ap-email"
          label="Email address"
          hint="The address the request was filed with."
          type="email"
          value={form.email}
          onChange={(v) => set("email", v)}
          error={errors.email}
          autoComplete="email"
          maxLength={254}
          required
        />
      </div>
      <TextArea
        id="ap-reason"
        label="Why do you disagree?"
        value={form.reason}
        onChange={(v) => set("reason", v)}
        error={errors.reason}
        rows={5}
        required
      />
      <SubmitButton pending={file.isPending}>Send appeal</SubmitButton>
    </form>
  );
}
