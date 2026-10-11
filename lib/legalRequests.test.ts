import { describe, expect, it } from "vitest";
import {
  RIGHT_OPTIONS,
  appealPayload,
  copyrightPayload,
  counterPayload,
  disputePayload,
  emptyCopyrightForm,
  emptyDisputeForm,
  emptyLegalNoticeForm,
  emptyOptOutForm,
  legalNoticePayload,
  noticeTabFrom,
  optOutPayload,
  emptyCounterForm,
  emptyPrivacyForm,
  isOverdue,
  parseUrls,
  privacyPayload,
  regionLabel,
  arrivedAt,
  emptyRecordForm,
  howItCame,
  isoDay,
  recordPayload,
  type PrivacyForm,
  type RecordForm,
} from "@/lib/legalRequests";
import { DMCA_AGENT, dmcaAgentComplete } from "@/lib/dmcaAgent";

/**
 * The website's privacy-request and DMCA forms (C41, C53). Each form becomes
 * the payload the API validates, or the errors shown beside its fields.
 */
const privacy = (over: Partial<PrivacyForm> = {}): PrivacyForm => ({
  ...emptyPrivacyForm(),
  name: " Ada Obi ",
  email: "ada@example.test",
  rights: ["copy"],
  region: "us",
  usState: "FL",
  confirm: true,
  ...over,
});

describe("privacy request form", () => {
  it("a complete request becomes the API payload, trimmed", () => {
    const r = privacyPayload(privacy({ details: "  all of it  " }));
    expect(r).toEqual({
      ok: true,
      payload: {
        relationship: "self",
        requester: { name: "Ada Obi", email: "ada@example.test" },
        rights: ["copy"],
        region: "us",
        usState: "FL",
        details: "all of it",
      },
    });
  });

  it("names every missing part, beside its field", () => {
    const r = privacyPayload(emptyPrivacyForm());
    expect(r.ok).toBe(false);
    if ("errors" in r) {
      expect(Object.keys(r.errors).sort()).toEqual(["confirm", "email", "name", "region", "rights"]);
    }
  });

  it("an agent must name the person; a US resident must choose a state", () => {
    const r = privacyPayload(privacy({ relationship: "agent", usState: "" }));
    expect("errors" in r && Object.keys(r.errors).sort()).toEqual(["subjectEmail", "subjectName", "usState"]);
  });

  it("outside the US no state is sent; an agent's payload names the person", () => {
    const r = privacyPayload(
      privacy({
        relationship: "agent",
        region: "ng",
        subjectName: "Ben",
        subjectEmail: "ben@example.test",
      }),
    );
    expect(r.ok && r.payload).toMatchObject({
      region: "ng",
      subject: { name: "Ben", email: "ben@example.test" },
    });
    expect(r.ok && "usState" in r.payload).toBe(false);
  });

  it("offers every right the API accepts", () => {
    expect(RIGHT_OPTIONS.map((o) => o.value)).toEqual([
      "know",
      "copy",
      "correct",
      "delete",
      "opt_out",
      "limit_sensitive",
      "withdraw_consent",
      "object",
      "other",
    ]);
  });
});

describe("appeal form", () => {
  it("takes a reference as people type it", () => {
    for (const reference of ["PR-7K3Q9X", "pr7k3q9x", " pr-7k3q9x "]) {
      expect(appealPayload({ reference, email: "a@b.test", reason: "x" }).ok).toBe(true);
    }
    const r = appealPayload({ reference: "12345", email: "nope", reason: " " });
    expect("errors" in r && Object.keys(r.errors).sort()).toEqual(["email", "reason", "reference"]);
  });
});

