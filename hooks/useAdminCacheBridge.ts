"use client";

import { useCallback, useEffect } from "react";
import useGlobalStore from "@/stores";
import {
  useAdminLiveUpdates,
  type AdminScope,
} from "@/hooks/useAdminLiveUpdates";
import {
  AdminEvents,
  PresenceEvents,
  PRESENCE_STATUS,
  socketService,
} from "@/lib/socket";

/**
 * Pulls the server's `ResEventEnvelope.payload` out, falling back to the raw
 * value if the server happened to emit unwrapped (e.g. legacy paths).
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
 *  - `admin:stats_invalidated { scope }` → wipe matching slices so the next
 *    view mount refetches.
 *  - `admin:user_registered { user }`    → prepend the user into every cached
 *    users-list slice (no refetch). Bumps the `total` counter too.
 *  - `presence:status_change { userId, status }` → track online/offline state
 *    in `adminOnlineUserIds` so list views render presence dots live. The
 *    server auto-registers admin sockets as global presence watchers, so we
 *    receive a change for every user without explicitly subscribing.
 *
 * Every payload is wrapped in a `ResEventEnvelope` server-side — `unwrap`
 * peels off `.payload` so handlers stay clean.
 *
 * Mount this once high in the admin tree — the admin shell does that.
 */
export function useAdminCacheBridge(enabled: boolean) {
  const invalidate = useGlobalStore((s) => s.invalidateAdminScope);
  const prependUser = useGlobalStore((s) => s.prependAdminUser);
  const setHeartbeat = useGlobalStore((s) => s.setAdminUserHeartbeat);

  useAdminLiveUpdates(
    useCallback(
      (envelope) => {
        if (!enabled) return;
        const payload = unwrap<{ scope?: AdminScope }>(envelope);
        const scope = payload?.scope;
        if (!scope) return;
        invalidate(scope);
      },
      [enabled, invalidate],
    ),
  );

  useEffect(() => {
    if (!enabled) return;

    const onRegistered = (envelope: any) => {
      const payload = unwrap<{ user?: any }>(envelope);
      const user = payload?.user;
      if (!user) return;
      prependUser(user);
    };

    const onPresenceChange = (envelope: any) => {
      const payload = unwrap<{ userId?: string; status?: string }>(envelope);
      const userId = payload?.userId;
      const status = payload?.status;
      if (!userId || !status) return;
      setHeartbeat(String(userId), status === PRESENCE_STATUS.ONLINE);
    };

    void socketService.connect();
    socketService.onEvent(AdminEvents.USER_REGISTERED, onRegistered as any);
    socketService.onEvent(
      PresenceEvents.STATUS_CHANGE,
      onPresenceChange as any,
    );

    return () => {
      socketService.offEvent(AdminEvents.USER_REGISTERED, onRegistered as any);
      socketService.offEvent(
        PresenceEvents.STATUS_CHANGE,
        onPresenceChange as any,
      );
    };
  }, [enabled, prependUser, setHeartbeat]);
}
