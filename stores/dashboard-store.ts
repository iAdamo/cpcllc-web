import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserData } from "@/types";
import { getMetrics } from "@/axios/admin";
import { getUsers } from "@/axios/users";

type DashboardView = "dashboard" | "users" | "settings" | "analytics";
export type TimeRange = "daily" | "weekly" | "monthly" | "yearly";

export interface Metric {
  date: string;
  value: number;
}

export interface DashboardState {
  // UI State
  activeView: DashboardView;
  sidebarOpen: boolean;
  timeRange: TimeRange;

  // Data State
  users: UserData[];
  metrics: Metric[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setActiveView: (view: DashboardView) => void;
  toggleSidebar: () => void;
  setTimeRange: (range: TimeRange) => void;
  fetchUsers: () => Promise<void>;
  fetchMetrics: (range: TimeRange) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      activeView: "dashboard",
      sidebarOpen: true,
      setActiveView: (view) => set({ activeView: view }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      timeRange: "monthly",

      setTimeRange: (range) => {
        if (get().timeRange !== range) {
          set({ timeRange: range });
          get().fetchMetrics(range);
        }
      },
      users: [],
      metrics: [],
      isLoading: false,
      error: null,
      fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await getUsers(1, 100);
          set({ users: response.users, isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: String(error) || "Failed to fetch users",
          });
        }
      },
      fetchMetrics: async (range: TimeRange) => {
        set({ isLoading: true, error: null });
        try {
          const response = await getMetrics(range);
          set({ metrics: response, isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: String(error) || "Failed to fetch metrics",
          });
        }
      },
    }),
    {
      name: "dashboard-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !["isLoading", "error", "users", "metrics"].includes(key)
          )
        ),
    }
  )
);
