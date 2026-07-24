import { ApiClientSingleton } from "@/axios/conf";

const { axiosInstance } = ApiClientSingleton.getInstance();

export type BroadcastStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "SCHEDULED"
  | "PUBLISHING"
  | "PUBLISHED"
  | "ARCHIVED"
  | "REJECTED"
  | "CANCELLED";

export type BroadcastTemplate =
  | "APP_UPDATE"
  | "NEW_FEATURE"
  | "PROMOTION"
  | "SCHEDULED_MAINTENANCE"
  | "SECURITY_ALERT"
  | "EMERGENCY_NOTICE"
  | "SERVICE_OUTAGE"
  | "HOLIDAY_MESSAGE"
  | "COMMUNITY_HIGHLIGHT"
  | "EDUCATIONAL_TIP"
  | "POLICY_UPDATE"
  | "WELCOME"
  | "CUSTOM";

export type BroadcastCategory =
  | "PRODUCT"
  | "PROMOTION"
  | "SYSTEM"
  | "SECURITY"
  | "COMMUNITY"
  | "EDUCATION"
  | "POLICY";

export type BroadcastPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";
export type BroadcastChannel = "PUSH" | "IN_APP" | "EMAIL" | "WEB";

export type AudienceType =
  | "EVERYONE"
  | "SELECTED_USERS"
  | "PROVIDERS"
  | "CLIENTS"
  | "VERIFIED_USERS"
  | "PREMIUM_USERS"
  | "CUSTOM";

export interface Audience {
  type: AudienceType;
  userIds?: string[];
  filters?: {
    country?: string;
    state?: string;
    activeRole?: "Client" | "Provider";
    verified?: boolean;
  };
}

export interface Broadcast {
  _id: string;
  title: string;
  subtitle?: string;
  body: string;
  coverImage?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  template: BroadcastTemplate;
  category: BroadcastCategory;
  priority: BroadcastPriority;
  channels: BroadcastChannel[];
  audience: Audience;
  scheduledAt?: string;
  expiresAt?: string;
  pinned?: boolean;
  featured?: boolean;
  status: BroadcastStatus;
  rejectionReason?: string;
  createdBy?: any;
  approvedBy?: any;
  publishedBy?: any;
  submittedBy?: any;
  analytics?: BroadcastAnalytics;
  createdAt: string;
  updatedAt: string;
}

export interface BroadcastAnalytics {
  recipients: number;
  delivered: number;
  failed: number;
  opened: number;
  clicked: number;
  read: number;
  retryAttempts: number;
  perChannel: Record<string, number>;
  failureReasons: string[];
}

const base = "admin/broadcasts";

export interface PickableUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  activeRole?: string;
}

/** Search marketplace users for the "Selected users" audience picker. */
export const searchUsersForBroadcast = async (
  search: string
): Promise<PickableUser[]> => {
  const res = await axiosInstance.get("admin/marketplace/users", {
    params: { search, limit: 12 },
  });
  return res.data?.page?.items ?? res.data?.items ?? [];
};

export const getBroadcastStats = async () =>
  (await axiosInstance.get(`${base}/stats`)).data as {
    byStatus: Record<string, number>;
    totalPublished: number;
  };

export const listBroadcasts = async (params: {
  status?: BroadcastStatus;
  category?: string;
  q?: string;
  page?: number;
  limit?: number;
} = {}) =>
  (await axiosInstance.get(base, { params })).data as {
    items: Broadcast[];
    total: number;
    page: number;
    totalPages: number;
  };

export const getBroadcast = async (id: string) =>
  (await axiosInstance.get(`${base}/${id}`)).data as Broadcast;

export const getBroadcastAnalytics = async (id: string) =>
  (await axiosInstance.get(`${base}/${id}/analytics`)).data as BroadcastAnalytics & {
    broadcastId: string;
    status: BroadcastStatus;
  };

export const estimateAudience = async (audience: Audience) =>
  (await axiosInstance.post(`${base}/estimate-audience`, { audience }))
    .data as { count: number };

export const createBroadcast = async (payload: Partial<Broadcast>) =>
  (await axiosInstance.post(base, payload)).data as Broadcast;

export const updateBroadcast = async (id: string, payload: Partial<Broadcast>) =>
  (await axiosInstance.patch(`${base}/${id}`, payload)).data as Broadcast;

export const submitBroadcast = async (id: string) =>
  (await axiosInstance.post(`${base}/${id}/submit`)).data as Broadcast;
export const approveBroadcast = async (id: string) =>
  (await axiosInstance.post(`${base}/${id}/approve`)).data as Broadcast;
export const rejectBroadcast = async (id: string, reason: string) =>
  (await axiosInstance.post(`${base}/${id}/reject`, { reason })).data as Broadcast;
export const publishBroadcast = async (id: string) =>
  (await axiosInstance.post(`${base}/${id}/publish`)).data as Broadcast;
export const cancelBroadcast = async (id: string) =>
  (await axiosInstance.post(`${base}/${id}/cancel`)).data as Broadcast;
export const archiveBroadcast = async (id: string) =>
  (await axiosInstance.post(`${base}/${id}/archive`)).data as Broadcast;
export const deleteBroadcast = async (id: string) =>
  (await axiosInstance.delete(`${base}/${id}`)).data;
