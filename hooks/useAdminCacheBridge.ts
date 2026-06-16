"use client";

import { useCallback, useEffect } from "react";
import useGlobalStore from "@/stores";
import type { AdminScope } from "@/types/admin-marketplace";
import {
  PresenceEvents,
  PRESENCE_STATUS,
  socketService,
} from "@/lib/socket";
import { useSubscription } from "@/hooks/useSubscription";
import type { DomainEventPayload } from "@/types/domain-events";

/**
 * Pulls the server's `ResEventEnvelope.payload` out, falling back to the
 * raw value if the server happened to emit unwrapped.
 */
function unwrap<T = any>(envelope: any): T {
  if (envelope && typeof envelope === "object" && "payload" in envelope) {
    return envelope.payload as T;
  }
  return envelope as T;
}

/**
 * Wires admin websocket events into the Zustand cache:
 *
 *  - `domain:event` on `scope:admin:stats` (`stats.invalidated`) → wipe
 *    matching slices so the next view mount refetches. Phase 3 moved this
 *    off the raw `admin:stats_invalidated` event onto the unified
 *    domain-event channel.
 *  - `domain:event` on `scope:marketplace:users` (`user.registered`) →
 *    prepend the projected user row into every cached users-list slice
 *    with zero refetch.
 *  - `presence:status_change { userId, status }` → track online/offline in
 *    `adminOnlineUserIds`. Admins are auto-subscribed to `scope:presence:all`
 *    in SubscriptionRegistry on connect, so every user transition arrives
 *    through the existing presence pipeline (Phase 3 retired the parallel
 *    `presence:admin_watchers` Redis set).
 *
 * Mount this once high in the admin tree — the admin shell does that.
 */
export function useAdminCacheBridge(enabled: boolean) {
  const invalidate = useGlobalStore((s) => s.invalidateAdminScope);
  const prependUser = useGlobalStore((s) => s.prependAdminUser);
  const setHeartbeat = useGlobalStore((s) => s.setAdminUserHeartbeat);

  /* ─── stats invalidated (Phase 3 — domain events) ─────────────────── */
  useSubscription<{ scope?: AdminScope }>(
    enabled ? "scope:admin:stats" : null,
    {
      onEvent: useCallback(
        (event: DomainEventPayload<{ scope?: AdminScope }>) => {
          if (event.type !== "stats.invalidated") return;
          const scope = event.data?.scope;
          if (!scope) return;
          invalidate(scope);
        },
        [invalidate],
      ),
    },
  );

  /* ─── marketplace users channel (Phase 2 — domain events) ──────────── */
  useSubscription<Record<string, any>>(
    enabled ? "scope:marketplace:users" : null,
    {
      onEvent: useCallback(
        (event: DomainEventPayload<Record<string, any>>) => {
          if (event.type === "user.registered" && event.data) {
            prependUser(event.data as any);
          }
        },
        [prependUser],
      ),
    },
  );

  /* ─── presence heartbeat (unchanged) ───────────────────────────────── */
  useEffect(() => {
    if (!enabled) return;

    const onPresenceChange = (envelope: any) => {
      const payload = unwrap<{ userId?: string; status?: string }>(envelope);
      const userId = payload?.userId;
      const status = payload?.status;
      if (!userId || !status) return;
      setHeartbeat(String(userId), status === PRESENCE_STATUS.ONLINE);
    };

    void socketService.connect();
    socketService.onEvent(
      PresenceEvents.STATUS_CHANGE,
      onPresenceChange as any,
    );

    return () => {
      socketService.offEvent(
        PresenceEvents.STATUS_CHANGE,
        onPresenceChange as any,
      );
    };
  }, [enabled, setHeartbeat]);
}
