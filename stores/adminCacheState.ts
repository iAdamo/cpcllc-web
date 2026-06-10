import type { StateCreator } from "zustand";
import type {
  AdminOverviewShape,
  AdminProviderDetail,
  AdminTaskDetail,
  AdminUserDetail,
  AdminUserRow,
  AdminUsersBundle,
  AdminProvidersBundle,
  AdminClientsBundle,
  AdminTasksBundle,
} from "@/types/admin-marketplace";

export type {
  AdminUsersBundle,
  AdminProvidersBundle,
  AdminClientsBundle,
  AdminTasksBundle,
};

export interface AdminCacheState {
  /** Bundled dashboard data: KPIs, stats, recent activity, badges. */
  adminDashboard: AdminOverviewShape | null;

  /** Marketplace bundles (stats + page) keyed by JSON-stringified filter. */
  adminUsersByKey: Record<string, AdminUsersBundle | undefined>;
  adminProvidersByKey: Record<string, AdminProvidersBundle | undefined>;
  adminClientsByKey: Record<string, AdminClientsBundle | undefined>;
  adminTasksByKey: Record<string, AdminTasksBundle | undefined>;

  /** Per-id detail caches, populated when a drawer opens. */
  adminUserById: Record<string, AdminUserDetail | undefined>;
  adminProviderById: Record<string, AdminProviderDetail | undefined>;
  adminClientById: Record<string, AdminUserDetail | undefined>;
  adminTaskById: Record<string, AdminTaskDetail | undefined>;

  /** Live presence — userIds currently connected via websocket. Updated by
   *  the cache bridge from `admin:user_heartbeat` events. */
  adminOnlineUserIds: Record<string, boolean>;

  /** Writers — used by the hook layer after a successful fetch. */
  setAdminDashboard: (data: AdminOverviewShape | null) => void;
  setAdminUsers: (key: string, data: AdminUsersBundle | undefined) => void;
  setAdminProviders: (
    key: string,
    data: AdminProvidersBundle | undefined,
  ) => void;
  setAdminClients: (key: string, data: AdminClientsBundle | undefined) => void;
  setAdminTasks: (key: string, data: AdminTasksBundle | undefined) => void;
  setAdminUserDetail: (id: string, data: AdminUserDetail) => void;
  setAdminProviderDetail: (id: string, data: AdminProviderDetail) => void;
  setAdminClientDetail: (id: string, data: AdminUserDetail) => void;
  setAdminTaskDetail: (id: string, data: AdminTaskDetail) => void;

  /** Socket-driven patches — no fetch, just mutate the slice in place. */
  prependAdminUser: (user: AdminUserRow) => void;
  setAdminUserHeartbeat: (userId: string, online: boolean) => void;

  /** Drop all admin data — call from logout. */
  clearAdminCache: () => void;

  /** Invalidate only the slices relevant to a scope so the next render of
   *  affected views refetches. Called by the websocket bridge. */
  invalidateAdminScope: (
    scope:
      | "users"
      | "providers"
      | "clients"
      | "tasks"
      | "tickets"
      | "disputes"
      | "fraud"
      | "moderation"
      | "dashboard",
  ) => void;
}

export const adminCacheState: StateCreator<
  AdminCacheState,
  [["zustand/immer", never], ["zustand/devtools", never], ["zustand/persist", unknown]],
  [],
  AdminCacheState
> = (set) => ({
  adminDashboard: null,
  adminUsersByKey: {},
  adminProvidersByKey: {},
  adminClientsByKey: {},
  adminTasksByKey: {},
  adminUserById: {},
  adminProviderById: {},
  adminClientById: {},
  adminTaskById: {},
  adminOnlineUserIds: {},

  setAdminDashboard: (data) =>
    set((state) => {
      state.adminDashboard = data;
    }),
  setAdminUsers: (key, data) =>
    set((state) => {
      state.adminUsersByKey[key] = data;
    }),
  setAdminProviders: (key, data) =>
    set((state) => {
      state.adminProvidersByKey[key] = data;
    }),
  setAdminClients: (key, data) =>
    set((state) => {
      state.adminClientsByKey[key] = data;
    }),
  setAdminTasks: (key, data) =>
    set((state) => {
      state.adminTasksByKey[key] = data;
    }),
  setAdminUserDetail: (id, data) =>
    set((state) => {
      state.adminUserById[id] = data;
    }),
  setAdminProviderDetail: (id, data) =>
    set((state) => {
      state.adminProviderById[id] = data;
    }),
  setAdminClientDetail: (id, data) =>
    set((state) => {
      state.adminClientById[id] = data;
    }),
  setAdminTaskDetail: (id, data) =>
    set((state) => {
      state.adminTaskById[id] = data;
    }),

  // Prepend the new row into every cached users-list slice (one per filter
  // key). Each slice also gets its `total` bumped so the table header stays
  // honest. We don't try to respect filter predicates: a fresh row probably
  // matches "all users" anyway, and the staleness washes out the next time
  // the user paginates or refreshes.
  prependAdminUser: (user) =>
    set((state) => {
      for (const key of Object.keys(state.adminUsersByKey)) {
        const bundle = state.adminUsersByKey[key];
        if (!bundle) continue;
        const exists = bundle.page.items.some(
          (it) => String(it._id) === String(user._id),
        );
        if (exists) continue;
        bundle.page.items = [user, ...bundle.page.items];
        bundle.page.total = (bundle.page.total ?? 0) + 1;
        bundle.stats.total = (bundle.stats.total ?? 0) + 1;
        if (user.activeRole === "Client") {
          bundle.stats.byRole.clients = (bundle.stats.byRole.clients ?? 0) + 1;
        } else if (user.activeRole === "Provider") {
          bundle.stats.byRole.providers =
            (bundle.stats.byRole.providers ?? 0) + 1;
        } else if (user.activeRole === "Admin") {
          bundle.stats.byRole.admins = (bundle.stats.byRole.admins ?? 0) + 1;
        }
      }
    }),

  setAdminUserHeartbeat: (userId, online) =>
    set((state) => {
      if (online) state.adminOnlineUserIds[userId] = true;
      else delete state.adminOnlineUserIds[userId];
    }),

  clearAdminCache: () =>
    set((state) => {
      state.adminDashboard = null;
      state.adminUsersByKey = {};
      state.adminProvidersByKey = {};
      state.adminClientsByKey = {};
      state.adminTasksByKey = {};
      state.adminUserById = {};
      state.adminProviderById = {};
      state.adminClientById = {};
      state.adminTaskById = {};
      state.adminOnlineUserIds = {};
    }),

  invalidateAdminScope: (scope) =>
    set((state) => {
      // Dashboard depends on everything — wipe on any scope change.
      state.adminDashboard = null;
      switch (scope) {
        case "users":
          state.adminUsersByKey = {};
          state.adminUserById = {};
          break;
        case "providers":
          state.adminProvidersByKey = {};
          state.adminProviderById = {};
          break;
        case "clients":
          state.adminClientsByKey = {};
          state.adminClientById = {};
          break;
        case "tasks":
          state.adminTasksByKey = {};
          state.adminTaskById = {};
          break;
        // tickets/disputes/fraud/moderation only affect the dashboard
        // (their views haven't been migrated to Zustand yet).
        default:
          break;
      }
    }),
});
