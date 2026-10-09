import { describe, expect, it } from "vitest";
import {
  INVITE_LABELS,
  INVITE_TONE,
  ROLE_LABELS,
  completionLine,
  pageCount,
  sortMembers,
  type InviteStatus,
  type TeamRole,
} from "@/lib/teams";

/** The admin's Teams view (support only: members, invites, counts). */
describe("teams", () => {
  it("lists current members by role then name, people who left last", () => {
    const m = (name: string, role: TeamRole, status: "ACTIVE" | "REMOVED" = "ACTIVE") => ({ name, role, status });
    const sorted = sortMembers([
      m("Carlos Rodriguez", "EMPLOYEE"),
      m("Ana Torres", "EMPLOYEE", "REMOVED"),
      m("Luis Armas", "OWNER"),
      m("David Perez", "EMPLOYEE"),
      m("Maria Lopez", "SUPERVISOR"),
      m("John Smith", "MANAGER"),
    ]).map((x) => x.name);
    expect(sorted).toEqual(["Luis Armas", "John Smith", "Maria Lopez", "Carlos Rodriguez", "David Perez", "Ana Torres"]);
  });

  it("says how many assigned copies are done, and nothing when there are none", () => {
    expect(completionLine({ pending: 3, completed: 7 })).toBe("7 of 10 assigned copies completed");
    expect(completionLine({ pending: 0, completed: 0 })).toBeNull();
  });

  it("pages of 25", () => {
    expect(pageCount({ total: 0, limit: 25 })).toBe(1);
    expect(pageCount({ total: 25, limit: 25 })).toBe(1);
    expect(pageCount({ total: 26, limit: 25 })).toBe(2);
  });

  it("has a label for every role and invite status the API sends", () => {
    const roles: TeamRole[] = ["OWNER", "MANAGER", "SUPERVISOR", "EMPLOYEE"];
    const statuses: InviteStatus[] = ["PENDING", "ACCEPTED", "DECLINED", "EXPIRED", "CANCELLED"];
    for (const r of roles) expect(ROLE_LABELS[r]).toBeTruthy();
    for (const s of statuses) expect([INVITE_LABELS[s], INVITE_TONE[s]].every(Boolean)).toBe(true);
  });
});
