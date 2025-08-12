import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type DashboardView = "dashboard" | "users" | "settings" | "analytics";

interface DashboardState {
  activeView: DashboardView;
  sidebarOpen: boolean;
  setActiveView: (view: DashboardView) => void;
  toggleSidebar: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      activeView: "dashboard",
      sidebarOpen: true,
      setActiveView: (view) => set({ activeView: view }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: "dashboard-storage", // unique name for the storage
      storage: createJSONStorage(() => localStorage), // use localStorage as the storage
    }
  )
);
