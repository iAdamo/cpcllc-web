import { ApiClientSingleton } from "@/axios/conf";
import type {
  MetricsResponse,
  MetricsRequest,
  DashboardOverview,
  RecentActivities,
  SystemHealthSnapshot,
  AdminUserMe,
  TicketStats,
  DisputeStats,
  FraudStats,
  SubscriptionStats,
} from "@/types";

const { axiosInstance } = ApiClientSingleton.getInstance();

/* ───────── Legacy metrics ───────── */
export const getMetrics = async (
  params: MetricsRequest
): Promise<MetricsResponse> => {
  const response = await axiosInstance.get<MetricsResponse>(`admin/metrics`, {
    params,
  });
  return response.data;
};

/* ───────── Dashboard overview ───────── */
export const getDashboardOverview = async (): Promise<DashboardOverview> => {
  const r = await axiosInstance.get<DashboardOverview>(
    `admin/dashboard/overview`
  );
  return r.data;
};

export const getRecentActivities = async (
  limit = 10
): Promise<RecentActivities> => {
  const r = await axiosInstance.get<RecentActivities>(
    `admin/dashboard/recent-activities`,
    { params: { limit } }
  );
  return r.data;
};

export const getTopProviders = async (limit = 10) => {
  const r = await axiosInstance.get(`admin/dashboard/top-providers`, {
    params: { limit },
  });
  return r.data;
};

export const getRecentTasks = async (limit = 10) => {
  const r = await axiosInstance.get(`admin/dashboard/recent-tasks`, {
    params: { limit },
  });
  return r.data;
};

export const getSystemHealth = async (): Promise<SystemHealthSnapshot> => {
  const r = await axiosInstance.get<SystemHealthSnapshot>(
    `admin/dashboard/system-health`
  );
  return r.data;
};

/* ───────── RBAC ───────── */
export const getMyAdminUser = async (): Promise<AdminUserMe> => {
  const r = await axiosInstance.get<AdminUserMe>(`admin/rbac/me`);
  return r.data;
};
export const listRoles = async () => (await axiosInstance.get(`admin/rbac/roles`)).data;
export const listAdminUsers = async (params: any = {}) =>
  (await axiosInstance.get(`admin/rbac/admin-users`, { params })).data;
export const assignAdminRole = async (userId: string, role: string) =>
  (await axiosInstance.post(`admin/rbac/admin-users`, { userId, role })).data;

/* ───────── Support ───────── */
export const getTicketStats = async (): Promise<TicketStats> =>
  (await axiosInstance.get(`admin/support/tickets/stats`)).data;
export const listTickets = async (params: any = {}) =>
  (await axiosInstance.get(`admin/support/tickets`, { params })).data;
export const getTicket = async (id: string) =>
  (await axiosInstance.get(`admin/support/tickets/${id}`)).data;
export const replyTicket = async (
  id: string,
  body: { body: string; isInternalNote?: boolean }
) => (await axiosInstance.post(`admin/support/tickets/${id}/reply`, body)).data;
export const setTicketStatus = async (id: string, status: string) =>
  (await axiosInstance.patch(`admin/support/tickets/${id}/status`, { status }))
    .data;
export const assignTicket = async (id: string, assigneeUserId: string) =>
  (await axiosInstance.patch(`admin/support/tickets/${id}/assign`, { assigneeUserId }))
    .data;

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
  (await axiosInstance.get(`admin/fraud/high-risk-users`, { params: { limit } }))
    .data;

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