describe("copyright notice form", () => {
  const notice = () => ({
    ...emptyCopyrightForm(),
    name: "Sam Studio",
    email: "rights@studio.test",
    address: "1 Main St",
    work: "My photo",
    urls: "https://companiescenter.com/post/a\nhttps://companiescenter.com/post/b, https://companiescenter.com/post/a",
    goodFaith: true,
    accurate: true,
    signature: "sam studio",
  });

  it("each link once; the typed name signs it", () => {
    const r = copyrightPayload(notice());
    expect(r.ok && r.payload.urls).toEqual([
      "https://companiescenter.com/post/a",
      "https://companiescenter.com/post/b",
    ]);
    expect(r.ok && r.payload).toMatchObject({ goodFaith: true, accurate: true, signature: "sam studio" });
  });

  it("refuses a signature that isn't the name, unticked statements, and bad links", () => {
    const r = copyrightPayload({
      ...notice(),
      signature: "S.S.",
      goodFaith: false,
      accurate: false,
      urls: "companiescenter.com/post/a",
    });
    expect("errors" in r && Object.keys(r.errors).sort()).toEqual(["accurate", "goodFaith", "signature", "urls"]);
  });

  it("an agent names the owner", () => {
    const r = copyrightPayload({ ...notice(), relationship: "agent" });
    expect("errors" in r && r.errors.organization).toBeTruthy();
  });
});

describe("counter-notice form", () => {
  it("a phone number is required", () => {
    const r = counterPayload({
      ...emptyCounterForm(),
      name: "Ben",
      email: "ben@example.test",
      address: "2 Side St",
      urls: "https://companiescenter.com/post/a",
      mistake: true,
      jurisdiction: true,
      signature: "Ben",
    });
    expect("errors" in r && Object.keys(r.errors)).toEqual(["phone"]);
  });
});

describe("helpers", () => {
  it("parseUrls splits on lines, spaces and commas", () => {
    expect(parseUrls(" a \n\n b,c  a ")).toEqual(["a", "b", "c"]);
  });

  it("overdue only while open", () => {
    const now = new Date("2026-10-08T12:00:00Z");
    expect(isOverdue({ status: "verifying", dueAt: "2026-10-01T00:00:00Z" }, now)).toBe(true);
    expect(isOverdue({ status: "denied", dueAt: "2026-10-01T00:00:00Z" }, now)).toBe(false);
    expect(isOverdue({ status: "received", dueAt: "2026-11-01T00:00:00Z" }, now)).toBe(false);
  });

  it("where they live, in words", () => {
    expect(regionLabel({ region: "us", usState: "FL" })).toBe("United States (Florida)");
    expect(regionLabel({ region: "ng" })).toBe("Nigeria");
  });
});

describe("DMCA designated agent", () => {
  it("shows nothing invented: incomplete until every detail is filled in", () => {
    expect(
      dmcaAgentComplete({ ...DMCA_AGENT, name: "", organization: "", registrationNumber: "", address: [], phone: "", email: "" }),
    ).toBe(false);
    expect(
      dmcaAgentComplete({
        name: "Copyright Agent",
        organization: "Companies Center LLC",
        registrationNumber: "",
        address: ["1 Main St"],
        phone: "+1 555 0100",
        email: "copyright@example.test",
      }),
    ).toBe(false);
    expect(
      dmcaAgentComplete({
        name: "Copyright Agent",
        organization: "Companies Center LLC",
        registrationNumber: "DMCA-0000000",
        address: ["1 Main St"],
        phone: "+1 555 0100",
        email: "copyright@example.test",
      }),
    ).toBe(true);
  });
});

