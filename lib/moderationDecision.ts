/**
 * Deciding a moderation report: the outcomes staff choose from and the body
 * each sends to PATCH admin/moderation/reports/:id/decide. Warn / suspend /
 * permanent suspension act on the reported person's account (and email them).
 */

export type Outcome = "dismiss" | "warn" | "suspend" | "ban";

export const OUTCOMES: ReadonlyArray<{ value: Outcome; label: string; description: string }> = [
  {
    value: "dismiss",
    label: "No violation",
    description: "Close the report. Nothing happens to the account.",
  },
  {
    value: "warn",
    label: "Warn",
    description: "The account stays active; they get a warning email.",
  },
  {
    value: "suspend",
    label: "Suspend temporarily",
    description: "Blocked for the chosen days, then restored automatically.",
  },
  {
    value: "ban",
    label: "Suspend permanently",
    description: "Blocked until your team reinstates them.",
  },
];

export const SUSPEND_DAYS = [1, 3, 7, 30] as const;

export interface DecisionForm {
  outcome: Outcome;
  suspendDays: number;
  messageToUser: string;
  notes: string;
  /** Needed when the report is about a chat (two people in it). */
  targetUserId: string;
}

export interface DecisionBody {
  actions: string[];
  finalStatus: "actioned" | "dismissed";
  notes?: string;
  messageToUser?: string;
  suspendDays?: number;
  targetUserId?: string;
}

const ACTION: Record<Exclude<Outcome, "dismiss">, string> = {
  warn: "warn",
  suspend: "suspend_user",
  ban: "ban_user",
};

export function emptyDecision(): DecisionForm {
  return { outcome: "warn", suspendDays: 7, messageToUser: "", notes: "", targetUserId: "" };
}

export function buildDecisionBody(
  form: DecisionForm,
  targetType: string,
): { ok: true; body: DecisionBody } | { ok: false; error: string } {
  const notes = form.notes.trim();
  if (form.outcome === "dismiss") {
    return {
      ok: true,
      body: { actions: ["no_action"], finalStatus: "dismissed", ...(notes ? { notes } : {}) },
    };
  }
  const message = form.messageToUser.trim();
  if (message && message.length < 10) {
    return {
      ok: false,
      error: "Make the message to the user at least 10 characters, or leave it empty to use our standard wording.",
    };
  }
  const target = form.targetUserId.trim();
  if (targetType === "Chat" && !/^[0-9a-f]{24}$/i.test(target)) {
    return {
      ok: false,
      error: "This report is about a chat. Enter the user ID of the person the decision applies to.",
    };
  }
  return {
    ok: true,
    body: {
      actions: [ACTION[form.outcome]],
      finalStatus: "actioned",
      ...(notes ? { notes } : {}),
      ...(message ? { messageToUser: message } : {}),
      ...(form.outcome === "suspend" ? { suspendDays: form.suspendDays } : {}),
      ...(target ? { targetUserId: target } : {}),
    },
  };
}
