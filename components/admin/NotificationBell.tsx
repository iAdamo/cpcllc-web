"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, Check } from "lucide-react";
import useGlobalStore from "@/stores";
import {
  socketService,
  NotificationEvents,
  SupportEvents,
} from "@/lib/socket";
import { getNotifications, type AdminNotification } from "@/axios/notifications";

function timeAgo(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

/**
 * Admin notification bell — real feed of the admin's own notifications
 * (e.g. "ticket assigned to you", "customer replied"). Live over the
 * existing notification socket; clicking a support-ticket notification
 * jumps to the Support Center.
 */
export function NotificationBell() {
  const setActiveView = useGlobalStore((s) => s.setActiveView);
  const [items, setItems] = useState<AdminNotification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = items.filter((n) => !n.readAt).length;

  const load = useCallback(async () => {
    try {
      setItems(await getNotifications());
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void socketService.connect();
    void load();
    const onPush = (envelope: any) => {
      const n: AdminNotification | undefined = envelope?.payload ?? envelope;
      if (!n?.id) return;
      setItems((prev) =>
        prev.some((x) => x.id === n.id) ? prev : [n, ...prev]
      );
    };
    // Support-queue activity: fanned out to every agent on
    // scope:support:activity (auto-subscribed server-side at connect), so a
    // new ticket / customer reply surfaces in the bell even when this admin
    // isn't the assignee and has no drawer open.
    const onActivity = (envelope: any) => {
      const a = envelope?.payload ?? envelope;
      if (!a?.ticketId) return;
      const synthetic: AdminNotification = {
        id: `support-activity-${a.ticketId}-${a.kind}`,
        title:
          a.kind === "new_ticket"
            ? `New ticket ${a.ticketNumber ?? ""}`.trim()
            : `New reply on ${a.ticketNumber ?? ""}`.trim(),
        body: a.subject ? `${a.subject} — ${a.preview ?? ""}` : a.preview ?? "",
        category: "SUPPORT",
        actionUrl: `/support/tickets/${a.ticketId}`,
        createdAt: a.createdAt ?? new Date().toISOString(),
        readAt: null,
      };
      // Collapse repeats for the same ticket+kind into one fresh unread item.
      setItems((prev) => [
        synthetic,
        ...prev.filter((x) => x.id !== synthetic.id),
      ]);
    };
    socketService.onEvent(
      NotificationEvents.NOTIFICATION_RECEIVED,
      onPush as any
    );
    socketService.onEvent(SupportEvents.ACTIVITY, onActivity as any);
    return () => {
      socketService.offEvent(
        NotificationEvents.NOTIFICATION_RECEIVED,
        onPush as any
      );
      socketService.offEvent(SupportEvents.ACTIVITY, onActivity as any);
    };
  }, [load]);

  // Close on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const markAllRead = () => {
    socketService.emitEvent(NotificationEvents.MARK_AS_READ, {});
    setItems((prev) => prev.map((n) => ({ ...n, readAt: new Date() })));
  };

  const openItem = (n: AdminNotification) => {
    socketService.emitEvent(NotificationEvents.MARK_AS_READ, [n.id]);
    setItems((prev) =>
      prev.map((x) => (x.id === n.id ? { ...x, readAt: new Date() } : x))
    );
    setOpen(false);
    if (n.actionUrl?.includes("/support/tickets/")) {
      setActiveView("support" as any);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) void load();
        }}
        className="relative w-9 h-9 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl z-50">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              Notifications
            </span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-blue-600 font-semibold flex items-center gap-1"
              >
                <Check size={12} /> Mark all read
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-slate-400">
              You're all caught up.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => openItem(n)}
                  className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    !n.readAt ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {n.title}
                    </span>
                    <span className="text-[10px] text-slate-400 flex-shrink-0 mt-0.5">
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                    {n.body}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
