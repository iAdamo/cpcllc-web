import { describe, it, expect } from "vitest";
import {
  accountStatus,
  buildActionBody,
  confirmLabel,
  describeAction,
  emptyForm,
  isStaffBlocked,
  reasonLabel,
} from "./accountActions";
import { buildDecisionBody, emptyDecision } from "./moderationDecision";

const now = new Date("2026-10-03T12:00:00Z");
const message = "You asked clients to pay outside the agreed price.";

describe("buildActionBody", () => {
  it("every action but reinstatement needs a real message to the user", () => {
    expect(buildActionBody({ ...emptyForm("ban"), message: "no" }, now)).toEqual({
      ok: false,
      error: "Write a message to the user explaining the decision (at least 10 characters).",
    });
    expect(buildActionBody(emptyForm("reinstatement"), now)).toEqual({
      ok: true,
      body: { type: "reinstatement" },
    });
  });

  it("a preset suspension sends hours; a custom one sends the end as ISO", () => {
    expect(
      buildActionBody({ ...emptyForm("suspension"), message, reasonCode: "fraud", duration: 168 }, now),
    ).toEqual({
      ok: true,
      body: { type: "suspension", reasonCode: "fraud", message, durationHours: 168 },
    });
    const custom = buildActionBody(
      { ...emptyForm("suspension"), message, duration: "custom", customUntil: "2026-10-10T16:00:00Z" },
      now,
    );
    expect(custom).toMatchObject({ ok: true, body: { until: "2026-10-10T16:00:00.000Z" } });
  });

  it("custom end: required, at least an hour away, at most a year", () => {
    const f = { ...emptyForm("suspension"), message, duration: "custom" as const };
    expect(buildActionBody({ ...f, customUntil: "" }, now)).toMatchObject({ ok: false });
    expect(buildActionBody({ ...f, customUntil: "2026-10-03T12:30:00Z" }, now)).toMatchObject({
      ok: false,
      error: "A suspension must last at least 1 hour.",
    });
    expect(buildActionBody({ ...f, customUntil: "2027-10-04T12:00:00Z" }, now)).toMatchObject({
      ok: false,
    });
  });

  it("the internal note is sent only when written, and never the empty duration for non-suspensions", () => {
    expect(
      buildActionBody({ ...emptyForm("warning"), message, internalNote: "  third report  " }, now),
    ).toEqual({
      ok: true,
      body: { type: "warning", reasonCode: "terms", message, internalNote: "third report" },
    });
  });

  it("the confirm button says exactly what will happen", () => {
    expect(confirmLabel({ ...emptyForm("suspension"), duration: 72 })).toBe("Suspend for 3 days");
    expect(confirmLabel({ ...emptyForm("suspension"), duration: "custom" })).toBe("Suspend until the date");
    expect(confirmLabel(emptyForm("deletion"))).toBe("Schedule deletion");
  });
});

describe("accountStatus", () => {
  it("reads staff blocks, self-deactivation and active", () => {
    expect(accountStatus({ isActive: true })).toEqual({ label: "Active", tone: "green" });
    expect(
      accountStatus({
        isActive: false,
        deactivation: { initiatedBy: "Admin", kind: "ban", reasonCode: "fraud" },
      }),
    ).toEqual({ label: "Suspended", tone: "rose", detail: "No end date · Fraud or scams" });
    expect(
      accountStatus({ isActive: false, deactivation: { initiatedBy: "Admin", kind: "suspension", until: "2026-10-10T16:00:00Z" } })
        .detail,
    ).toMatch(/^Until /);
    expect(accountStatus({ isActive: false, deactivation: { initiatedBy: "Client" } })).toEqual({
      label: "Deactivated",
      tone: "orange",
      detail: "By the user · signing in reactivates it",
    });
  });

  it("only staff blocks can be reinstated from the admin", () => {
    expect(isStaffBlocked({ isActive: false, deactivation: { initiatedBy: "Admin" } })).toBe(true);
    expect(isStaffBlocked({ isActive: false, deactivation: { initiatedBy: "Client" } })).toBe(false);
    expect(isStaffBlocked({ isActive: true })).toBe(false);
  });
});

describe("history lines", () => {
  it("name the action, reason, source, actor and whether the email went out", () => {
    const d = describeAction({
      _id: "1",
      type: "warning",
      reasonCode: "spam",
      source: "moderation",
      actorId: { firstName: "Jane", lastName: "Doe" },
      emailedAt: "2026-10-03T12:00:00Z",
      createdAt: "2026-10-03T12:00:00Z",
    });
    expect(d.title).toBe("Warning");
    expect(d.meta).toMatch(/^Spam or misleading content · From a report · by Jane Doe · .* · Emailed$/);
    expect(
      describeAction({ _id: "2", type: "reinstatement", source: "system", createdAt: "2026-10-03T12:00:00Z" })
        .title,
    ).toBe("Suspension ended");
  });

  it("unknown reason reads Other", () => {
    expect(reasonLabel("nope")).toBe("Other");
  });
});

describe("moderation decisions", () => {
  it("dismiss closes with no action; warn/suspend/ban act on the account", () => {
    expect(buildDecisionBody({ ...emptyDecision(), outcome: "dismiss" }, "Task")).toEqual({
      ok: true,
      body: { actions: ["no_action"], finalStatus: "dismissed" },
    });
    expect(buildDecisionBody({ ...emptyDecision(), outcome: "suspend", suspendDays: 3 }, "Task")).toEqual({
      ok: true,
      body: { actions: ["suspend_user"], finalStatus: "actioned", suspendDays: 3 },
    });
    expect(buildDecisionBody({ ...emptyDecision(), outcome: "ban" }, "Provider")).toMatchObject({
      ok: true,
      body: { actions: ["ban_user"] },
    });
  });

  it("a chat report needs the user's id; a short custom message is refused", () => {
    expect(buildDecisionBody(emptyDecision(), "Chat")).toMatchObject({ ok: false });
    expect(
      buildDecisionBody({ ...emptyDecision(), targetUserId: "6650f1c2a9b3e4d5f6a7b8c9" }, "Chat"),
    ).toMatchObject({ ok: true, body: { targetUserId: "6650f1c2a9b3e4d5f6a7b8c9" } });
    expect(buildDecisionBody({ ...emptyDecision(), messageToUser: "bad" }, "Task")).toMatchObject({
      ok: false,
    });
  });
});