describe("legal notice forms (Terms of Service 39.2, 39.11, 43)", () => {
  it("REGRESSION: the ?form= link opens the right form, and anything else opens the first", () => {
    expect(noticeTabFrom("opt-out")).toBe("opt-out");
    expect(noticeTabFrom("notice")).toBe("notice");
    expect(noticeTabFrom(["opt-out"])).toBe("dispute");
    expect(noticeTabFrom(undefined)).toBe("dispute");
  });

  it("a Notice of Dispute needs the facts, the relief, the accuracy statement and a matching signature", () => {
    const r = disputePayload({ ...emptyDisputeForm(), name: "Ada Obi", email: "ada@x.test", description: "d" });
    expect("errors" in r && Object.keys(r.errors).sort()).toEqual(["accurate", "facts", "relief", "signature"]);
    const ok = disputePayload({
      name: "Ada Obi",
      email: "ada@x.test",
      description: " d ",
      facts: "f",
      relief: "r",
      accurate: true,
      signature: "ada obi",
    });
    expect(ok.ok && ok.payload).toEqual({
      requester: { name: "Ada Obi", email: "ada@x.test" },
      description: "d",
      facts: "f",
      relief: "r",
      accurate: true,
      signature: "ada obi",
    });
  });

  it("an opt-out needs the decision, self-submission and a signature", () => {
    const r = optOutPayload({ ...emptyOptOutForm(), name: "Ada Obi", email: "ada@x.test", signature: "Ada Obi" });
    expect("errors" in r && Object.keys(r.errors).sort()).toEqual(["optOut", "personal"]);
    const ok = optOutPayload({ name: "Ada Obi", email: "ada@x.test", optOut: true, personal: true, signature: "Ada Obi" });
    expect(ok.ok).toBe(true);
  });

  it("another legal notice needs a subject and the notice; the organisation is optional", () => {
    const r = legalNoticePayload({ ...emptyLegalNoticeForm(), name: "Lee", email: "lee@firm.test" });
    expect("errors" in r && Object.keys(r.errors).sort()).toEqual(["details", "title"]);
    const ok = legalNoticePayload({ name: "Lee", email: "lee@firm.test", organization: "", title: "Subpoena", details: "x" });
    expect(ok.ok && "organization" in ok.payload).toBe(false);
  });
});

/**
 * Admin > Record an email or letter. Regression (2026-10-11): the Terms
 * accept a Notice of Dispute and an arbitration opt-out by email or post,
 * from the person or someone they authorise, but staff could only keep
 * those in the inbox. The form becomes the payload POST admin/legal-requests
 * validates, or the errors beside its fields.
 */
