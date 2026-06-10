"use client";

import { useEffect } from "react";
import { AdminEvents, socketService } from "@/lib/socket";

export type AdminScope =
  | "tickets"
  | "disputes"
  | "fraud"
  | "moderation"
  | "users"
  | "providers"
  | "tasks";

export interface AdminStatsInvalidatedPayload {
  scope: AdminScope;
  timestamp: number;
  [key: string]: any;
}

/**
 * Subscribe to backend `admin:stats_invalidated` broadcasts. The handler
 * receives the payload (scope + any extra context) — typically the caller
 * matches on `scope` and refetches the relevant query.
 */
export function useAdminLiveUpdates(
  handler: (payload: AdminStatsInvalidatedPayload) => void
) {
  useEffect(() => {
    const socketConnect = async () => {
      const socket = socketService;
      await socket.connect();
    };
    socketConnect();
    const onEvent = (payload: AdminStatsInvalidatedPayload) => {
      console.log("adminstats", { payload });
      handler(payload);
    };
    socketService.onEvent(AdminEvents.STATS_INVALIDATED, onEvent as any);
    return () => {
      socketService.onEvent(AdminEvents.STATS_INVALIDATED, onEvent as any);
    };
  }, [handler]);
}
