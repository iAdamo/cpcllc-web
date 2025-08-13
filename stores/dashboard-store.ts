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
  activeView: DashboardView;
  sidebarOpen: boolean;
  timeRange: TimeRange;
  users: UserData[];
  metrics: Metric[];
  isLoading: boolean;
  error: string | null;

  // UI Actions
  setActiveView: (view: DashboardView) => void;
  toggleSidebar: () => void;
  setTimeRange: (range: TimeRange) => void;

  // Data Actions
  fetchUsers: () => Promise<void>;
  fetchMetrics: (range: TimeRange) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => {
      // stable fetch functions
      const fetchUsers = async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await getUsers(1, 100);
          set({ users: response.users, isLoading: false });
        } catch (err) {
          set({
            isLoading: false,
            error: String(err) || "Failed to fetch users",
          });
        }
      };

      const fetchMetrics = async (range: TimeRange) => {
        set({ isLoading: true, error: null });
        try {
          const response = await getMetrics(range);
          set({ metrics: response, isLoading: false });
        } catch (err) {
          set({
            isLoading: false,
            error: String(err) || "Failed to fetch metrics",
          });
        }
      };

      return {
        // Initial State
        activeView: "dashboard",
        sidebarOpen: true,
        timeRange: "monthly",
        users: [],
        metrics: [],
        isLoading: false,
        error: null,

        // UI Actions
        setActiveView: (view) => set({ activeView: view }),
        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setTimeRange: (range) => {
          if (get().timeRange !== range) {
            set({ timeRange: range });
          }
        },

        // Data Actions
        fetchUsers,
        fetchMetrics,
      };
    },
    {
      name: "dashboard-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeView: state.activeView,
        sidebarOpen: state.sidebarOpen,
        timeRange: state.timeRange,
      }),
    }
  )
);
