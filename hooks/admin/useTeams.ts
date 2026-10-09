"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { adminKeys } from "@/hooks/admin/adminQueryKeys";
import { getAdminTeam, getAdminTeams } from "@/axios/teams";

/** Companies with a team, newest first; search by company name. */
export function useAdminTeams(filter: { search: string; page: number }) {
  return useQuery({
    queryKey: adminKeys.teamsView(filter),
    queryFn: () => getAdminTeams(filter),
    placeholderData: keepPreviousData,
  });
}

/** One company's team: members, invites, settings, counts. */
export function useAdminTeam(companyId: string | null) {
  return useQuery({
    queryKey: adminKeys.team(companyId ?? "none"),
    queryFn: () => getAdminTeam(companyId as string),
    enabled: !!companyId,
  });
}
