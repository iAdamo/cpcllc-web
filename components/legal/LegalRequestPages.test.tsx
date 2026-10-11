import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import PrivacyRequestForm from "./PrivacyRequestForm";
import CopyrightForms from "./CopyrightForms";
import LegalNoticeForms from "./LegalNoticeForms";
import DmcaPage from "@/app/dmca/page";
import { DMCA_AGENT, dmcaAgentComplete } from "@/lib/dmcaAgent";
import { expectNamedOnce } from "@/lib/testing/labelledControls";

/**
 * The /privacy-request and /dmca pages as first rendered. Regression guard
 * for the accessibility law: two controls must never share a name, and
 * every control has a label.
 */
const render = (ui: ReactNode) =>
  renderToStaticMarkup(<QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>);

describe("privacy request page", () => {
  it("opens on the request form; every control labelled, no two alike", () => {
    const html = render(<PrivacyRequestForm />);
    expect(html).toContain('aria-selected="true" aria-controls="panel-request"');
    expect(html).toContain("What would you like us to do?");
    expectNamedOnce(html);
  });

  it("the link in a decision email opens the appeal, reference filled in", () => {
    const html = render(<PrivacyRequestForm appeal="PR-7K3Q9X" />);
    expect(html).toContain('aria-selected="true" aria-controls="panel-appeal"');
    expect(html).toContain('value="PR-7K3Q9X"');
    expect(html).not.toContain("What would you like us to do?");
    expectNamedOnce(html);
  });
});

describe("DMCA page", () => {
  it("one form at a time; every control labelled, no two alike", () => {
    const html = render(<CopyrightForms />);
    expect(html).toContain("Send notice");
    expect(html).not.toContain("Send counter-notice</button>");
    expectNamedOnce(html);
  });

  it("states the procedure and invents no agent details", () => {
    const html = render(<DmcaPage />);
    for (const part of ["Sending a notice", "Counter-notices", "Repeat infringers", "False claims", "512(f)"]) {
      expect(html).toContain(part);
    }
    if (!dmcaAgentComplete()) {
      expect(html).toContain("registered contact details are being added");
      expect(html).not.toMatch(/DMCA-\d/);
    } else {
      expect(html).toContain("U.S. Copyright Office registration");
      expect(html).toContain(DMCA_AGENT.registrationNumber);
      expect(html).toContain(DMCA_AGENT.name);
    }
  });
});

describe("legal notices page", () => {
  it("each form on its own; every control labelled, no two alike", () => {
    for (const initial of ["dispute", "opt-out", "notice"] as const) {
      const html = render(<LegalNoticeForms initial={initial} />);
      expect(html).toContain(`aria-selected="true" aria-controls="panel-${initial}"`);
      expectNamedOnce(html);
    }
  });

  // Terms of Service 39.11 (2026-10-11): 30 days from accepting the current
  // version, and a representative may opt out for someone by email or post.
  // The form had said "first accept a version" and "only you can submit".
  it("the opt-out form states the 30-day rule, asks for self-submission, and names the representative route", () => {
    const html = render(<LegalNoticeForms initial="opt-out" />);
    expect(html).toContain("within 30 days after you accept the current version");
    expect(html).toContain("I am submitting this opt-out myself");
    expect(html).toContain("someone you have authorized can opt out for you by email or post");
    expect(html).not.toMatch(/Only you can submit|first accept a version/);
  });

  // Terms of Service 39.2: up to 60 days from receipt; no special website
  // function is required, so the form says it is optional.
  it("the dispute form counts 60 days from receipt and says it is optional", () => {
    const html = render(<LegalNoticeForms initial="dispute" />);
    expect(html).toContain("up to 60 days from when we receive it");
    expect(html).toContain("This form is optional");
  });
});
