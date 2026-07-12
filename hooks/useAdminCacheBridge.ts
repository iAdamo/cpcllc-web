"use client";

import { useCallback, useEffect } from "react";
import useGlobalStore from "@/stores";
import type { AdminScope, AdminUserRow, AdminUsersBundle } from "@/types/admin-marketplace";
import {
  PresenceEvents,
  PRESENCE_STATUS,
  socketService,
} from "@/lib/socket";
import { useSubscription } from "@/hooks/useSubscription";
import type { DomainEventPayload } from "@/types/domain-events";
import { queryClient } from "@/lib/queryClient";
import { adminKeys, keysForScope } from "@/hooks/admin/adminQueryKeys";

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
 * Prepend a freshly-registered user into every cached users-list query so
 * the table updates with zero refetch. We don't try to respect filter
 * predicates: a fresh row probably matches "all users" anyway, and the
 * staleness washes out the next time the user paginates or refreshes.
 */
function prependAdminUser(user: AdminUserRow) {
  queryClient.setQueriesData<AdminUsersBundle>(
    { queryKey: [...adminKeys.users, "list"] },
    (bundle) => {
      if (!bundle) return bundle;
      const exists = bundle.page.items.some(
        (it) => String(it._id) === String(user._id),
      );
      if (exists) return bundle;

      const byRole = { ...bundle.stats.byRole };
      if (user.activeRole === "Client") {
        byRole.clients = (byRole.clients ?? 0) + 1;
      } else if (user.activeRole === "Provider") {
        byRole.providers = (byRole.providers ?? 0) + 1;
      } else if (user.activeRole === "Admin") {
        byRole.admins = (byRole.admins ?? 0) + 1;
      }

      return {
        ...bundle,
        page: {
          ...bundle.page,
          items: [user, ...bundle.page.items],
          total: (bundle.page.total ?? 0) + 1,
        },
        stats: {
          ...bundle.stats,
          total: (bundle.stats.total ?? 0) + 1,
          byRole,
        },
      };
    },
  );
  // The dashboard KPIs count users too — mark stale, refetch on next focus.
  void queryClient.invalidateQueries({ queryKey: adminKeys.overview });
}

/**
 * Wires admin websocket events into the TanStack Query cache:
 *
 *  - `domain:event` on `scope:admin:stats` (`stats.invalidated`) →
 *    invalidate the queries the scope dirties; active views refetch
 *    immediately, inactive ones on next mount.
 *  - `domain:event` on `scope:marketplace:users` (`user.registered`) →
 *    prepend the projected user row into every cached users-list query
 *    with zero refetch.
 *  - `presence:status_change { userId, status }` → track online/offline in
 *    the `adminOnlineUserIds` Zustand slice (live socket state, not server
 *    cache). Admins are auto-subscribed to `scope:presence:all` in
 *    SubscriptionRegistry on connect.
 *
 * Mount this once high in the admin tree — the admin shell does that.
 */
export function useAdminCacheBridge(enabled: boolean) {
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
          for (const key of keysForScope(scope)) {
            void queryClient.invalidateQueries({ queryKey: key });
          }
        },
        [],
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
            prependAdminUser(event.data as AdminUserRow);
          }
        },
        [],
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
