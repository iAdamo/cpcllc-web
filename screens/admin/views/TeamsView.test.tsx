import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TeamDetailPanel, TeamsView } from "./TeamsView";
import { adminKeys } from "@/hooks/admin/adminQueryKeys";
import type { TeamDetail, TeamsPage } from "@/lib/teams";

/**
 * The admin's Teams view, rendered from the API's response shapes
 * (cpcllc-backend admin-teams.service.ts). What it must never do: show the
 * company's own records. The API doesn't send them; the view says so.
 */
const counts = {
  members: 5,
  openInvites: 1,
  tasks: { open: 2, done: 1, archived: 0 },
  copies: { pending: 3, completed: 7 },
};

const page: TeamsPage = {
  items: [{ companyId: "c1", company: "De Armas Team Corp", startedAt: "2026-10-08T12:00:00.000Z", ...counts }],
  total: 1,
  page: 1,
  limit: 25,
};

const detail: TeamDetail = {
  companyId: "c1",
  company: "De Armas Team Corp",
  settings: { timezone: "America/New_York", supervisorsCanAssign: false },
  members: [
    { memberId: "m2", name: "Carlos Rodriguez", email: "carlos@example.com", role: "EMPLOYEE", status: "ACTIVE", joinedAt: "2026-10-08T13:00:00.000Z", endedAt: null },
    { memberId: "m1", name: "Luis Armas", email: "luis@example.com", role: "OWNER", status: "ACTIVE", joinedAt: "2026-10-08T12:00:00.000Z", endedAt: null },
    { memberId: "m3", name: "Ana Torres", email: null, role: "EMPLOYEE", status: "REMOVED", joinedAt: "2026-10-08T14:00:00.000Z", endedAt: "2026-10-09T09:00:00.000Z" },
  ],
  invites: [{ inviteId: "i1", email: "david@example.com", role: "EMPLOYEE", status: "PENDING", expiresAt: "2026-10-15T12:00:00.000Z", sends: 2 }],
  counts,
};

describe("Teams view", () => {
  it("lists companies with their counts and says what it never shows", () => {
    const qc = new QueryClient();
    qc.setQueryData(adminKeys.teamsView({ search: "", page: 1 }), page);
    const html = renderToStaticMarkup(
      <QueryClientProvider client={qc}>
        <TeamsView />
      </QueryClientProvider>,
    );
    expect(html).toContain("De Armas Team Corp");
    expect(html).toContain("5 members · 1 open invite · 2 open, 1 done, 0 archived");
    expect(html).toContain("not shown here");
    expect(html).toContain('<label for="teams-search">Business name</label>');
    expect(html).toContain("Choose a company to see its team.");
  });

  it("a team: members (current first, by role), invites, settings", () => {
    const html = renderToStaticMarkup(<TeamDetailPanel team={detail} />);
    const order = ["Luis Armas", "Carlos Rodriguez", "Ana Torres"].map((n) => html.indexOf(n));
    expect(order.every((i, k) => i > -1 && (k === 0 || i > order[k - 1]))).toBe(true);
    expect(html).toContain("Left or removed");
    expect(html).toContain("david@example.com");
    expect(html).toContain("sent 2×");
    expect(html).toContain("America/New_York");
    expect(html).toContain("7 of 10 assigned copies completed");
  });
});
