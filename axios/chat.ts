import { ApiClientSingleton } from "./conf";

const { axiosInstance } = ApiClientSingleton.getInstance();

// ── Wire shapes (subset the admin support inbox needs) ──────────────────────

export interface ChatUserLite {
  _id: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: { thumbnail?: string; url?: string } | string;
}

export interface SupportChat {
  _id: string;
  clientUserId: ChatUserLite;
  providerUserId: ChatUserLite;
  isSupport?: boolean;
  lastMessage?: {
    text?: string;
    sender?: string;
    createdAt?: string;
  };
  unreadCounts?: Record<string, number>;
  updatedAt: string;
  createdAt: string;
}

export interface ChatMessage {
  _id: string;
  chatId: string;
  senderId: string;
  type: "text" | "image" | "video" | "audio" | "file" | "system";
  content: { text?: string; mediaUrl?: string; mediaType?: string };
  status?: { sent?: boolean; delivered?: string[]; read?: string[] };
  createdAt: string;
  updatedAt?: string;
  isOptimistic?: boolean;
}

export interface MessagesPage {
  messages: ChatMessage[];
  hasMore: boolean;
  nextCursor: string | null;
}

/** Support conversations routed to the calling admin (TICKET_READ gated). */
export const getSupportInbox = async (
  page = 1,
  limit = 50
): Promise<SupportChat[]> => {
  const res = await axiosInstance.get("chat/support/inbox", {
    params: { page, limit },
  });
  return Array.isArray(res.data) ? res.data : [];
};

export const getChatMessages = async (
  chatId: string,
  cursor?: string
): Promise<MessagesPage> => {
  const res = await axiosInstance.get(`chat/${chatId}/messages`, {
    params: cursor ? { cursor } : undefined,
  });
  return res.data;
};
