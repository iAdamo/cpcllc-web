/**
 * Privacy requests, appeals, copyright notices and counter-notices: the
 * public forms (app/privacy-request, app/dmca) and the admin view
 * (screens/admin/views/LegalRequestsView). Types for the API
 * (modules/legal-requests) and the pure bits, unit-tested: each form turns
 * into a payload here, or into the errors to show beside its fields.
 */

export type LegalRequestKind =
  | "privacy"
  | "appeal"
  | "copyright"
  | "counter_notice"
  | "dispute_notice"
  | "arbitration_opt_out"
  | "legal_notice";
export type LegalRequestStatus =
  | "received"
  | "verifying"
  | "in_progress"
  | "completed"
  | "denied"
  | "withdrawn";
export type PrivacyRight =
  | "know"
  | "copy"
  | "correct"
  | "delete"
  | "opt_out"
  | "limit_sensitive"
  | "withdraw_consent"
  | "object"
  | "other";
export type Region = "us" | "ng" | "other";

/** What a person can ask for, in the order the form lists them. Mirrors
 *  RIGHT_LABELS in the API. */
export const RIGHT_OPTIONS: { value: PrivacyRight; label: string; hint?: string }[] = [
  { value: "know", label: "Know what we hold and how we use and share it" },
  { value: "copy", label: "A copy of my information", hint: "In a format you can take elsewhere." },
  { value: "correct", label: "Correct my information" },
  {
    value: "delete",
    label: "Delete my information or account",
    hint: "If you can sign in, you can also delete your account in the app.",
  },
  {
    value: "opt_out",
    label: "Opt out of sale, sharing, targeted advertising or profiling",
    hint: "We do none of these; we record your choice anyway.",
  },
  { value: "limit_sensitive", label: "Limit use of sensitive information" },
  { value: "withdraw_consent", label: "Withdraw consent" },
  { value: "object", label: "Object to or restrict processing" },
  { value: "other", label: "Something else" },
];

export function rightLabel(r: string): string {
  return RIGHT_OPTIONS.find((o) => o.value === r)?.label ?? r;
}

export const KIND_LABELS: Record<LegalRequestKind, string> = {
  privacy: "Privacy request",
  appeal: "Appeal",
  copyright: "Copyright notice",
  counter_notice: "Counter-notice",
  dispute_notice: "Notice of Dispute",
  arbitration_opt_out: "Arbitration opt-out",
  legal_notice: "Legal notice",
};

export const STATUS_LABELS: Record<LegalRequestStatus, string> = {
  received: "Received",
  verifying: "Verifying",
  in_progress: "In progress",
  completed: "Completed",
  denied: "Denied",
  withdrawn: "Withdrawn",
};

export const OPEN_STATUSES: LegalRequestStatus[] = ["received", "verifying", "in_progress"];

export function isOpen(status: string): boolean {
  return (OPEN_STATUSES as string[]).includes(status);
}

/** Open and past its answer-by date. */
export function isOverdue(r: { status: string; dueAt: string }, now = new Date()): boolean {
  return isOpen(r.status) && new Date(r.dueAt).getTime() < now.getTime();
}

export const US_STATES: [string, string][] = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"],
  ["CA", "California"], ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"],
  ["DC", "District of Columbia"], ["FL", "Florida"], ["GA", "Georgia"], ["HI", "Hawaii"],
  ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"],
  ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"],
  ["MD", "Maryland"], ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"],
  ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"],
  ["NV", "Nevada"], ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"],
  ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"],
  ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"],
  ["SC", "South Carolina"], ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"],
  ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"], ["WA", "Washington"],
  ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"],
];

// ── Forms ─────────────────────────────────────────────────────────────────

/** Field name → what to fix. Empty when the form can be sent. */
export type FieldErrors = Record<string, string>;
type Result<T> = { ok: true; payload: T } | { ok: false; errors: FieldErrors };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isEmail = (v: string) => EMAIL.test(v.trim());
const blank = (v: string | undefined) => !v || !v.trim();

function done<T>(errors: FieldErrors, payload: () => T): Result<T> {
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, payload: payload() };
}

/** One link per line (or separated by spaces/commas); blanks dropped. */
export function parseUrls(text: string): string[] {
  return [...new Set(text.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean))];
}

