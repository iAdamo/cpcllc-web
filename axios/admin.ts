import { ApiClientSingleton } from "@/axios/conf";
import type {
  MetricsResponse,
  MetricsRequest,
  SystemHealthSnapshot,
  AdminUserMe,
  TicketStats,
  DisputeStats,
  FraudStats,
  SubscriptionStats,
  AdminErrorItem,
  AdminErrorStats,
  AdminErrorPage,
  AdminErrorFilters,
  MonitoringSnapshot,
} from "@/types";
import type {
  AdminClientsBundle,
  AdminOverviewShape,
  AdminProviderDetail,
  AdminProvidersBundle,
  AdminTaskDetail,
  AdminTasksBundle,
  AdminUserDetail,
  AdminUsersBundle,
} from "@/types/admin-marketplace";

const { axiosInstance } = ApiClientSingleton.getInstance();

/* ───────── Admin overview (bundled dashboard) ───────── */
export const getAdminOverview = async (): Promise<AdminOverviewShape> => {
  const response = await axiosInstance.get<AdminOverviewShape>(`admin/overview`);
  return response.data;
};

export type OverviewRange = "1D" | "7D" | "1M" | "1Y";
export interface OverviewSeriesPoint {
  date: string;
  users: number;
  tasks: number;
  providers: number;
}

/** Range-selectable Platform Overview chart series (1D / 7D / 1M / 1Y). */
export const getAdminOverviewSeries = async (
  range: OverviewRange,
): Promise<OverviewSeriesPoint[]> => {
  const response = await axiosInstance.get<OverviewSeriesPoint[]>(
    `admin/overview/series`,
    { params: { range } },
  );
  return response.data ?? [];
};

/* ───────── Admin marketplace — bundled list reads ───────── */
export const getAdminUsersView = async (
  params: Record<string, unknown>,
): Promise<AdminUsersBundle> => {
  const response = await axiosInstance.get<AdminUsersBundle>(
    `admin/marketplace/users`,
    { params },
  );
  return response.data;
};

export const getAdminUserDetail = async (
  id: string,
): Promise<AdminUserDetail> => {
  const response = await axiosInstance.get<AdminUserDetail>(
    `admin/marketplace/users/${id}`,
  );
  return response.data;
};

export const getAdminProvidersView = async (
  params: Record<string, unknown>,
): Promise<AdminProvidersBundle> => {
  const response = await axiosInstance.get<AdminProvidersBundle>(
    `admin/marketplace/providers`,
    { params },
  );
  return response.data;
};

export const getAdminProviderDetail = async (
  id: string,
): Promise<AdminProviderDetail> => {
  const response = await axiosInstance.get<AdminProviderDetail>(
    `admin/marketplace/providers/${id}`,
  );
  return response.data;
};

export const getAdminClientsView = async (
  params: Record<string, unknown>,
): Promise<AdminClientsBundle> => {
  const response = await axiosInstance.get<AdminClientsBundle>(
    `admin/marketplace/clients`,
    { params },
  );
  return response.data;
};

export const getAdminClientDetail = async (
  id: string,
): Promise<AdminUserDetail> => {
  const response = await axiosInstance.get<AdminUserDetail>(
    `admin/marketplace/clients/${id}`,
  );
  return response.data;
};

export const getAdminTasksView = async (
  params: Record<string, unknown>,
): Promise<AdminTasksBundle> => {
  const response = await axiosInstance.get<AdminTasksBundle>(
    `admin/marketplace/tasks`,
    { params },
  );
  return response.data;
};

export const getAdminTaskDetail = async (
  id: string,
): Promise<AdminTaskDetail> => {
  const response = await axiosInstance.get<AdminTaskDetail>(
    `admin/marketplace/tasks/${id}`,
  );
  return response.data;
};

/* ───────── Admin marketplace — mutations ───────── */
export const suspendAdminUser = async (id: string, reason: string) =>
  (
    await axiosInstance.patch(`admin/marketplace/users/${id}/suspend`, {
      reason,
    })
  ).data;
export const reactivateAdminUser = async (id: string) =>
  (await axiosInstance.patch(`admin/marketplace/users/${id}/reactivate`)).data;
export const verifyAdminUserEmail = async (id: string) =>
  (await axiosInstance.patch(`admin/marketplace/users/${id}/verify-email`))
    .data;
export const verifyAdminUserPhone = async (id: string) =>
  (await axiosInstance.patch(`admin/marketplace/users/${id}/verify-phone`))
    .data;

export const approveProviderKyc = async (id: string) =>
  (await axiosInstance.patch(`admin/marketplace/providers/${id}/kyc-approve`))
    .data;
