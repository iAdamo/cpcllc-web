import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage } from "zustand/middleware";
import { StateCreator } from "zustand";
import { dashboardState } from "./dashboardState";
import { GlobalStore } from "@/types";

type MyStateCreator = StateCreator<
  GlobalStore,
  [
    ["zustand/immer", never],
    ["zustand/devtools", never],
    ["zustand/persist", unknown]
  ],
  [],
  GlobalStore
>;

const useGlobalStore = create<GlobalStore>()(
  devtools(
    immer(
      persist(
        ((...a) => ({
          ...dashboardState(...a),
        })) as MyStateCreator,
        {
          name: "web-storage",
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({
            users: state.users,
            metricsSummary: state.metricsSummary,
            timeSeries: state.timeSeries,
            activeView: state.activeView,
            sidebarOpen: state.sidebarOpen,
            granularity: state.granularity,
            selectedYear: state.selectedYear,
            selectedMonth: state.selectedMonth,
          }),
        }
      )
    )
  )
);

export default useGlobalStore;