const isHttpUrl = (u: string) => {
  try {
    const url = new URL(u);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export interface PrivacyForm {
  relationship: "self" | "agent";
  name: string;
  email: string;
  subjectName: string;
  subjectEmail: string;
  rights: PrivacyRight[];
  region: Region | "";
  usState: string;
  details: string;
  /** The person confirms the information is theirs, or that they are
   *  authorised to act for the person. */
  confirm: boolean;
}

export const emptyPrivacyForm = (): PrivacyForm => ({
  relationship: "self",
  name: "",
  email: "",
  subjectName: "",
  subjectEmail: "",
  rights: [],
  region: "",
  usState: "",
  details: "",
  confirm: false,
});

export interface PrivacyPayload {
  relationship: "self" | "agent";
  requester: { name: string; email: string };
  subject?: { name: string; email: string };
  rights: PrivacyRight[];
  region: Region;
  usState?: string;
  details?: string;
}

export function privacyPayload(f: PrivacyForm): Result<PrivacyPayload> {
  const e: FieldErrors = {};
  const agent = f.relationship === "agent";
  if (blank(f.name)) e.name = "Enter your full name.";
  if (!isEmail(f.email)) e.email = "Enter a valid email address.";
  if (agent) {
    if (blank(f.subjectName)) e.subjectName = "Enter the name of the person you act for.";
    if (!isEmail(f.subjectEmail))
      e.subjectEmail = "Enter the email address they use with Companies Center.";
  }
  if (!f.rights.length) e.rights = "Choose at least one request.";
  if (!f.region) e.region = "Choose where you live.";
  else if (f.region === "us" && !f.usState) e.usState = "Choose your state.";
  if (f.details.length > 5000) e.details = "Keep it under 5,000 characters.";
  if (!f.confirm)
    e.confirm = agent
      ? "Confirm that you are authorised to act for this person."
      : "Confirm that this request is about you.";
  return done(e, () => ({
    relationship: f.relationship,
    requester: { name: f.name.trim(), email: f.email.trim() },
    ...(agent ? { subject: { name: f.subjectName.trim(), email: f.subjectEmail.trim() } } : {}),
    rights: f.rights,
    region: f.region as Region,
    ...(f.region === "us" ? { usState: f.usState } : {}),
    ...(f.details.trim() ? { details: f.details.trim() } : {}),
  }));
}

export interface AppealForm {
  reference: string;
  email: string;
  reason: string;
}

export function appealPayload(f: AppealForm): Result<AppealForm> {
  const e: FieldErrors = {};
  if (!/^[A-Za-z]{2}-?[A-Za-z0-9]{6}$/.test(f.reference.trim().replace(/\s+/g, "")))
    e.reference = "Enter the reference from our email, like PR-7K3Q9X.";
  if (!isEmail(f.email)) e.email = "Enter the email address you filed the request with.";
  if (blank(f.reason)) e.reason = "Tell us why you disagree with the decision.";
  else if (f.reason.length > 5000) e.reason = "Keep it under 5,000 characters.";
  return done(e, () => ({
    reference: f.reference.trim(),
    email: f.email.trim(),
    reason: f.reason.trim(),
  }));
}

export interface CopyrightForm {
  relationship: "owner" | "agent";
  name: string;
  organization: string;
  email: string;
  phone: string;
  address: string;
  work: string;
  urls: string;
  goodFaith: boolean;
  accurate: boolean;
  signature: string;
}

export const emptyCopyrightForm = (): CopyrightForm => ({
  relationship: "owner",
  name: "",
  organization: "",
  email: "",
  phone: "",
  address: "",
  work: "",
  urls: "",
  goodFaith: false,
  accurate: false,
  signature: "",
});

export interface CopyrightPayload {
  relationship: "owner" | "agent";
  contact: { name: string; email: string; phone?: string; address: string };
  organization?: string;
  work: string;
  urls: string[];
  goodFaith: true;
  accurate: true;
  signature: string;
}

function checkUrls(text: string, e: FieldErrors): string[] {
  const urls = parseUrls(text);
  if (!urls.length) e.urls = "Add at least one link.";
  else if (urls.length > 20) e.urls = "Send up to 20 links per notice.";
  else if (!urls.every(isHttpUrl)) e.urls = "Each link must start with https:// (or http://).";
  return urls;
}

/** The signature must be the name given above: a typed full name is the
 *  electronic signature the law asks for. */
const signs = (signature: string, name: string) =>
  signature.trim().toLowerCase() === name.trim().toLowerCase();

export function copyrightPayload(f: CopyrightForm): Result<CopyrightPayload> {
  const e: FieldErrors = {};
  if (blank(f.name)) e.name = "Enter your full name.";
  if (f.relationship === "agent" && blank(f.organization))
    e.organization = "Enter the copyright owner you act for.";
  if (!isEmail(f.email)) e.email = "Enter a valid email address.";
  if (blank(f.address)) e.address = "Enter your postal address.";
  if (blank(f.work)) e.work = "Describe the work you say is infringed.";
  const urls = checkUrls(f.urls, e);
  if (!f.goodFaith) e.goodFaith = "This statement is required.";
  if (!f.accurate) e.accurate = "This statement is required.";
  if (blank(f.signature)) e.signature = "Type your full name to sign.";
  else if (!blank(f.name) && !signs(f.signature, f.name))
    e.signature = "Type the same full name you entered above.";
  return done(e, () => ({
    relationship: f.relationship,
    contact: {
      name: f.name.trim(),
      email: f.email.trim(),
      ...(f.phone.trim() ? { phone: f.phone.trim() } : {}),
      address: f.address.trim(),
    },
    ...(f.relationship === "agent" ? { organization: f.organization.trim() } : {}),
    work: f.work.trim(),
    urls,
    goodFaith: true as const,
    accurate: true as const,
    signature: f.signature.trim(),
  }));
}

export interface CounterForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  urls: string;
  claimReference: string;
  explanation: string;
  mistake: boolean;
  jurisdiction: boolean;
  signature: string;
}

export const emptyCounterForm = (): CounterForm => ({
  name: "",
  email: "",
  phone: "",
  address: "",
  urls: "",
  claimReference: "",
  explanation: "",
  mistake: false,
  jurisdiction: false,
  signature: "",
});

export interface CounterPayload {
  contact: { name: string; email: string; phone: string; address: string };
  urls: string[];
  claimReference?: string;
  explanation?: string;
  mistake: true;
  jurisdiction: true;
  signature: string;
}

export function counterPayload(f: CounterForm): Result<CounterPayload> {
  const e: FieldErrors = {};
  if (blank(f.name)) e.name = "Enter your full name.";
  if (!isEmail(f.email)) e.email = "Enter a valid email address.";
  if (blank(f.phone)) e.phone = "A counter-notice must include a phone number.";
  if (blank(f.address)) e.address = "Enter your postal address.";
  const urls = checkUrls(f.urls, e);
  if (!f.mistake) e.mistake = "This statement is required.";
  if (!f.jurisdiction) e.jurisdiction = "This statement is required.";
  if (blank(f.signature)) e.signature = "Type your full name to sign.";
  else if (!blank(f.name) && !signs(f.signature, f.name))
    e.signature = "Type the same full name you entered above.";
  return done(e, () => ({
    contact: {
      name: f.name.trim(),
      email: f.email.trim(),
      phone: f.phone.trim(),
      address: f.address.trim(),
    },
    urls,
    ...(f.claimReference.trim() ? { claimReference: f.claimReference.trim() } : {}),
    ...(f.explanation.trim() ? { explanation: f.explanation.trim() } : {}),
    mistake: true as const,
    jurisdiction: true as const,
    signature: f.signature.trim(),
  }));
}

// ── Legal notices (/legal-notice; Terms of Service 39.2, 39.11, 43) ────────

export type NoticeTab = "dispute" | "opt-out" | "notice";

export const NOTICE_TABS: { value: NoticeTab; label: string }[] = [
  { value: "dispute", label: "Notice of Dispute" },
  { value: "opt-out", label: "Arbitration opt-out" },
  { value: "notice", label: "Other legal notice" },
];

/** The form a link opens (/legal-notice?form=opt-out). Lives here, not in
 *  the "use client" forms module: a server page that imports data from a
 *  client module gets a client reference, not the value. */
export function noticeTabFrom(param: unknown): NoticeTab {
  return NOTICE_TABS.find((t) => t.value === param)?.value ?? "dispute";
}

export interface DisputeForm {
  name: string;
  email: string;
  description: string;
  facts: string;
  relief: string;
  accurate: boolean;
  signature: string;
}

export const emptyDisputeForm = (): DisputeForm => ({
  name: "",
  email: "",
  description: "",
  facts: "",
  relief: "",
  accurate: false,
  signature: "",
});

export interface DisputePayload {
  requester: { name: string; email: string };
  description: string;
  facts: string;
  relief: string;
  accurate: true;
  signature: string;
}

export function disputePayload(f: DisputeForm): Result<DisputePayload> {
  const e: FieldErrors = {};
  if (blank(f.name)) e.name = "Enter your full name.";
  if (!isEmail(f.email)) e.email = "Enter the email address on your account.";
  if (blank(f.description)) e.description = "Describe the dispute.";
  if (blank(f.facts)) e.facts = "Give the facts that support it.";
  if (blank(f.relief)) e.relief = "Say what you are asking for.";
  if (!f.accurate) e.accurate = "This statement is required.";
  if (blank(f.signature)) e.signature = "Type your full name to sign.";
  else if (!blank(f.name) && !signs(f.signature, f.name))
    e.signature = "Type the same full name you entered above.";
  return done(e, () => ({
    requester: { name: f.name.trim(), email: f.email.trim() },
    description: f.description.trim(),
    facts: f.facts.trim(),
    relief: f.relief.trim(),
    accurate: true as const,
    signature: f.signature.trim(),
  }));
}

export interface OptOutForm {
  name: string;
  email: string;
  optOut: boolean;
  personal: boolean;
  signature: string;
}

export const emptyOptOutForm = (): OptOutForm => ({
  name: "",
  email: "",
  optOut: false,
  personal: false,
  signature: "",
});

export interface OptOutPayload {
  requester: { name: string; email: string };
  optOut: true;
  personal: true;
  signature: string;
}

export function optOutPayload(f: OptOutForm): Result<OptOutPayload> {
  const e: FieldErrors = {};
  if (blank(f.name)) e.name = "Enter your full name.";
  if (!isEmail(f.email)) e.email = "Enter the email address on your account.";
  if (!f.optOut) e.optOut = "Tick this box to opt out.";
  if (!f.personal) e.personal = "An opt-out must be submitted by you personally.";
  if (blank(f.signature)) e.signature = "Type your full name to sign.";
  else if (!blank(f.name) && !signs(f.signature, f.name))
    e.signature = "Type the same full name you entered above.";
  return done(e, () => ({
    requester: { name: f.name.trim(), email: f.email.trim() },
    optOut: true as const,
    personal: true as const,
    signature: f.signature.trim(),
  }));
}

export interface LegalNoticeForm {
  name: string;
  email: string;
  organization: string;
  title: string;
  details: string;
}

export const emptyLegalNoticeForm = (): LegalNoticeForm => ({
  name: "",
  email: "",
  organization: "",
  title: "",
  details: "",
});

export interface LegalNoticePayload {
  requester: { name: string; email: string };
  organization?: string;
  title: string;
  details: string;
}

export function legalNoticePayload(f: LegalNoticeForm): Result<LegalNoticePayload> {
  const e: FieldErrors = {};
  if (blank(f.name)) e.name = "Enter your full name.";
  if (!isEmail(f.email)) e.email = "Enter a valid email address.";
  if (blank(f.title)) e.title = "Say in a few words what the notice is about.";
  else if (f.title.length > 200) e.title = "Keep the subject under 200 characters.";
  if (blank(f.details)) e.details = "Write or paste the notice.";
  return done(e, () => ({
    requester: { name: f.name.trim(), email: f.email.trim() },
    ...(f.organization.trim() ? { organization: f.organization.trim() } : {}),
    title: f.title.trim(),
    details: f.details.trim(),
  }));
}

/** What the API returns after filing. */
export interface Filed {
  reference: string;
  kind: LegalRequestKind;
  receivedAt: string;
  dueAt: string;
}

/** "November 8, 2026" */
export function longDate(v: string | Date): string {
  return new Date(v).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

// ── Admin ─────────────────────────────────────────────────────────────────

export interface LegalRequestSummary {
  _id: string;
  reference: string;
  kind: LegalRequestKind;
  status: LegalRequestStatus;
  requester: { name: string; email: string };
  subject?: { name: string };
  rights?: PrivacyRight[];
  dueAt: string;
  closedAt?: string;
  createdAt: string;
}

export interface LegalRequestList {
  items: LegalRequestSummary[];
  total: number;
  page: number;
  pageSize: number;
  open: Partial<Record<LegalRequestKind, number>>;
  overdue: number;
}

export interface LegalRequestDetail extends LegalRequestSummary {
  relationship?: "self" | "agent" | "owner";
  requester: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    organization?: string;
  };
  subject?: { name: string; email: string };
  region?: Region;
  usState?: string;
  details?: string;
  work?: string;
  urls?: string[];
  signature?: string;
  claimReference?: string;
  userId?: string;
  accountId?: string;
  decision?: { outcome: string; message?: string; decidedAt: string; decidedBy: string };
  notes: { text: string; by: string; at: string }[];
  history: { status: string; by?: string; at: string }[];
  appeals: { _id: string; reference: string; status: LegalRequestStatus }[];
  original: { _id: string; reference: string; status: LegalRequestStatus } | null;
  strikes: number | null;
  repeatInfringerStrikes: number;
  restoreWindow: { from: string; until: string } | null;
  title?: string;
  facts?: string;
  relief?: string;
  optOutCheck: {
    acceptances: { version: string; status: string; decidedAt: string }[];
    currentVersion: string | null;
    firstAcceptedCurrentAt: string | null;
    inTime: boolean | null;
  } | null;
}

export function regionLabel(r: Pick<LegalRequestDetail, "region" | "usState">): string {
  if (r.region === "us") {
    const state = US_STATES.find(([code]) => code === r.usState)?.[1];
    return state ? `United States (${state})` : "United States";
  }
  if (r.region === "ng") return "Nigeria";
  if (r.region === "other") return "Elsewhere";
  return "";
}

/** A Mongo id, as the decision form's account field needs. */
export function isAccountId(value: string): boolean {
  return /^[a-f0-9]{24}$/i.test(value.trim());
}
