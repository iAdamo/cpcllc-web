import { StateCreator } from "zustand";
import { TimeRange, DashboardState, GlobalStore } from "@/types";
import { getMetrics } from "@/axios/admin";
import { getUsers } from "@/axios/users";

export const dashboardState: StateCreator<
  GlobalStore,
  [],
  [],
  DashboardState
> = (set, get) => ({
  activeView: "dashboard",
  sidebarOpen: true,
  timeRange: "30d",
  users: [],
  metricsSummary: null,
  timeSeries: [],
  isLoading: false,
  error: null,

  setActiveView: (view) => set({ activeView: view }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setTimeRange: (range) => {
    if (get().timeRange !== range) {
      set({ timeRange: range });
      get().fetchMetrics(range);
    }
  },
  fetchUsers: async () => {
    set({ isLoading: true, error: null });

    try {
      if (get().users.length > 0) {
        set({ isLoading: false });
        return;
      }
      const response = await getUsers(1, 100);

      set({
        users: response.users,
        isLoading: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: String(err) || "Failed to fetch users",
      });
    }
  },

  fetchMetrics: async (range: TimeRange) => {
    set({ isLoading: true, error: null });
    console.log(get().timeRange, range);
    try {
      if (get().timeRange === range) {
        set({ isLoading: false });
        return;
      }
      const response = await getMetrics(range);

      set({
        timeRange: range,
        metricsSummary: response.summary,
        timeSeries: response.timeSeries,
        isLoading: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: String(err) || "Failed to fetch metrics",
      });
    }
  },
});
