import { describe, expect, it } from "vitest";
import {
  buildDecisionBody,
  buildEvidenceBody,
  buildMessageBody,
  buildOpenCaseBody,
  caseStatusLabel,
  decisionConfirmLabel,
  emptyDecision,
  emptyMessage,
  emptyOpenCase,
  isOpenCase,
  partyLabel,
  sideOf,
} from "./disputeCase";

const theCase = {
  raisedBy: { _id: "c1", firstName: "Ada", lastName: "Obi" },
  respondent: { _id: "o1", firstName: "Ben", lastName: "Cole" },
  job: { userId: "c1" },
  provider: { owner: "o1", providerName: "Bright Plumbing" },
};

describe("people in a case", () => {
  it("knows each side from the job", () => {
    expect(sideOf(theCase, theCase.raisedBy)).toBe("client");
    expect(sideOf(theCase, theCase.respondent)).toBe("provider");
    expect(partyLabel(theCase, "raisedBy")).toBe("Ada Obi (client)");
    expect(partyLabel(theCase, "respondent")).toBe("Ben Cole (Bright Plumbing)");
  });

  it("a case with no job just names them", () => {
    const c = { raisedBy: theCase.raisedBy, respondent: theCase.respondent };
    expect(sideOf(c, c.raisedBy)).toBe("");
    expect(partyLabel(c, "respondent")).toBe("Ben Cole");
  });

  it("status words", () => {
    expect(caseStatusLabel("resolved")).toBe("Decided");
    expect(caseStatusLabel("awaiting_evidence")).toBe("Awaiting evidence");
    expect(isOpenCase("escalated")).toBe(true);
    expect(isOpenCase("resolved")).toBe(false);
  });
});

describe("opening a case", () => {
  it("from a job sends who raised it; from a ticket it doesn't", () => {
    const form = { ...emptyOpenCase("Still leaking"), raisedBySide: "provider" as const };
    expect(buildOpenCaseBody({ job: "t1" }, form)).toEqual({
      ok: true,
      body: {
        job: "t1",
        reason: "quality_issue",
        summary: "Still leaking",
        priority: "normal",
        raisedBySide: "provider",
      },
    });
    const fromTicket = buildOpenCaseBody({ ticket: "k1" }, form);
    expect(fromTicket.ok && fromTicket.body).not.toHaveProperty("raisedBySide");
  });

  it("needs a summary under 300 characters", () => {
    expect(buildOpenCaseBody({ job: "t1" }, emptyOpenCase("  "))).toMatchObject({ ok: false });
    expect(
      buildOpenCaseBody({ job: "t1" }, { ...emptyOpenCase(), summary: "x".repeat(301) }),
    ).toMatchObject({ ok: false });
  });

  it("a ticket with no other side needs the person picked", () => {
    const form = emptyOpenCase("Not paid");
    expect(buildOpenCaseBody({ ticket: "k1" }, form, { needsRespondent: true })).toMatchObject({ ok: false });
    expect(buildOpenCaseBody({ ticket: "k1" }, form, { id: "u2", needsRespondent: true })).toMatchObject({
      ok: true,
      body: { ticket: "k1", respondent: "u2" },
    });
  });

  it("prefill is cut to the limit", () => {
    expect(emptyOpenCase("y".repeat(400)).summary).toHaveLength(300);
  });
});

describe("messages", () => {
  it("an internal note never carries an audience", () => {
    expect(buildMessageBody({ ...emptyMessage(), body: "Check jobs", audience: "internal", awaitingReply: true })).toEqual({
      ok: true,
      body: { body: "Check jobs", isInternal: true },
    });
  });

  it("to one side, waiting for their reply", () => {
    expect(
      buildMessageBody({ body: " Send photos ", audience: "respondent", awaitingReply: true }),
    ).toEqual({ ok: true, body: { body: "Send photos", audience: "respondent", awaitingReply: true } });
  });

  it("an empty message is refused", () => {
    expect(buildMessageBody(emptyMessage())).toMatchObject({ ok: false });
  });
});

describe("evidence", () => {
  it("needs a description; a link must be http(s)", () => {
    expect(buildEvidenceBody({ type: "photo", description: "", url: "" })).toMatchObject({ ok: false });
    expect(
      buildEvidenceBody({ type: "photo", description: "Photos", url: "javascript:alert(1)" }),
    ).toMatchObject({ ok: false });
    expect(
      buildEvidenceBody({ type: "photo", description: "Photos", url: "https://x.test/a.jpg" }),
    ).toEqual({ ok: true, body: { type: "photo", description: "Photos", url: "https://x.test/a.jpg" } });
  });
});

describe("the decision", () => {
  it("without an account action: outcome and reasons only", () => {
    expect(buildDecisionBody({ ...emptyDecision(), rationale: "Photos show it." })).toEqual({
      ok: true,
      body: { outcome: "favor_client", rationale: "Photos show it." },
    });
    expect(buildDecisionBody(emptyDecision())).toMatchObject({ ok: false });
  });

  it("a suspension names the person, the reason, the message and how long", () => {
    const form = {
      ...emptyDecision(),
      rationale: "Left unfinished.",
      act: true,
      type: "suspension" as const,
      message: "You left the job unfinished.",
      durationHours: 168,
    };
    expect(buildDecisionBody(form)).toEqual({
      ok: true,
      body: {
        outcome: "favor_client",
        rationale: "Left unfinished.",
        accountAction: {
          target: "respondent",
          type: "suspension",
          reasonCode: "terms",
          message: "You left the job unfinished.",
          durationHours: 168,
        },
      },
    });
    expect(decisionConfirmLabel(form, "Ben Cole")).toBe("Decide and suspend Ben Cole for 7 days");
  });

  it("a warning or permanent suspension sends no duration", () => {
    const body = buildDecisionBody({
      ...emptyDecision(),
      rationale: "x",
      act: true,
      type: "ban",
      message: "Threats made to the client.",
    });
    expect(body.ok && body.body.accountAction).not.toHaveProperty("durationHours");
  });

  it("an action needs a real message and a preset duration", () => {
    const base = { ...emptyDecision(), rationale: "x", act: true };
    expect(buildDecisionBody({ ...base, message: "short" })).toMatchObject({ ok: false });
    expect(
      buildDecisionBody({ ...base, type: "suspension", message: "Long enough here.", durationHours: 5 }),
    ).toMatchObject({ ok: false });
  });
});
