"use client";

import { useCallback } from "react";
import { useApolloClient } from "@apollo/client/react";
import { useAdminLiveUpdates, type AdminScope } from "@/hooks/useAdminLiveUpdates";
import {
  ADMIN_BADGES_QUERY,
  ADMIN_DASHBOARD_QUERY,
  ADMIN_PROVIDERS_QUERY,
  ADMIN_TASKS_QUERY,
  ADMIN_USERS_QUERY,
} from "@/graphql/admin";

/**
 * Maps each backend-emitted scope to the GraphQL queries whose cache entries
 * become stale when that scope changes. Apollo's `refetchQueries({ include })`
 * walks active observers and re-fires only those that were actually mounted,
 * so this is cheap if the user isn't looking at the affected view.
 */
const SCOPE_QUERIES: Record<AdminScope, any[]> = {
  users: [ADMIN_USERS_QUERY, ADMIN_DASHBOARD_QUERY, ADMIN_BADGES_QUERY],
  providers: [ADMIN_PROVIDERS_QUERY, ADMIN_DASHBOARD_QUERY, ADMIN_BADGES_QUERY],
  tasks: [ADMIN_TASKS_QUERY, ADMIN_DASHBOARD_QUERY, ADMIN_BADGES_QUERY],
  tickets: [ADMIN_DASHBOARD_QUERY, ADMIN_BADGES_QUERY],
  disputes: [ADMIN_DASHBOARD_QUERY, ADMIN_BADGES_QUERY],
  fraud: [ADMIN_DASHBOARD_QUERY, ADMIN_BADGES_QUERY],
  moderation: [ADMIN_DASHBOARD_QUERY, ADMIN_BADGES_QUERY],
};

/**
 * Single subscriber for the admin live-update channel: when the backend emits
 * `admin:stats_invalidated { scope }`, refetch only the queries whose data
 * just went stale. All other admin views stay served from the persisted
 * Apollo cache — no automatic refetch on mount, no polling.
 *
 * Mount this once high in the admin tree (the admin shell does so).
 */
export function useAdminCacheBridge(enabled: boolean) {
  const apollo = useApolloClient();

  useAdminLiveUpdates(
    useCallback(
      (payload) => {
        if (!enabled) return;
        const queries = SCOPE_QUERIES[payload.scope as AdminScope];
        if (!queries?.length) return;
        // Apollo only re-fires queries that are currently being observed by a
        // mounted component — the others get their cache entries updated lazily
        // the next time the view is opened.
        void apollo.refetchQueries({
          include: queries,
          // onQueryUpdated returns false to skip silently-updated queries
          // from the result Promise so they don't pile up in any error paths.
          onQueryUpdated: () => true,
        });
      },
      [apollo, enabled],
    ),
  );
}
