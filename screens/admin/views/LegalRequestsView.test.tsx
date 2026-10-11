import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { RequestBody } from "./LegalRequestsView";
import { RecordRequestForm } from "./legal-requests/RecordRequestForm";
import { emptyRecordForm, type LegalRequestDetail } from "@/lib/legalRequests";
import { expectNamedOnce } from "@/lib/testing/labelledControls";

/**
 * Admin > Privacy & Copyright Requests: recording an email or a letter, and
 * the request panel for one. Regression (2026-10-11): notices the Terms
 * accept by email or post (Sections 39.2, 39.11) could not be recorded, and
 * the panel assumed every request had an email address and came from the
 * website.
 */
const render = (ui: ReactNode) =>
  renderToStaticMarkup(<QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>);
const noop = () => {};
const TODAY = "2026-10-11";

describe("record an email or letter", () => {
  it("opens empty on today's dates; every control labelled, no two alike", () => {
    const html = render(<RecordRequestForm onRecorded={noop} onCancel={noop} today={TODAY} />);
    expect(html).toContain("Record an email or letter");
    expect(html).toMatch(new RegExp(`<input id="rec-sentAt" type="date"[^>]*value="${TODAY}"`));
    expect(html).toMatch(new RegExp(`<input id="rec-receivedAt" type="date"[^>]*value="${TODAY}"`));
    expect(html).toContain("Day it was sent");
    expect(html).toContain("Needs their email address. Without one, answer by post.");
    expect(html).not.toContain("They asked to");
    expectNamedOnce(html);
  });

  it("a privacy request by post from a representative: rights, postmark, receipt to the representative", () => {
    const html = render(
      <RecordRequestForm
        onRecorded={noop}
        onCancel={noop}
        today={TODAY}
        initial={{
          ...emptyRecordForm(TODAY),
          kind: "privacy",
          receivedBy: "post",
          byRepresentative: true,
          repEmail: "lee@firm.test",
        }}
      />,
    );
    expect(html).toContain("Postmark date");
    expect(html).toContain("They asked to");
    expect(html).toContain("Representative&#x27;s postal address");
    expect(html).toContain("To lee@firm.test. It gives the reference and says it was sent to us by post.");
    expect(html).toContain("Summarise the letter, and keep the letter on file.");
    expectNamedOnce(html);
  });
});

const recorded: LegalRequestDetail = {
  _id: "r1",
  reference: "OO-8RZ4KM",
  kind: "arbitration_opt_out",
  status: "received",
  relationship: "agent",
  requester: { name: "Lee Counsel", address: "1 Law St, Tampa, FL" },
  subject: { name: "Ada Obi", email: "ada@example.test" },
  receivedBy: "post",
  sentAt: "2026-10-01T00:00:00.000Z",
  details: "Ada Obi rejects the arbitration agreement.",
  dueAt: "2026-10-08T00:00:00.000Z",
  createdAt: "2026-10-11T15:00:00.000Z",
  notes: [],
  history: [{ status: "received", by: "staff1", at: "2026-10-06T00:00:00.000Z" }],
  appeals: [],
  original: null,
  strikes: null,
  repeatInfringerStrikes: 3,
  restoreWindow: null,
  optOutCheck: { acceptances: [], currentVersion: "v2.0", firstAcceptedCurrentAt: null, inTime: true },
};

describe("a recorded request", () => {
  it("says how it came and who sent it, with no email link and no email promised", () => {
    const html = render(<RequestBody r={recorded} onOpen={noop} />);
    expect(html).toContain("Sent by (for them)");
    expect(html).not.toContain("mailto:");
    expect(html).toContain("By post, postmarked October 1, 2026; arrived October 6, 2026");
    expect(html).toContain("What the letter says");
    expect(html).toContain("October 6, 2026: Received (recorded by staff)");
    expect(html).toContain("In time: sent within 30 days");
    expect(html).toContain("There is no email address: nothing is emailed.");
    expect(html).not.toContain("Sent word for word, by email.");
  });

  it("a website filing still reads as one", () => {
    const filed: LegalRequestDetail = {
      ...recorded,
      kind: "dispute_notice",
      relationship: undefined,
      requester: { name: "Ada Obi", email: "ada@example.test" },
      subject: undefined,
      receivedBy: undefined,
      sentAt: undefined,
      optOutCheck: null,
      history: [{ status: "received", at: "2026-10-06T00:00:00.000Z" }],
    };
    const html = render(<RequestBody r={filed} onOpen={noop} />);
    expect(html).toContain("Filed by");
    expect(html).toContain('href="mailto:ada@example.test"');
    expect(html).toContain("Website form");
    expect(html).toContain("(filed)");
    expect(html).toContain("runs from October 6, 2026, when it arrived");
    expect(html).toContain("Sent word for word, by email.");
  });
});
