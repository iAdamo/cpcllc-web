/**
 * Account enforcement in the admin: the choices staff see, the request body
 * each choice sends (POST admin/marketplace/users/:id/actions), and the labels
 * for an account's status and history. Pure, so every rule is unit-tested.
 *
 * Mirrors the API's enforcement.constants.ts (types, reason codes, limits).
 */

export type AccountActionType =
  | "warning"
  | "suspension"
  | "ban"
  | "deletion"
  | "reinstatement";

export type ReasonCode =
  | "spam"
  | "fraud"
  | "harassment"
  | "safety"
  | "fake_reviews"
  | "impersonation"
  | "illegal"
  | "terms"
  | "other";

export const REASONS: ReadonlyArray<{ code: ReasonCode; label: string }> = [
  { code: "fraud", label: "Fraud or scams" },
  { code: "harassment", label: "Harassment or abusive behavior" },
  { code: "safety", label: "Unsafe conduct" },
  { code: "spam", label: "Spam or misleading content" },
  { code: "fake_reviews", label: "Fake or manipulated reviews" },
  { code: "impersonation", label: "Impersonation" },
  { code: "illegal", label: "Illegal activity" },
  { code: "terms", label: "Breaking our Terms of Service" },
  { code: "other", label: "Other" },
];

export function reasonLabel(code?: string | null): string {
  return REASONS.find((r) => r.code === code)?.label ?? "Other";
}

/** What staff can choose. Reinstatement is offered separately (only when blocked). */
export const ACTIONS: ReadonlyArray<{
  type: Exclude<AccountActionType, "reinstatement">;
  label: string;
  description: string;
}> = [
  {
    type: "warning",
    label: "Send a warning",
    description: "The account stays active. They get an email and an in-app notice.",
  },
  {
    type: "suspension",
    label: "Suspend temporarily",
    description:
      "Signed out everywhere and blocked until the end date, then restored automatically.",
  },
  {
    type: "ban",
    label: "Suspend permanently",
    description: "Signed out everywhere and blocked until your team reinstates them.",
  },
  {
    type: "deletion",
    label: "Delete account",
    description:
      "Blocked now, permanently deleted in 30 days unless your team reinstates them first.",
  },
];

export const DURATIONS: ReadonlyArray<{ hours: number; label: string }> = [
  { hours: 24, label: "24 hours" },
  { hours: 72, label: "3 days" },
  { hours: 168, label: "7 days" },
  { hours: 720, label: "30 days" },
];

export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 2000;
const HOUR = 3_600_000;
const MAX_SUSPENSION_MS = 365 * 24 * HOUR;

export interface ActionForm {
  type: AccountActionType;
  reasonCode: ReasonCode;
  message: string;
  internalNote: string;
  /** A preset, or "custom" to use `customUntil`. */
  duration: number | "custom";
  /** `<input type="datetime-local">` value (local time). */
  customUntil: string;
}

export interface ActionBody {
  type: AccountActionType;
  reasonCode?: ReasonCode;
  message?: string;
  internalNote?: string;
  durationHours?: number;
  until?: string;
}

export function emptyForm(type: AccountActionType = "warning"): ActionForm {
  return {
    type,
    reasonCode: "terms",
    message: "",
    internalNote: "",
    duration: 72,
    customUntil: "",
  };
}

/** The request body, or the first thing the admin has to fix. */
export function buildActionBody(
  form: ActionForm,
  now: Date = new Date(),
): { ok: true; body: ActionBody } | { ok: false; error: string } {
  const message = form.message.trim();
  const internalNote = form.internalNote.trim();

  if (form.type === "reinstatement") {
    return {
      ok: true,
      body: {
        type: "reinstatement",
        ...(message ? { message } : {}),
        ...(internalNote ? { internalNote } : {}),
      },
    };
  }
  if (message.length < MESSAGE_MIN) {
    return {
      ok: false,
      error: "Write a message to the user explaining the decision (at least 10 characters).",
    };
  }
  if (message.length > MESSAGE_MAX) {
    return { ok: false, error: "The message is too long (2,000 characters at most)." };
  }

  const body: ActionBody = {
    type: form.type,
    reasonCode: form.reasonCode,
    message,
    ...(internalNote ? { internalNote } : {}),
  };
  if (form.type !== "suspension") return { ok: true, body };

  if (form.duration !== "custom") {
    return { ok: true, body: { ...body, durationHours: form.duration } };
  }
  const until = form.customUntil ? new Date(form.customUntil) : null;
  if (!until || Number.isNaN(until.getTime())) {
    return { ok: false, error: "Choose when the suspension ends." };
  }
  const ms = until.getTime() - now.getTime();
  if (ms < HOUR) return { ok: false, error: "A suspension must last at least 1 hour." };
  if (ms > MAX_SUSPENSION_MS) {
    return {
      ok: false,
      error: "A suspension can last up to 365 days. Use a permanent suspension for longer.",
    };
  }
  return { ok: true, body: { ...body, until: until.toISOString() } };
}

