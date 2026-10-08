import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import LegalLayout from "./LegalLayout";
import { LEGAL_END_ATTR } from "@/lib/terms";

describe("LegalLayout", () => {
  it("marks the end of the document after its text", () => {
    // The website's Terms acceptance unlocks Accept only once this marker is
    // in view; before the text, it would unlock at the top.
    const html = renderToStaticMarkup(
      <LegalLayout title="Privacy Policy">
        <p>LAST-PARAGRAPH</p>
      </LegalLayout>,
    );
    const marker = html.indexOf(`${LEGAL_END_ATTR}=""`);
    expect(marker).toBeGreaterThan(-1);
    expect(marker).toBeGreaterThan(html.indexOf("LAST-PARAGRAPH"));
  });

  it("the header shows the document's own date", () => {
    const html = renderToStaticMarkup(
      <LegalLayout title="Terms of Service" lastUpdated="October 8, 2026">
        <p>x</p>
      </LegalLayout>,
    );
    expect(html).toContain("Last updated: October 8, 2026");
    expect(html).not.toContain("Effective Date");
  });
});

describe("Markdown", () => {
  it("renders a list block as a list, joining wrapped lines", async () => {
    const { default: Markdown } = await import("./Markdown");
    const html = renderToStaticMarkup(
      <Markdown source={"Users may not:\n\n- create **fake** reviews;\n- review a service\nthey did not use."} />,
    );
    expect(html).toBe(
      "<p>Users may not:</p><ul><li>create <strong>fake</strong> reviews;</li><li>review a service they did not use.</li></ul>",
    );
  });
});
