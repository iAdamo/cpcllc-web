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
});