/** The confirm button's words, so the admin reads exactly what will happen. */
export function confirmLabel(form: ActionForm): string {
  switch (form.type) {
    case "warning":
      return "Send warning";
    case "suspension": {
      const preset = DURATIONS.find((d) => d.hours === form.duration);
      return preset ? `Suspend for ${preset.label}` : "Suspend until the date";
    }
    case "ban":
      return "Suspend permanently";
    case "deletion":
      return "Schedule deletion";
    default:
      return "Reinstate account";
  }
}

interface StatusUser {
  isActive?: boolean;
  isDeleted?: boolean;
  scheduledDeletionAt?: string | null;
  deactivation?: {
    initiatedBy?: string;
    kind?: string;
    until?: string | null;
    reasonCode?: string;
  } | null;
}

const day = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

/** Blocked by staff (suspended, permanently suspended, or deletion scheduled). */
export function isStaffBlocked(u: StatusUser | null | undefined): boolean {
  return !!u && u.isActive === false && !u.isDeleted && u.deactivation?.initiatedBy === "Admin";
}

export function accountStatus(u: StatusUser): {
  label: string;
  tone: "green" | "rose" | "orange" | "slate";
  detail?: string;
} {
  if (u.isDeleted) return { label: "Deleted", tone: "slate" };
  if (u.isActive !== false) return { label: "Active", tone: "green" };
  const d = u.deactivation;
  if (d?.initiatedBy === "Admin") {
    const reason = d.reasonCode ? reasonLabel(d.reasonCode) : undefined;
    if (d.kind === "suspension") {
      return { label: "Suspended", tone: "rose", detail: `Until ${day(d.until)}${reason ? ` · ${reason}` : ""}` };
    }
    if (d.kind === "deletion") {
      return {
        label: "Deletion scheduled",
        tone: "rose",
        detail: `On ${day(u.scheduledDeletionAt)}${reason ? ` · ${reason}` : ""}`,
      };
    }
    return { label: "Suspended", tone: "rose", detail: `No end date${reason ? ` · ${reason}` : ""}` };
  }
  return {
    label: "Deactivated",
    tone: "orange",
    detail: u.scheduledDeletionAt
      ? `By the user · deletion on ${day(u.scheduledDeletionAt)}`
      : "By the user · signing in reactivates it",
  };
}

export interface AccountActionRow {
  _id: string;
  type: AccountActionType;
  reasonCode?: string;
  messageToUser?: string;
  internalNote?: string;
  until?: string | null;
  source: "admin" | "moderation" | "system";
  actorId?: { firstName?: string; lastName?: string; email?: string } | null;
  emailedAt?: string | null;
  createdAt: string;
}

const TITLES: Record<AccountActionType, string> = {
  warning: "Warning",
  suspension: "Suspended",
  ban: "Suspended permanently",
  deletion: "Deletion scheduled",
  reinstatement: "Reinstated",
};

/** One line per history entry: "Suspended until Oct 10 · Fraud or scams". */
export function describeAction(row: AccountActionRow): { title: string; meta: string } {
  if (row.type === "reinstatement" && row.source === "system") {
    return { title: "Suspension ended", meta: `Automatically · ${day(row.createdAt)}` };
  }
  const title =
    row.type === "suspension" || row.type === "deletion"
      ? `${TITLES[row.type]} ${row.type === "suspension" ? "until" : "for"} ${day(row.until)}`
      : TITLES[row.type];
  const by = row.actorId
    ? `${row.actorId.firstName ?? ""} ${row.actorId.lastName ?? ""}`.trim() || row.actorId.email
    : undefined;
  const parts = [
    row.type !== "reinstatement" ? reasonLabel(row.reasonCode) : undefined,
    row.source === "moderation" ? "From a report" : undefined,
    by ? `by ${by}` : undefined,
    day(row.createdAt),
    row.emailedAt ? "Emailed" : "Not emailed",
  ].filter(Boolean);
  return { title, meta: parts.join(" · ") };
}
