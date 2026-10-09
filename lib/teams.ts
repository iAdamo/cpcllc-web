/**
 * Team Tasks as the admin sees it (GET admin/marketplace/teams, teams:read):
 * which companies have a team, who is in it, open invites, and counts.
 * Never task titles, notes or comments: those are the company's own records
 * (cpcllc-backend docs/team-tasks.md).
 */
export type TeamRole = "OWNER" | "MANAGER" | "SUPERVISOR" | "EMPLOYEE";
export type MemberStatus = "ACTIVE" | "REMOVED";
export type InviteStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED" | "CANCELLED";

export interface TeamCounts {
  members: number;
  openInvites: number;
  tasks: { open: number; done: number; archived: number };
  copies: { pending: number; completed: number };
}

export interface TeamRow extends TeamCounts {
  companyId: string;
  company: string;
  startedAt: string | null;
}

export interface TeamsPage {
  items: TeamRow[];
  total: number;
  page: number;
  limit: number;
}

export interface TeamDetail {
  companyId: string;
  company: string;
  settings: { timezone: string; supervisorsCanAssign: boolean };
  members: Array<{
    memberId: string;
    name: string;
    email: string | null;
    role: TeamRole;
    status: MemberStatus;
    joinedAt: string | null;
    endedAt: string | null;
  }>;
  invites: Array<{
    inviteId: string;
    email: string;
    role: TeamRole;
    status: InviteStatus;
    expiresAt: string;
    sends: number;
  }>;
  counts: TeamCounts;
}

export const ROLE_LABELS: Record<TeamRole, string> = {
  OWNER: "Owner",
  MANAGER: "Manager",
  SUPERVISOR: "Supervisor",
  EMPLOYEE: "Employee",
};

export const INVITE_LABELS: Record<InviteStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
};

export const INVITE_TONE: Record<InviteStatus, "yellow" | "green" | "slate" | "rose"> = {
  PENDING: "yellow",
  ACCEPTED: "green",
  DECLINED: "rose",
  EXPIRED: "slate",
  CANCELLED: "slate",
};

const ROLE_ORDER: TeamRole[] = ["OWNER", "MANAGER", "SUPERVISOR", "EMPLOYEE"];

/** Current members first (by role, then name), then people who left or were removed. */
export function sortMembers<T extends { role: TeamRole; status: MemberStatus; name: string }>(
  members: readonly T[],
): T[] {
  return [...members].sort((a, b) => {
    if (a.status !== b.status) return a.status === "ACTIVE" ? -1 : 1;
    const r = ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role);
    return r !== 0 ? r : a.name.localeCompare(b.name);
  });
}

/** "7 of 10 copies done" for the counts line; nothing to say with no copies. */
export function completionLine(c: TeamCounts["copies"]): string | null {
  const total = c.pending + c.completed;
  if (!total) return null;
  return `${c.completed} of ${total} assigned copies completed`;
}

export const pageCount = (p: Pick<TeamsPage, "total" | "limit">): number =>
  Math.max(1, Math.ceil(p.total / Math.max(1, p.limit)));
