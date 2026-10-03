/**
 * Dispute cases in the admin: the choices staff see and the request body each
 * sends (admin/disputes). Pure, so every rule is unit-tested. Mirrors the
 * API's dispute DTOs; the account action reuses accountActions.ts (same
 * reasons, durations and limits as the Users page).
 */
import {
  DURATIONS,
  MESSAGE_MAX,
  MESSAGE_MIN,
  type ReasonCode,
} from "./accountActions";

export type CaseStatus =
  | "open"
  | "under_review"
  | "awaiting_evidence"
  | "escalated"
  | "resolved"
  | "withdrawn";

export type CaseOutcome =
  | "favor_client"
  | "favor_provider"
  | "partial"
  | "no_action"
  | "withdrawn";

export type CaseParty = "raisedBy" | "respondent";
export type Side = "client" | "provider" | "";

export const DISPUTE_REASONS: ReadonlyArray<{ code: string; label: string }> = [
  { code: "work_not_delivered", label: "Work not delivered" },
  { code: "quality_issue", label: "Quality of the work" },
  { code: "no_show", label: "No-show" },
  { code: "scope_disagreement", label: "Disagreement about the scope" },
  { code: "communication", label: "Communication" },
  { code: "safety", label: "Safety concern" },
  { code: "property_damage", label: "Property damage" },
  { code: "payment_disagreement", label: "Payment disagreement" },
  { code: "other", label: "Other" },
];

export const disputeReasonLabel = (code?: string) =>
  DISPUTE_REASONS.find((r) => r.code === code)?.label ?? "Other";

const STATUS_LABELS: Record<CaseStatus, string> = {
  open: "Open",
  under_review: "Under review",
  awaiting_evidence: "Awaiting evidence",
  escalated: "Escalated",
  resolved: "Decided",
  withdrawn: "Withdrawn",
};

export const caseStatusLabel = (s?: string) =>
  STATUS_LABELS[s as CaseStatus] ?? s ?? "";

export const isOpenCase = (s?: string) => s !== "resolved" && s !== "withdrawn";

export const PRIORITIES = ["low", "normal", "high", "urgent"] as const;

export const OUTCOMES: ReadonlyArray<{ value: CaseOutcome; label: string }> = [
  { value: "favor_client", label: "In the client's favor" },
  { value: "favor_provider", label: "In the business's favor" },
  { value: "partial", label: "Split decision" },
  { value: "no_action", label: "Close with no action" },
  { value: "withdrawn", label: "Withdrawn" },
];

export const outcomeLabel = (o?: string) =>
  OUTCOMES.find((x) => x.value === o)?.label ?? "Closed";

/** Account actions a case decision may take (deletion stays on the Users page). */
export const CASE_ACTIONS = [
  { type: "warning", label: "Warning" },
  { type: "suspension", label: "Temporary suspension" },
  { type: "ban", label: "Permanent suspension" },
] as const;
export type CaseActionType = (typeof CASE_ACTIONS)[number]["type"];

export const EVIDENCE_TYPES: ReadonlyArray<{ value: string; label: string }> = [
  { value: "photo", label: "Photo" },
  { value: "video", label: "Video" },
  { value: "document", label: "Document or receipt" },
  { value: "message", label: "Message or screenshot" },
  { value: "witness", label: "Witness statement" },
  { value: "other", label: "Other" },
];

// ── People ──────────────────────────────────────────────────────────────

type Person = { _id?: string; firstName?: string; lastName?: string; email?: string } | null | undefined;

