import { ApiClientSingleton } from "./conf";

const { axiosInstance } = ApiClientSingleton.getInstance();

export interface AdminNotification {
  id: string;
  title: string;
  body: string;
  category: string;
  actionType?: string;
  actionUrl?: string;
  readAt?: string | Date | null;
  createdAt: string;
}

export const getNotifications = async (): Promise<AdminNotification[]> => {
  const res = await axiosInstance.get("notifications");
  return Array.isArray(res.data) ? res.data : res.data?.items ?? [];
};
