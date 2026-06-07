"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket";

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
  handler: (payload: AdminStatsInvalidatedPayload) => void,
) {
  useEffect(() => {
    const socket = getSocket();
    const onEvent = (payload: AdminStatsInvalidatedPayload) => handler(payload);
    socket.on("admin:stats_invalidated", onEvent);
    return () => {
      socket.off("admin:stats_invalidated", onEvent);
    };
  }, [handler]);
}
