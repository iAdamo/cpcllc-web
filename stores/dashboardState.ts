import { StateCreator } from "zustand";
import { DashboardState, GlobalStore } from "@/types";
import { getMetrics } from "@/axios/admin";

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

  fetchMetrics: async () => {
    const { granularity, selectedYear, selectedMonth } = get();

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