describe("recording an email or letter", () => {
  const TODAY = "2026-10-11";
  const form = (over: Partial<RecordForm> = {}): RecordForm => ({ ...emptyRecordForm(TODAY), ...over });
  const errorsOf = (f: RecordForm) => {
    const r = recordPayload(f, TODAY);
    return "errors" in r ? r.errors : {};
  };

  it("an empty form says what is missing; dates start at today", () => {
    expect(emptyRecordForm(TODAY)).toMatchObject({ sentAt: TODAY, receivedAt: TODAY, sendReceipt: true });
    expect(errorsOf(form())).toEqual({
      kind: "Choose what it is.",
      name: "Enter their full name.",
      email: "Give an email address or a postal address.",
      details: "Paste the email, or summarise the letter.",
      sendReceipt: "There is no email address to send it to. Untick this and answer by post.",
    });
  });

  it("a posted opt-out from a representative: no email anywhere, nothing empty sent", () => {
    const r = recordPayload(
      form({
        kind: "arbitration_opt_out",
        receivedBy: "post",
        sentAt: "2026-10-01",
        receivedAt: "2026-10-06",
        name: " Ada Obi ",
        address: "9 Palm Ave\nTampa, FL",
        byRepresentative: true,
        repName: "Lee Counsel",
        repAddress: "1 Law St, Tampa, FL",
        details: " Ada Obi rejects the arbitration agreement. ",
        sendReceipt: false,
        rights: ["copy"],
        urls: "https://companiescenter.com/x",
      }),
      TODAY,
    );
    expect(r).toEqual({
      ok: true,
      payload: {
        kind: "arbitration_opt_out",
        receivedBy: "post",
        sentAt: "2026-10-01",
        receivedAt: "2026-10-06",
        person: { name: "Ada Obi", address: "9 Palm Ave\nTampa, FL" },
        representative: { name: "Lee Counsel", address: "1 Law St, Tampa, FL" },
        details: "Ada Obi rejects the arbitration agreement.",
        sendReceipt: false,
      },
    });
  });

  it("dates must be possible, in words that fit how it came", () => {
    const ok = { kind: "dispute_notice" as const, name: "Ada", email: "ada@x.test", details: "x" };
    expect(errorsOf(form({ ...ok, sentAt: "2026-10-09", receivedAt: "2026-10-08" }))).toEqual({
      sentAt: "It can't have been sent after it arrived.",
    });
    expect(errorsOf(form({ ...ok, sentAt: "2026-10-09", receivedAt: "2026-10-12" }))).toEqual({
      receivedAt: "It can't arrive in the future.",
    });
    expect(errorsOf(form({ ...ok, receivedBy: "post", sentAt: "" }))).toEqual({ sentAt: "Enter the postmark date." });
    expect(errorsOf(form({ ...ok, sentAt: "2026-13-40" }))).toEqual({ sentAt: "Enter the day it was sent." });
    expect(errorsOf(form({ ...ok, sentAt: TODAY, receivedAt: TODAY }))).toEqual({});
  });

  it("the receipt goes to whoever sent it, so it needs their email address", () => {
    const base = { kind: "legal_notice" as const, name: "Ada", email: "ada@x.test", details: "x", byRepresentative: true, repName: "Lee" };
    expect(errorsOf(form({ ...base, repAddress: "1 Law St" }))).toEqual({
      sendReceipt: "There is no email address to send it to. Untick this and answer by post.",
    });
    const r = recordPayload(form({ ...base, repEmail: "lee@firm.test" }), TODAY);
    expect(r.ok && r.payload.representative).toEqual({ name: "Lee", email: "lee@firm.test" });
    expect(errorsOf(form({ ...base, repEmail: "lee@" }))).toEqual({ repEmail: "Enter a valid email address, or leave it empty." });
  });

  it("each kind asks for its own: rights, the appealed reference, links", () => {
    const base = { name: "Ada", email: "ada@x.test", details: "x" };
    expect(errorsOf(form({ ...base, kind: "privacy" }))).toEqual({ rights: "Choose at least one request." });
    const privacy = recordPayload(form({ ...base, kind: "privacy", rights: ["delete"], region: "ng" }), TODAY);
    expect(privacy.ok && [privacy.payload.rights, privacy.payload.region]).toEqual([["delete"], "ng"]);
    expect(errorsOf(form({ ...base, kind: "appeal", appealOf: "nope" }))).toEqual({
      appealOf: "Enter the reference of the decided request, like PR-7K3Q9X.",
    });
    const appeal = recordPayload(form({ ...base, kind: "appeal", appealOf: " pr-7k3q9x " }), TODAY);
    expect(appeal.ok && appeal.payload.appealOf).toBe("pr-7k3q9x");
    expect(errorsOf(form({ ...base, kind: "copyright", urls: "ftp://x" }))).toEqual({
      urls: "Each link must start with https:// (or http://).",
    });
    const copyright = recordPayload(form({ ...base, kind: "copyright" }), TODAY);
    expect(copyright.ok && "urls" in copyright.payload).toBe(false);
  });

  it("how it came, and when it arrived, for the request panel", () => {
    const history = [{ status: "received", by: "s1", at: "2026-10-06T00:00:00.000Z" }];
    const recorded = { receivedBy: "post" as const, sentAt: "2026-10-01T00:00:00.000Z", history, createdAt: "2026-10-11T15:00:00.000Z" };
    expect(howItCame(recorded)).toBe("By post, postmarked October 1, 2026; arrived October 6, 2026");
    expect(howItCame({ ...recorded, receivedBy: "email" })).toBe("By email, sent October 1, 2026; arrived October 6, 2026");
    expect(arrivedAt(recorded)).toBe("2026-10-06T00:00:00.000Z");
    expect(howItCame({ history: [], createdAt: "2026-10-11T15:00:00.000Z" })).toBe("Website form");
    expect(isoDay(new Date("2026-10-11T23:59:00Z"))).toBe("2026-10-11");
  });
});
