import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import TeamInvitePage, { metadata } from "@/app/team-invite/[token]/page";

/**
 * The website fallback for a team invite email link. The team lives in the
 * app, so the page says how to get there; it never shows or sends the token
 * and stays out of search engines.
 */
describe("team invite page", () => {
  it("says how to accept, and what the business will and won't see", () => {
    const html = renderToStaticMarkup(<TeamInvitePage />);
    expect(html).toContain("invited to join a team");
    expect(html).toContain("with the email address this invite was sent to");
    expect(html).toContain("They will see");
    expect(html).toContain("won&#x27;t see");
    expect(html).toContain("Open in CompaniesCenter app");
  });

  it("is kept out of search results and sends no referrer", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.referrer).toBe("no-referrer");
  });
});
