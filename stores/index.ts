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
import { locationSlice } from "./locationState";
import { onboardingSlice } from "./onboardingState";
import { searchSlice } from "./searchState";
import { adminPresenceState } from "./adminPresenceState";
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

/**
 * Client state only. Server data (admin views, search results, profiles,
 * categories, metrics) lives in TanStack Query — see hooks/. Nothing in
 * here should ever mirror an API response beyond the session user.
 */
const useGlobalStore = create<GlobalStore>()(
  devtools(
    immer(
      persist(
        ((...a) => ({
          ...dashboardState(...a),
          ...authState(...a),
          ...userState(...a),
          ...providerState(...a),
          ...globalState(...a),
          ...locationSlice(...a),
          ...onboardingSlice(...a),
          ...searchSlice(...a),
          ...adminPresenceState(...a),
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
            savedJobs: state.savedJobs,
            paramsFrom: state.paramsFrom,
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
