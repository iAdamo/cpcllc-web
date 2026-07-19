"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useGlobalStore from "@/stores";
import { socketService, ChatEvents } from "@/lib/socket";
import {
  getSupportInbox,
  getChatMessages,
  type SupportChat,
  type ChatMessage,
} from "@/axios/chat";

/**
 * Admin-side support chat. Loads the agent's support inbox, and for the
 * selected conversation streams messages over the same socket contract the
 * mobile app uses (`chat:send_message` → `chat:message_sent`, room join via
 * `chat:join_room`). Sending is optimistic; the server echo reconciles.
 */
export function useSupportChat() {
  const meId = useGlobalStore((s) => s.user?._id);

  const [inbox, setInbox] = useState<SupportChat[]>([]);
  const [inboxLoading, setInboxLoading] = useState(true);
  const [inboxError, setInboxError] = useState(false);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const joinedRoomRef = useRef<string | null>(null);

  // ── Inbox ──────────────────────────────────────────────────────────────
  const loadInbox = useCallback(async () => {
    setInboxError(false);
    try {
      const chats = await getSupportInbox();
      setInbox(chats);
    } catch {
      setInboxError(true);
    } finally {
      setInboxLoading(false);
    }
  }, []);

  useEffect(() => {
    void socketService.connect();
    void loadInbox();
  }, [loadInbox]);

  // ── Live inbox updates: any inbound support message re-orders the list ──
  useEffect(() => {
    const onMessage = (envelope: any) => {
      const message: ChatMessage | undefined = envelope?.payload?.message;
      const chat = envelope?.payload?.chat;
      if (!message) return;

      // Bump the affected conversation to the top with a fresh preview.
      setInbox((prev) => {
        const idx = prev.findIndex((c) => c._id === message.chatId);
        if (idx === -1) {
          // A brand-new support conversation — pull the inbox fresh.
          void loadInbox();
          return prev;
        }
        const updated = {
          ...prev[idx],
          lastMessage: {
            text: message.content?.text ?? "",
            sender: message.senderId,
            createdAt: message.createdAt,
          },
          unreadCounts: chat?.unreadCounts ?? prev[idx].unreadCounts,
          updatedAt: message.createdAt,
        };
        return [updated, ...prev.filter((_, i) => i !== idx)];
      });

      // Append into the open thread (skip our own echo — already optimistic).
      if (message.chatId === activeId && message.senderId !== meId) {
        setMessages((prev) =>
          prev.some((m) => m._id === message._id) ? prev : [...prev, message]
        );
      }
    };

    socketService.onEvent(ChatEvents.MESSAGE_SENT, onMessage as any);
    return () =>
      socketService.offEvent(ChatEvents.MESSAGE_SENT, onMessage as any);
  }, [activeId, meId, loadInbox]);

  // ── Open a conversation ────────────────────────────────────────────────
  const openChat = useCallback(
    async (chatId: string) => {
      if (joinedRoomRef.current && joinedRoomRef.current !== chatId) {
        void socketService.emitEvent(ChatEvents.LEAVE_ROOM, {
          chatId: joinedRoomRef.current,
        });
      }
      setActiveId(chatId);
      setMessages([]);
      setMessagesLoading(true);
      void socketService.emitEvent(ChatEvents.JOIN_ROOM, { chatId });
      joinedRoomRef.current = chatId;
      try {
        const page = await getChatMessages(chatId);
        // Backend returns chronological (oldest → newest).
        setMessages(page.messages);
      } catch {
        setMessages([]);
      } finally {
        setMessagesLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      if (joinedRoomRef.current) {
        void socketService.emitEvent(ChatEvents.LEAVE_ROOM, {
          chatId: joinedRoomRef.current,
        });
      }
    };
  }, []);

  // ── Send ───────────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !activeId || !meId) return;

      const optimistic: ChatMessage = {
        _id: `temp-${Date.now()}`,
        chatId: activeId,
        senderId: meId,
        type: "text",
        content: { text: trimmed },
        createdAt: new Date().toISOString(),
        isOptimistic: true,
      };
      setMessages((prev) => [...prev, optimistic]);

      void socketService.emitEvent(ChatEvents.SEND_MESSAGE, {
        chatId: activeId,
        type: "text",
        content: { text: trimmed },
      });

      // Reflect in the inbox preview immediately.
      setInbox((prev) => {
        const idx = prev.findIndex((c) => c._id === activeId);
        if (idx === -1) return prev;
        const updated = {
          ...prev[idx],
          lastMessage: {
            text: trimmed,
            sender: meId,
            createdAt: optimistic.createdAt,
          },
          updatedAt: optimistic.createdAt,
        };
        return [updated, ...prev.filter((_, i) => i !== idx)];
      });
    },
    [activeId, meId]
  );

  const activeChat = inbox.find((c) => c._id === activeId) ?? null;

  return {
    inbox,
    inboxLoading,
    inboxError,
    reloadInbox: loadInbox,
    activeId,
    activeChat,
    messages,
    messagesLoading,
    openChat,
    sendMessage,
    meId,
  };
}
