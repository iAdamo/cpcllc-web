import type { StateCreator } from "zustand";

/**
 * Live presence for the back-office — userIds currently connected via
 * websocket, fed by `presence:status_change` events through
 * useAdminCacheBridge. This is ephemeral socket state, not server cache:
 * it belongs in Zustand. Everything the admin fetches over REST lives in
 * TanStack Query under the ["admin"] key prefix.
 */
export interface AdminPresenceState {
  adminOnlineUserIds: Record<string, boolean>;
  setAdminUserHeartbeat: (userId: string, online: boolean) => void;
  clearAdminPresence: () => void;
}

export const adminPresenceState: StateCreator<
  AdminPresenceState,
  [["zustand/immer", never], ["zustand/devtools", never], ["zustand/persist", unknown]],
  [],
  AdminPresenceState
> = (set) => ({
  adminOnlineUserIds: {},

  setAdminUserHeartbeat: (userId, online) =>
    set((state) => {
      if (online) state.adminOnlineUserIds[userId] = true;
      else delete state.adminOnlineUserIds[userId];
    }),

  clearAdminPresence: () =>
    set((state) => {
      state.adminOnlineUserIds = {};
    }),
});