export function personName(p: Person): string {
  if (!p) return "Unknown";
  return `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim() || p.email || "User";
}

const idOf = (v: unknown): string =>
  v && typeof v === "object" ? String((v as { _id?: unknown })._id ?? "") : String(v ?? "");

/** The case as the detail endpoint returns it (populated). */
export interface CaseLike {
  raisedBy?: Person;
  respondent?: Person;
  task?: { userId?: unknown } | null;
  provider?: { owner?: unknown; providerName?: string } | null;
}

/** Which side of the job a person in the case is on, when the case has a job. */
export function sideOf(c: CaseLike, person: Person): Side {
  const id = idOf(person);
  if (!id) return "";
  if (c.provider?.owner && idOf(c.provider.owner) === id) return "provider";
  if (c.task?.userId && idOf(c.task.userId) === id) return "client";
  return "";
}

/** "Ben Cole (Bright Plumbing)" or "Ada Obi (client)". */
export function partyLabel(c: CaseLike, party: CaseParty): string {
  const person = c[party];
  const side = sideOf(c, person);
  const name = personName(person);
  if (side === "provider") return `${name} (${c.provider?.providerName || "business"})`;
  if (side === "client") return `${name} (client)`;
  return name;
}

// ── Opening a case ──────────────────────────────────────────────────────

export interface OpenCaseForm {
  reason: string;
  summary: string;
  details: string;
  priority: (typeof PRIORITIES)[number];
  /** With a job: who raised it. */
  raisedBySide: "client" | "provider";
}

export function emptyOpenCase(summary = ""): OpenCaseForm {
  return {
    reason: "quality_issue",
    summary: summary.slice(0, 300),
    details: "",
    priority: "normal",
    raisedBySide: "client",
  };
}

export type OpenCaseSource = { task: string } | { ticket: string };

/**
 * `respondent` is set when staff had to pick the other person (a ticket that
 * names no counterparty and no job); `needsRespondent` says they must.
 */
export function buildOpenCaseBody(
  source: OpenCaseSource,
  form: OpenCaseForm,
  respondent?: { id?: string; needsRespondent: boolean },
): { ok: true; body: Record<string, unknown> } | { ok: false; error: string } {
  const summary = form.summary.trim();
  const details = form.details.trim();
  if (respondent?.needsRespondent && !respondent.id) {
    return { ok: false, error: "Choose the other person in the case." };
  }
  if (!summary) return { ok: false, error: "Write one line on what the case is about." };
  if (summary.length > 300) return { ok: false, error: "Keep the summary under 300 characters." };
  if (details.length > 5000) return { ok: false, error: "The staff notes are too long." };
  return {
    ok: true,
    body: {
      ...source,
      reason: form.reason,
      summary,
      ...(details ? { details } : {}),
      priority: form.priority,
      ...("task" in source ? { raisedBySide: form.raisedBySide } : {}),
      ...(respondent?.id ? { respondent: respondent.id } : {}),
    },
  };
}

// ── Messages ────────────────────────────────────────────────────────────

/** Who a message goes to; "internal" is a staff-only note. */
export type Audience = "both" | "raisedBy" | "respondent" | "internal";

export interface MessageForm {
  body: string;
  audience: Audience;
  /** The message asks for something; the case waits for evidence. */
  awaitingReply: boolean;
}

export const emptyMessage = (): MessageForm => ({
  body: "",
  audience: "both",
  awaitingReply: false,
});

export function buildMessageBody(
  form: MessageForm,
): { ok: true; body: Record<string, unknown> } | { ok: false; error: string } {
  const body = form.body.trim();
  if (!body) return { ok: false, error: "Write the message first." };
  if (body.length > 5000) return { ok: false, error: "The message is too long." };
  if (form.audience === "internal") return { ok: true, body: { body, isInternal: true } };
  return {
    ok: true,
    body: {
      body,
      audience: form.audience,
      ...(form.awaitingReply ? { awaitingReply: true } : {}),
    },
  };
}

// ── Evidence ────────────────────────────────────────────────────────────

export interface EvidenceForm {
  type: string;
  description: string;
  url: string;
}

export const emptyEvidence = (): EvidenceForm => ({ type: "photo", description: "", url: "" });

export function buildEvidenceBody(
  form: EvidenceForm,
): { ok: true; body: Record<string, unknown> } | { ok: false; error: string } {
  const description = form.description.trim();
  const url = form.url.trim();
  if (!description) return { ok: false, error: "Say what it is and who sent it." };
  if (url && !/^https?:\/\/\S+$/i.test(url)) {
    return { ok: false, error: "The link must start with http:// or https://" };
  }
  return { ok: true, body: { type: form.type, description, ...(url ? { url } : {}) } };
}

// ── The decision ────────────────────────────────────────────────────────

export interface DecisionForm {
  outcome: CaseOutcome;
  rationale: string;
  /** Also warn or suspend one of the two people. */
  act: boolean;
  target: CaseParty;
  type: CaseActionType;
  reasonCode: ReasonCode;
  message: string;
  durationHours: number;
}

export const emptyDecision = (): DecisionForm => ({
  outcome: "favor_client",
  rationale: "",
  act: false,
  target: "respondent",
  type: "warning",
  reasonCode: "terms",
  message: "",
  durationHours: 72,
});

export function buildDecisionBody(
  form: DecisionForm,
): { ok: true; body: Record<string, unknown> } | { ok: false; error: string } {
  const rationale = form.rationale.trim();
  if (!rationale) {
    return { ok: false, error: "Explain the decision. Both people get it by email." };
  }
  if (rationale.length > 5000) return { ok: false, error: "The explanation is too long." };
  if (!form.act) return { ok: true, body: { outcome: form.outcome, rationale } };

  const message = form.message.trim();
  if (message.length < MESSAGE_MIN) {
    return {
      ok: false,
      error: `Write the message to the person you're acting on (at least ${MESSAGE_MIN} characters).`,
    };
  }
  if (message.length > MESSAGE_MAX) return { ok: false, error: "The message to the person is too long." };
  if (form.type === "suspension" && !DURATIONS.some((d) => d.hours === form.durationHours)) {
    return { ok: false, error: "Choose how long the suspension lasts." };
  }
  return {
    ok: true,
    body: {
      outcome: form.outcome,
      rationale,
      accountAction: {
        target: form.target,
        type: form.type,
        reasonCode: form.reasonCode,
        message,
        ...(form.type === "suspension" ? { durationHours: form.durationHours } : {}),
      },
    },
  };
}

/** The confirm button says exactly what will happen. */
export function decisionConfirmLabel(form: DecisionForm, targetName: string): string {
  if (!form.act) return "Decide and email both people";
  const what =
    form.type === "warning"
      ? `warn ${targetName}`
      : form.type === "ban"
        ? `suspend ${targetName} permanently`
        : `suspend ${targetName} for ${DURATIONS.find((d) => d.hours === form.durationHours)?.label ?? "the chosen time"}`;
  return `Decide and ${what}`;
}
