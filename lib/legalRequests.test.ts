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
  type PrivacyForm,
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