export const rejectProviderKyc = async (id: string) =>
  (await axiosInstance.patch(`admin/marketplace/providers/${id}/kyc-reject`))
    .data;
export const setProviderFeatured = async (id: string, featured: boolean) =>
  (
    await axiosInstance.patch(`admin/marketplace/providers/${id}/feature`, {
      featured,
    })
  ).data;
export const setProviderBookable = async (id: string, bookable: boolean) =>
  (
    await axiosInstance.patch(`admin/marketplace/providers/${id}/bookable`, {
      bookable,
    })
  ).data;

export const setAdminTaskStatus = async (id: string, status: string) =>
  (
    await axiosInstance.patch(`admin/marketplace/tasks/${id}/status`, {
      status,
    })
  ).data;
export const archiveAdminTask = async (id: string) =>
  (await axiosInstance.patch(`admin/marketplace/tasks/${id}/archive`)).data;
export const restoreAdminTask = async (id: string) =>
  (await axiosInstance.patch(`admin/marketplace/tasks/${id}/restore`)).data;

/* ───────── Legacy metrics ───────── */
export const getMetrics = async (
  params: MetricsRequest,
): Promise<MetricsResponse> => {
  const response = await axiosInstance.get<MetricsResponse>(`admin/metrics`, {
    params,
  });
  return response.data;
};

/* ───────── System health (standalone — overview bundle also includes it) ───────── */
export const getSystemHealth = async (): Promise<SystemHealthSnapshot> => {
  const response = await axiosInstance.get<SystemHealthSnapshot>(
    `admin/overview/health`,
  );
  return response.data;
};

export const getAdminErrors = async (
  filters: AdminErrorFilters = {},
): Promise<AdminErrorPage> => {
  const response = await axiosInstance.get<AdminErrorPage>(`admin/errors`, {
    params: filters,
  });
  return response.data;
};

export const getAdminError = async (
  errorId: string,
): Promise<AdminErrorItem> => {
  const response = await axiosInstance.get<AdminErrorItem>(`admin/errors/${errorId}`);
  return response.data;
};

export const resolveAdminError = async (
  errorId: string,
): Promise<{ errorId: string; resolved: boolean }> => {
  const response = await axiosInstance.patch<{ errorId: string; resolved: boolean }>(
    `admin/errors/${errorId}/resolve`,
  );
  return response.data;
};

export const getAdminErrorsStats = async (): Promise<AdminErrorStats> => {
  const response = await axiosInstance.get<AdminErrorStats>(`admin/errors/stats`);
  return response.data;
};

export const getAdminMonitoring = async (): Promise<MonitoringSnapshot> => {
  const response = await axiosInstance.get<MonitoringSnapshot>(`admin/monitoring`);
  return response.data;
};

/* ───────── RBAC ───────── */
export const getMyAdminUser = async (): Promise<AdminUserMe> => {
  const response = await axiosInstance.get<AdminUserMe>(`admin/rbac/me`);
  return response.data;
};
export const listRoles = async () =>
  (await axiosInstance.get(`admin/rbac/roles`)).data;
export const listAdminUsers = async (params: any = {}) =>
  (await axiosInstance.get(`admin/rbac/admin-users`, { params })).data;
export const assignAdminRole = async (userId: string, role: string) =>
  (await axiosInstance.post(`admin/rbac/admin-users`, { userId, role })).data;

export const createAdminUser = async (payload: {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  role: string;
}) => (await axiosInstance.post(`admin/rbac/admin-users/create`, payload)).data;

/* ───────── Support ───────── */
export const getTicketStats = async (): Promise<TicketStats> =>
  (await axiosInstance.get(`admin/support/tickets/stats`)).data;
export const listTickets = async (params: any = {}) =>
  (await axiosInstance.get(`admin/support/tickets`, { params })).data;
export const getTicket = async (id: string) =>
  (await axiosInstance.get(`admin/support/tickets/${id}`)).data;
export const replyTicket = async (
  id: string,
  body: { body: string; isInternalNote?: boolean },
) => (await axiosInstance.post(`admin/support/tickets/${id}/reply`, body)).data;
export const setTicketStatus = async (id: string, status: string) =>
  (await axiosInstance.patch(`admin/support/tickets/${id}/status`, { status }))
    .data;
export const assignTicket = async (id: string, assigneeUserId: string) =>
  (
    await axiosInstance.patch(`admin/support/tickets/${id}/assign`, {
      assigneeUserId,
    })
  ).data;

export const unassignTicket = async (id: string) =>
  (await axiosInstance.patch(`admin/support/tickets/${id}/unassign`)).data;

export const sendTicketTyping = async (id: string, isTyping: boolean) =>
  (await axiosInstance.post(`admin/support/tickets/${id}/typing`, { isTyping }))
    .data;
