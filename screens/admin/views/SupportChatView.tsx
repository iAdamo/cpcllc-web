"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MessageSquare,
  Send,
  Search,
  Loader2,
  RefreshCw,
  Headset,
} from "lucide-react";
import { useSupportChat } from "@/hooks/admin/useSupportChat";
import type { ChatUserLite, SupportChat, ChatMessage } from "@/axios/chat";

// ── Helpers ──────────────────────────────────────────────────────────────────

function personName(u?: ChatUserLite): string {
  const n = `${u?.firstName ?? ""} ${u?.lastName ?? ""}`.trim();
  return n || "User";
}

function avatarUrl(u?: ChatUserLite): string | null {
  const p = u?.profilePicture;
  if (!p) return null;
  if (typeof p === "string") return p;
  return p.thumbnail || p.url || null;
}

function timeAgo(iso?: string): string {
  if (!iso) return "";
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

function Avatar({ user, size = 40 }: { user?: ChatUserLite; size?: number }) {
  const url = avatarUrl(user);
  const name = personName(user);
  return url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={name}
      style={{ width: size, height: size }}
      className="rounded-full object-cover flex-shrink-0"
    />
  ) : (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0"
    >
      {name[0]?.toUpperCase() ?? "U"}
    </div>
  );
}

// ── Conversation list row ────────────────────────────────────────────────────

function InboxRow({
  chat,
  active,
  meId,
  onClick,
}: {
  chat: SupportChat;
  active: boolean;
  meId?: string;
  onClick: () => void;
}) {
  // From the agent's seat the user needing help is clientUserId.
  const user = chat.clientUserId;
  const unread = meId ? chat.unreadCounts?.[meId] ?? 0 : 0;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
        active
          ? "bg-blue-50 dark:bg-blue-900/20"
          : "hover:bg-gray-50 dark:hover:bg-gray-800"
      }`}
    >
      <Avatar user={user} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
            {personName(user)}
          </span>
          <span className="text-[10px] text-gray-400 flex-shrink-0">
            {timeAgo(chat.lastMessage?.createdAt ?? chat.updatedAt)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {chat.lastMessage?.text || "New conversation"}
          </span>
          {unread > 0 && (
            <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ── Message bubble ───────────────────────────────────────────────────────────

function Bubble({ mine, message }: { mine: boolean; message: ChatMessage }) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm leading-snug ${
          mine
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-md"
        }`}
      >
        {message.content?.text}
        <div
          className={`text-[10px] mt-0.5 ${
            mine ? "text-blue-100" : "text-gray-400"
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {message.isOptimistic ? " · sending…" : ""}
        </div>
      </div>
    </div>
  );
}

// ── Main view ────────────────────────────────────────────────────────────────

export function SupportChatView() {
  const {
    inbox,
    inboxLoading,
    inboxError,
    reloadInbox,
    activeId,
    activeChat,
    messages,
    messagesLoading,
    openChat,
    sendMessage,
    meId,
  } = useSupportChat();

  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return inbox;
    return inbox.filter((c) =>
      personName(c.clientUserId).toLowerCase().includes(q)
    );
  }, [inbox, query]);

  // Auto-scroll to newest.
  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [messages]);

  const submit = () => {
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft("");
  };

  return (
    <div className="h-[calc(100vh-9rem)] flex gap-4">
      {/* ── Conversation list ── */}
      <div className="w-full max-w-xs flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headset size={16} className="text-blue-600" />
            <span className="font-black text-gray-900 dark:text-white text-sm">
              Support Chat
            </span>
          </div>
          <button
            type="button"
            onClick={() => reloadInbox()}
            aria-label="Refresh"
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            <RefreshCw size={14} />
          </button>
        </div>
        <div className="px-3 py-2.5">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-700">
            <Search size={13} className="text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations…"
              className="flex-1 text-sm bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
          {inboxLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-2/3 animate-pulse" />
                  <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full w-full animate-pulse" />
                </div>
              </div>
            ))
          ) : inboxError ? (
            <div className="text-center py-10 px-4">
              <p className="text-sm text-gray-500">Couldn&apos;t load inbox.</p>
              <button
                type="button"
                onClick={() => reloadInbox()}
                className="mt-2 text-xs font-bold text-blue-600 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-14 px-6">
              <MessageSquare
                size={26}
                className="text-gray-300 mx-auto mb-2"
              />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                No support conversations
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Messages from users routed to you appear here.
              </p>
            </div>
          ) : (
            filtered.map((c) => (
              <InboxRow
                key={c._id}
                chat={c}
                meId={meId}
                active={c._id === activeId}
                onClick={() => openChat(c._id)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Thread ── */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Headset size={28} className="text-blue-600" />
            </div>
            <p className="font-bold text-gray-900 dark:text-white">
              Select a conversation
            </p>
            <p className="text-sm text-gray-500 max-w-xs">
              Pick a user from the list to read their messages and reply in
              real time.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
              <Avatar user={activeChat.clientUserId} size={36} />
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {personName(activeChat.clientUserId)}
                </p>
                <p className="text-[11px] text-gray-400">
                  Support conversation
                </p>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={threadRef}
              className="flex-1 overflow-y-auto px-5 py-4 space-y-2"
            >
              {messagesLoading ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <Loader2 size={18} className="animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-sm text-gray-400">
                  No messages yet — say hello.
                </div>
              ) : (
                messages.map((m) => (
                  <Bubble key={m._id} mine={m.senderId === meId} message={m} />
                ))
              )}
            </div>

            {/* Composer */}
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                placeholder="Type a reply…"
                className="flex-1 h-11 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none focus:border-blue-400"
              />
              <button
                type="button"
                onClick={submit}
                disabled={!draft.trim()}
                aria-label="Send"
                className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors"
              >
                <Send size={17} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
