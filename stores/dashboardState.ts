import { StateCreator } from "zustand";
import { DashboardState, GlobalStore } from "@/types";

/**
 * Back-office UI state only. The metrics payload these controls select is
 * server data — hooks/admin/useMetrics.ts keys a query on granularity /
 * year / month, so changing a control here refetches automatically.
 */
export const dashboardState: StateCreator<
  GlobalStore,
  [],
  [],
  DashboardState
> = (set) => ({
  activeView: "dashboard",
  sidebarOpen: true,
  granularity: "monthly",
  selectedYear: new Date().getFullYear(),
  selectedMonth: new Date().getMonth() + 1,

  setActiveView: (view) => set({ activeView: view }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setGranularity: (granularity) => set({ granularity }),
  setSelectedYear: (year) => set({ selectedYear: year }),
  setSelectedMonth: (month) => set({ selectedMonth: month }),
});