export const escalateTicket = async (
  id: string,
  body: { target: string; reason: string; notes?: string },
) =>
  (await axiosInstance.post(`admin/support/tickets/${id}/escalate`, body)).data;
export const createTicket = async (body: {
  subject: string;
  description?: string;
  category?: string;
  priority?: string;
  requester: string;
}) => (await axiosInstance.post(`admin/support/tickets`, body)).data;

/* ───────── Disputes ───────── */
export const getDisputeStats = async (): Promise<DisputeStats> =>
  (await axiosInstance.get(`admin/disputes/stats`)).data;
export const listDisputes = async (params: any = {}) =>
  (await axiosInstance.get(`admin/disputes`, { params })).data;
export const getDispute = async (id: string) =>
  (await axiosInstance.get(`admin/disputes/${id}`)).data;
export const resolveDispute = async (id: string, payload: any) =>
  (await axiosInstance.post(`admin/disputes/${id}/resolve`, payload)).data;
export const escalateDispute = async (id: string, reason: string) =>
  (await axiosInstance.post(`admin/disputes/${id}/escalate`, { reason })).data;

/* ───────── Fraud ───────── */
export const getFraudStats = async (): Promise<FraudStats> =>
  (await axiosInstance.get(`admin/fraud/stats`)).data;
export const listFraudEvents = async (params: any = {}) =>
  (await axiosInstance.get(`admin/fraud/events`, { params })).data;
export const getHighRiskUsers = async (limit = 25) =>
  (
    await axiosInstance.get(`admin/fraud/high-risk-users`, {
      params: { limit },
    })
  ).data;

/* ───────── Moderation ───────── */
export const getModerationStats = async () =>
  (await axiosInstance.get(`admin/moderation/stats`)).data;
export const listModerationReports = async (params: any = {}) =>
  (await axiosInstance.get(`admin/moderation/reports`, { params })).data;

/* ───────── Subscriptions ───────── */
export const getSubscriptionStats = async (): Promise<SubscriptionStats> =>
  (await axiosInstance.get(`admin/subscriptions/stats`)).data;
export const listSubscriptions = async (params: any = {}) =>
  (await axiosInstance.get(`admin/subscriptions`, { params })).data;
export const listSubscriptionPlans = async () =>
  (await axiosInstance.get(`admin/subscriptions/plans`)).data;

/* ───────── Feature flags ───────── */
export const listFeatureFlags = async () =>
  (await axiosInstance.get(`admin/flags`)).data;
export const toggleFeatureFlag = async (key: string, enabled: boolean) =>
  (await axiosInstance.patch(`admin/flags/${key}/toggle`, { enabled })).data;

/* ───────── Audit ───────── */
export const listAuditLogs = async (params: any = {}) =>
  (await axiosInstance.get(`admin/audit`, { params })).data;

/* ───────── Notes ───────── */
export const listNotes = async (resource: string, resourceId: string) =>
  (await axiosInstance.get(`admin/notes`, { params: { resource, resourceId } }))
    .data;
export const createNote = async (payload: {
  resource: string;
  resourceId: string;
  body: string;
  tags?: string[];
  isPinned?: boolean;
}) => (await axiosInstance.post(`admin/notes`, payload)).data;

/* ───────── Trust & Safety (service lifecycle + review moderation) ───────── */

export interface AdminLifecycleStats {
  accepted: number;
  in_progress: number;
  awaiting_confirmation: number;
  completed: number;
  disputed: number;
  cancelled: number;
  total: number;
  certificates: number;
}

export interface AdminEngagementsBundle {
  stats: AdminLifecycleStats;
  page: { data: any[]; total: number; page: number; limit: number };
}

export interface AdminReviewStats {
  total: number;
  verified: number;
  flagged: number;
  pending: number;
  removed: number;
}

export interface AdminReviewsBundle {
  stats: AdminReviewStats;
  page: { data: any[]; total: number; page: number; limit: number };
}

export const getAdminEngagementsView = async (
  params: Record<string, unknown> = {},
): Promise<AdminEngagementsBundle> =>
  (await axiosInstance.get(`admin/trust/engagements`, { params })).data;

export const getAdminEngagementDetail = async (id: string) =>
  (await axiosInstance.get(`admin/trust/engagements/${id}`)).data;

export const getAdminReviewsView = async (
  params: Record<string, unknown> = {},
): Promise<AdminReviewsBundle> =>
  (await axiosInstance.get(`admin/trust/reviews`, { params })).data;

export const moderateAdminReview = async (
  id: string,
  action: "approve" | "reject" | "remove",
) =>
  (await axiosInstance.post(`admin/trust/reviews/${id}/moderate`, { action }))
    .data;
