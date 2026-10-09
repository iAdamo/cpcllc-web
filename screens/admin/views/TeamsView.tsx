"use client";

import { useState } from "react";
import { Loader2, Lock, Search, UsersRound } from "lucide-react";
import { PanelCard } from "@/components/admin/PanelCard";
import { StatusPill } from "@/components/admin/StatusPill";
import { useAdminTeam, useAdminTeams } from "@/hooks/admin/useTeams";
import {
  INVITE_LABELS,
  INVITE_TONE,
  ROLE_LABELS,
  completionLine,
  pageCount,
  sortMembers,
  type TeamDetail,
} from "@/lib/teams";

const day = (v?: string | null) =>
  v ? new Date(v).toLocaleDateString(undefined, { dateStyle: "medium" }) : "";

const statusOf = (err: unknown) =>
  (err as { response?: { status?: number } } | null)?.response?.status;

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-100 dark:border-slate-800 px-3 py-2">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-base font-semibold tabular-nums text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}

/**
 * Team Tasks support view (teams:read): which companies have a team, who is
 * in it, open invites, and counts, for answering "my employee can't see the
 * invite" or "who removed me". Task titles, notes and comments are the
 * company's own records and are never shown here (the API doesn't send them).
 */
export function TeamsView() {
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const list = useAdminTeams({ search, page });
  const data = list.data;
  const denied = statusOf(list.error) === 403;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center">
          <UsersRound size={20} aria-hidden />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Teams</h2>
          <p className="text-sm text-slate-500">
            Businesses that give their people tasks in the app. Members, invites and counts only.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
        <Lock size={16} className="mt-0.5 flex-none text-slate-400" aria-hidden />
        <p>
          Task names, notes and completion comments belong to each business and are not shown here.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard title="Companies with a team">
          <form
            className="flex items-end gap-2 mb-4"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(q.trim());
              setPage(1);
            }}
          >
            <div className="flex-1 text-xs text-slate-500">
              <label htmlFor="teams-search">Business name</label>
              <input
                id="teams-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="De Armas"
                className="mt-1 block w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-800 dark:text-slate-100"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand-900 text-white text-sm font-medium"
            >
              <Search size={14} aria-hidden /> Search
            </button>
          </form>

          {list.isLoading ? (
            <div className="py-12 flex justify-center text-slate-400">
              <Loader2 className="animate-spin" size={20} aria-label="Loading teams" />
            </div>
          ) : denied ? (
            <p className="py-10 text-center text-sm text-slate-500">
              Your role doesn&apos;t include Teams (teams:read).
            </p>
          ) : list.isError ? (
            <div className="py-10 text-center text-sm text-slate-500 space-y-3">
              <p>Couldn&apos;t load teams.</p>
              <button
                type="button"
                onClick={() => void list.refetch()}
                className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm"
              >
                Try again
              </button>
            </div>
          ) : !data?.items.length ? (
            <p className="py-10 text-center text-sm text-slate-500">
              {search ? `No team matches "${search}".` : "No business has started a team yet."}
            </p>
          ) : (
            <>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.items.map((row) => {
                  const id = String(row.companyId);
                  const selected = id === openId;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => setOpenId(id)}
                        aria-pressed={selected}
                        className={`w-full text-left px-3 py-3 rounded-lg transition ${
                          selected ? "bg-brand-50 dark:bg-brand-900/30" : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-medium text-slate-900 dark:text-white truncate">{row.company}</span>
                          <span className="text-xs text-slate-400 flex-none">Started {day(row.startedAt)}</span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500 tabular-nums">
                          {row.members} {row.members === 1 ? "member" : "members"} · {row.openInvites} open{" "}
                          {row.openInvites === 1 ? "invite" : "invites"} · {row.tasks.open} open,{" "}
                          {row.tasks.done} done, {row.tasks.archived} archived
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
              {pageCount(data) > 1 ? (
                <div className="mt-4 flex items-center justify-between text-sm">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-slate-500 tabular-nums">
                    Page {page} of {pageCount(data)}
                  </span>
                  <button
                    type="button"
                    disabled={page >= pageCount(data)}
                    onClick={() => setPage((p) => p + 1)}
                    className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              ) : null}
            </>
          )}
        </PanelCard>

        <TeamPanel companyId={openId} />
      </div>
    </div>
  );
}

function TeamPanel({ companyId }: { companyId: string | null }) {
  const team = useAdminTeam(companyId);
  if (!companyId) {
    return (
      <PanelCard title="Team">
        <p className="py-10 text-center text-sm text-slate-500">Choose a company to see its team.</p>
      </PanelCard>
    );
  }
  if (team.isLoading) {
    return (
      <PanelCard title="Team">
        <div className="py-12 flex justify-center text-slate-400">
          <Loader2 className="animate-spin" size={20} aria-label="Loading team" />
        </div>
      </PanelCard>
    );
  }
  if (team.isError || !team.data) {
    return (
      <PanelCard title="Team">
        <p className="py-10 text-center text-sm text-slate-500">
          {statusOf(team.error) === 404 ? "This company has no team." : "Couldn't load this team."}
        </p>
      </PanelCard>
    );
  }
  return <TeamDetailPanel team={team.data} />;
}

export function TeamDetailPanel({ team }: { team: TeamDetail }) {
  const done = completionLine(team.counts.copies);
  return (
    <PanelCard title={team.company}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Stat label="Members" value={team.counts.members} />
          <Stat label="Open invites" value={team.counts.openInvites} />
          <Stat label="Open tasks" value={team.counts.tasks.open} />
          <Stat label="Done tasks" value={team.counts.tasks.done} />
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-slate-500">Time zone (due dates)</dt>
            <dd className="text-slate-800 dark:text-slate-100">{team.settings.timezone}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Supervisors can assign tasks</dt>
            <dd className="text-slate-800 dark:text-slate-100">{team.settings.supervisorsCanAssign ? "On" : "Off"}</dd>
          </div>
          {done ? (
            <div className="sm:col-span-2">
              <dt className="text-xs text-slate-500">Completion</dt>
              <dd className="text-slate-800 dark:text-slate-100 tabular-nums">
                {done} · {team.counts.tasks.archived} archived tasks
              </dd>
            </div>
          ) : null}
        </dl>

        <section>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Members</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500">
                  <th className="py-2 pr-3 font-medium">Name</th>
                  <th className="py-2 pr-3 font-medium">Role</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 font-medium">Dates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sortMembers(team.members).map((m) => (
                  <tr key={String(m.memberId)}>
                    <td className="py-2 pr-3">
                      <div className="text-slate-900 dark:text-white">{m.name}</div>
                      {m.email ? <div className="text-xs text-slate-500">{m.email}</div> : null}
                    </td>
                    <td className="py-2 pr-3 text-slate-700 dark:text-slate-200">{ROLE_LABELS[m.role]}</td>
                    <td className="py-2 pr-3">
                      <StatusPill label={m.status === "ACTIVE" ? "Active" : "Left or removed"} tone={m.status === "ACTIVE" ? "green" : "slate"} />
                    </td>
                    <td className="py-2 text-xs text-slate-500 whitespace-nowrap">
                      {m.joinedAt ? `Joined ${day(m.joinedAt)}` : ""}
                      {m.endedAt ? ` · Ended ${day(m.endedAt)}` : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Invites</h4>
          {team.invites.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500">
                    <th className="py-2 pr-3 font-medium">Email</th>
                    <th className="py-2 pr-3 font-medium">Role</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                    <th className="py-2 font-medium">Expires</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {team.invites.map((i) => (
                    <tr key={String(i.inviteId)}>
                      <td className="py-2 pr-3 text-slate-900 dark:text-white break-all">{i.email}</td>
                      <td className="py-2 pr-3 text-slate-700 dark:text-slate-200">{ROLE_LABELS[i.role]}</td>
                      <td className="py-2 pr-3">
                        <StatusPill label={INVITE_LABELS[i.status]} tone={INVITE_TONE[i.status]} />
                      </td>
                      <td className="py-2 text-xs text-slate-500 whitespace-nowrap tabular-nums">
                        {day(i.expiresAt)} · sent {i.sends}×
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No invites.</p>
          )}
        </section>
      </div>
    </PanelCard>
  );
}
