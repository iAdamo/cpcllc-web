/**
 * Deciding a moderation report: the outcomes staff choose from and the body
 * each sends to PATCH admin/moderation/reports/:id/decide. Warn / suspend /
 * permanent suspension act on the reported person's account (and email them).
 * A reported feed post or comment can also be taken down (hidden from
 * everyone, kept for the case): App Store guideline 1.2 asks for a timely
 * response to reported content.
 */

export type Outcome = "dismiss" | "remove" | "warn" | "suspend" | "ban";

/** Report targets the API can take down (moderation REMOVE_CONTENT). */
export const TAKE_DOWN_TYPES = ["Post", "PostComment"] as const;

export function canTakeDown(targetType: string): boolean {
  return (TAKE_DOWN_TYPES as readonly string[]).includes(targetType);
}

export const OUTCOMES: ReadonlyArray<{ value: Outcome; label: string; description: string }> = [
  {
    value: "dismiss",
    label: "No violation",
    description: "Close the report. Nothing happens to the account.",
  },
  {
    value: "remove",
    label: "Take it down",
    description: "Hide it from everyone. Nothing happens to the account.",
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

/** The outcomes offered for a report: "Take it down" only where it can be. */
export function outcomesFor(targetType: string) {
  return OUTCOMES.filter((o) => o.value !== "remove" || canTakeDown(targetType));
}

/** Whether an outcome acts on the person's account (and emails them). */
export function actsOnAccount(outcome: Outcome): boolean {
  return outcome === "warn" || outcome === "suspend" || outcome === "ban";
}

export interface DecisionForm {
  outcome: Outcome;
  suspendDays: number;
  messageToUser: string;
  notes: string;
  /** Needed when the report is about a chat (two people in it). */
  targetUserId: string;
  /** With a warning or suspension on a post or comment: take it down too. */
  takeDown: boolean;
}

export interface DecisionBody {
  actions: string[];
  finalStatus: "actioned" | "dismissed";
  notes?: string;
  messageToUser?: string;
  suspendDays?: number;
  targetUserId?: string;
}

const ACTION: Record<Exclude<Outcome, "dismiss" | "remove">, string> = {
  warn: "warn",
  suspend: "suspend_user",
  ban: "ban_user",
};

export function emptyDecision(): DecisionForm {
  return {
    outcome: "warn",
    suspendDays: 7,
    messageToUser: "",
    notes: "",
    targetUserId: "",
    takeDown: true,
  };
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
  if (form.outcome === "remove") {
    if (!canTakeDown(targetType)) {
      return { ok: false, error: "Only a reported post or comment can be taken down." };
    }
    return {
      ok: true,
      body: { actions: ["remove_content"], finalStatus: "actioned", ...(notes ? { notes } : {}) },
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
      actions: [
        ACTION[form.outcome],
        ...(form.takeDown && canTakeDown(targetType) ? ["remove_content"] : []),
      ],
      finalStatus: "actioned",
      ...(notes ? { notes } : {}),
      ...(message ? { messageToUser: message } : {}),
      ...(form.outcome === "suspend" ? { suspendDays: form.suspendDays } : {}),
      ...(target ? { targetUserId: target } : {}),
    },
  };
}
