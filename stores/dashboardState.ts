import { StateCreator } from "zustand";
import { DashboardState, GlobalStore } from "@/types";
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
  granularity: "monthly",
  selectedYear: new Date().getFullYear(),
  selectedMonth: new Date().getMonth() + 1,
  metricsData: null,
  isLoading: false,
  error: null,

  // UI Actions
  setActiveView: (view) => set({ activeView: view }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setGranularity: (granularity) => {
    set({ granularity });
    get().fetchMetrics();
  },

  setSelectedYear: (year) => {
    set({ selectedYear: year });
    get().fetchMetrics();
  },

  setSelectedMonth: (month) => {
    set({ selectedMonth: month });
    get().fetchMetrics();
  },

  timeRange: "30d",
  users: [],
  metricsSummary: null,
  timeSeries: [],

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

  fetchMetrics: async () => {
    const { granularity, selectedYear, selectedMonth } = get();

    // Validate selection
    if (granularity === "daily" && !selectedMonth) {
      set({ error: "Please select a month for daily view" });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await getMetrics({
        granularity,
        year: selectedYear,
        month: granularity === "daily" ? selectedMonth : null,
      });

      set({ metricsData: response, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to fetch metrics",
      });
    }
  },
});
