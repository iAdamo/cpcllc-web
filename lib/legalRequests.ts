/**
 * Privacy requests, appeals, copyright notices, counter-notices and legal
 * notices: the public forms (app/privacy-request, app/dmca,
 * app/legal-notice) and the admin view, where staff also record what came
 * by email or post (screens/admin/views/LegalRequestsView). Types for the API
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
  if (!f.personal) e.personal = "Tick this box to confirm the opt-out is for your own account.";
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

// ── Recording an email or a letter (admin) ───────────────────────────────

/** How a request came when staff recorded it; absent when filed on the
 *  website. */
export type ReceivedBy = "email" | "post";

/** Admin > Privacy & Copyright Requests > Record an email or letter. The
 *  Terms accept notices by email and post (Sections 39.2, 39.11, 43); staff
 *  record them so they are worked and kept like a website filing. Dates are
 *  "2026-10-08", as a date input gives them. */
export interface RecordForm {
  kind: LegalRequestKind | "";
  receivedBy: ReceivedBy;
  sentAt: string;
  receivedAt: string;
  name: string;
  email: string;
  address: string;
  /** Someone sent it for them: a lawyer, an agent, an officer of a business. */
  byRepresentative: boolean;
  repName: string;
  repEmail: string;
  repAddress: string;
  title: string;
  details: string;
  rights: PrivacyRight[];
  region: Region | "";
  appealOf: string;
  urls: string;
  sendReceipt: boolean;
}

export const emptyRecordForm = (today: string): RecordForm => ({
  kind: "",
  receivedBy: "email",
  sentAt: today,
  receivedAt: today,
  name: "",
  email: "",
  address: "",
  byRepresentative: false,
  repName: "",
  repEmail: "",
  repAddress: "",
  title: "",
  details: "",
  rights: [],
  region: "",
  appealOf: "",
  urls: "",
  sendReceipt: true,
});

type RecordParty = { name: string; email?: string; address?: string };

/** What POST admin/legal-requests takes (RecordRequestDto in the API). */
export interface RecordPayload {
  kind: LegalRequestKind;
  receivedBy: ReceivedBy;
  sentAt: string;
  receivedAt: string;
  person: RecordParty;
  representative?: RecordParty;
  title?: string;
  details: string;
  rights?: PrivacyRight[];
  region?: Region;
  appealOf?: string;
  urls?: string[];
  sendReceipt: boolean;
}

/** "2026-10-11": a day in UTC, as date inputs and the API use them. */
export const isoDay = (d: Date) => d.toISOString().slice(0, 10);

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const isDay = (v: string) => DAY.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`));

/** A name, and an email or a postal address. Errors go under `keys`. */
function checkParty(
  e: FieldErrors,
  keys: { name: string; email: string; address: string },
  p: { name: string; email: string; address: string },
  nameError: string,
): RecordParty {
  if (blank(p.name)) e[keys.name] = nameError;
  if (!blank(p.email) && !isEmail(p.email)) e[keys.email] = "Enter a valid email address, or leave it empty.";
  else if (blank(p.email) && blank(p.address)) e[keys.email] = "Give an email address or a postal address.";
  if (p.address.length > 500) e[keys.address] = "Keep the address under 500 characters.";
  return {
    name: p.name.trim(),
    ...(blank(p.email) ? {} : { email: p.email.trim() }),
    ...(blank(p.address) ? {} : { address: p.address.trim() }),
  };
}

/**
 * The record form as the payload the API validates, or the errors to show.
 * `today` is the staff member's day: nothing arrives after it, and nothing
 * is sent after it arrived (the API checks both again).
 */
export function recordPayload(f: RecordForm, today: string): Result<RecordPayload> {
  const e: FieldErrors = {};
  if (!f.kind) e.kind = "Choose what it is.";
  if (!isDay(f.receivedAt)) e.receivedAt = "Enter the day it arrived.";
  else if (f.receivedAt > today) e.receivedAt = "It can't arrive in the future.";
  if (!isDay(f.sentAt))
    e.sentAt = f.receivedBy === "post" ? "Enter the postmark date." : "Enter the day it was sent.";
  else if (isDay(f.receivedAt) && f.sentAt > f.receivedAt) e.sentAt = "It can't have been sent after it arrived.";

  const person = checkParty(
    e,
    { name: "name", email: "email", address: "address" },
    { name: f.name, email: f.email, address: f.address },
    "Enter their full name.",
  );
  const rep = f.byRepresentative
    ? checkParty(
        e,
        { name: "repName", email: "repEmail", address: "repAddress" },
        { name: f.repName, email: f.repEmail, address: f.repAddress },
        "Enter the name of whoever sent it for them.",
      )
    : undefined;

  if (blank(f.details)) e.details = "Paste the email, or summarise the letter.";
  else if (f.details.length > 5000) e.details = "Keep it under 5,000 characters.";
  if (f.title.length > 200) e.title = "Keep the subject under 200 characters.";
  if (f.kind === "privacy" && !f.rights.length) e.rights = "Choose at least one request.";
  if (f.kind === "appeal" && !/^[A-Za-z]{2}-?[A-Za-z0-9]{6}$/.test(f.appealOf.trim().replace(/\s+/g, "")))
    e.appealOf = "Enter the reference of the decided request, like PR-7K3Q9X.";
  const linked = (f.kind === "copyright" || f.kind === "counter_notice") && !blank(f.urls);
  const urls = linked ? checkUrls(f.urls, e) : [];
  const receiptTo = rep ? rep.email : person.email;
  if (f.sendReceipt && !receiptTo)
    e.sendReceipt = "There is no email address to send it to. Untick this and answer by post.";

  return done(e, () => ({
    kind: f.kind as LegalRequestKind,
    receivedBy: f.receivedBy,
    sentAt: f.sentAt,
    receivedAt: f.receivedAt,
    person,
    ...(rep ? { representative: rep } : {}),
    ...(blank(f.title) ? {} : { title: f.title.trim() }),
    details: f.details.trim(),
    ...(f.kind === "privacy" ? { rights: f.rights } : {}),
    ...(f.kind === "privacy" && f.region ? { region: f.region } : {}),
    ...(f.kind === "appeal" ? { appealOf: f.appealOf.trim() } : {}),
    ...(urls.length ? { urls } : {}),
    sendReceipt: f.sendReceipt,
  }));
}

/** "By post, postmarked October 3, 2026; arrived October 8, 2026" for a
 *  recorded request; "Website form" for one filed on the site. */
export function howItCame(r: Pick<LegalRequestDetail, "receivedBy" | "sentAt" | "history" | "createdAt">): string {
  if (!r.receivedBy) return "Website form";
  const arrived = r.history[0]?.at ?? r.createdAt;
  const sent = r.sentAt ? `, ${r.receivedBy === "post" ? "postmarked" : "sent"} ${longDate(r.sentAt)}` : "";
  return `By ${r.receivedBy}${sent}; arrived ${longDate(arrived)}`;
}

/** When it arrived: the first history entry (the real day for a recorded
 *  email or letter; the moment of filing on the website). */
export function arrivedAt(r: Pick<LegalRequestDetail, "history" | "createdAt">): string {
  return r.history[0]?.at ?? r.createdAt;
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
  /** A recorded letter may give no email address. */
  requester: { name: string; email?: string };
  subject?: { name: string };
  rights?: PrivacyRight[];
  receivedBy?: ReceivedBy;
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
    email?: string;
    phone?: string;
    address?: string;
    organization?: string;
  };
  subject?: { name: string; email?: string; address?: string };
  /** The day the email was sent or the letter postmarked (recorded only). */
  sentAt?: string;
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
