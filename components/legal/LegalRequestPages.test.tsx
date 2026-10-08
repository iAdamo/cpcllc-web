import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import PrivacyRequestForm from "./PrivacyRequestForm";
import CopyrightForms from "./CopyrightForms";
import DmcaPage from "@/app/dmca/page";
import { dmcaAgentComplete } from "@/lib/dmcaAgent";

/**
 * The /privacy-request and /dmca pages as first rendered. Regression guard
 * for the accessibility law: two controls must never share a name, and
 * every control has a label.
 */
const render = (ui: ReactNode) =>
  renderToStaticMarkup(<QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>);

/** The visible label text of each labelled control, by id. */
function labels(html: string): string[] {
  const out: string[] = [];
  for (const m of html.matchAll(/<label[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/label>/g)) {
    out.push(m[2].replace(/<span[^>]*id="[^"]*-hint"[\s\S]*?<\/span>/g, "").replace(/<[^>]+>/g, "").trim());
  }
  return out;
}

function controlIds(html: string): string[] {
  return [...html.matchAll(/<(?:input|textarea|select)[^>]*\sid="([^"]+)"/g)].map((m) => m[1]);
}

function expectNamedOnce(html: string) {
  const names = labels(html);
  expect(names.length).toBeGreaterThan(2);
  expect(new Set(names).size).toBe(names.length);
  const forIds = [...html.matchAll(/<label[^>]*for="([^"]+)"/g)].map((m) => m[1]);
  for (const id of controlIds(html)) expect(forIds).toContain(id);
}

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
    }
  });
});
