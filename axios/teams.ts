import { ApiClientSingleton } from "@/axios/conf";
import type { TeamDetail, TeamsPage } from "@/lib/teams";

const { axiosInstance } = ApiClientSingleton.getInstance();

/** Team Tasks support view (admin/marketplace/teams, teams:read). */
export async function getAdminTeams(filter: {
  search?: string;
  page?: number;
}): Promise<TeamsPage> {
  const { data } = await axiosInstance.get("admin/marketplace/teams", {
    params: {
      ...(filter.search ? { search: filter.search } : {}),
      page: filter.page ?? 1,
      limit: 25,
    },
  });
  return data;
}

export async function getAdminTeam(companyId: string): Promise<TeamDetail> {
  const { data } = await axiosInstance.get(
    `admin/marketplace/teams/${encodeURIComponent(companyId)}`,
  );
  return data;
}
