import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage } from "zustand/middleware";
import { StateCreator } from "zustand";
import { dashboardState } from "./dashboardState";
import { authState } from "./authState";
import { userState } from "./userState";
import { globalState } from "./globalState";
import { providerState } from "./providerState";
import { serviceState } from "./serviceState";
import { locationSlice } from "./locationState";
import { onboardingSlice } from "./onboardingState";
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
          ...authState(...a),
          ...userState(...a),
          ...providerState(...a),
          ...serviceState(...a),
          ...globalState(...a),
          ...locationSlice(...a),
          ...onboardingSlice(...a),
        })) as MyStateCreator,
        {
          name: "web-storage",
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({
            user: state.user,
            isAuthenticated: state.isAuthenticated,
            onboardingStep: state.onboardingStep,
            onboardingData: { role: state.onboardingData.role },
            currentLocation: state.currentLocation,
            switchRole: state.switchRole,
            savedProviders: state.savedProviders,
            paramsFrom: state.paramsFrom,
            users: state.users,
            metricsSummary: state.metricsSummary,
            timeSeries: state.timeSeries,
            activeView: state.activeView,
            sidebarOpen: state.sidebarOpen,
            granularity: state.granularity,
            selectedYear: state.selectedYear,
            selectedMonth: state.selectedMonth,
            // paramsFrom: state.paramsFrom,
          }),
        }
      )
    )
  )
);

export default useGlobalStore;
