import { StateCreator } from "zustand";
import { GlobalStore, GlobalState } from "@/types";
// import { RequiredTerms, AppConfigRes, RateUsTrackingState } from "@/types";

// const DEFAULT_RATE_US_TRACKING: RateUsTrackingState = {
//   sessionCount: 0,
//   installDate: null,
//   lastPromptedAt: null,
//   nativePromptCount: 0,
//   neverShow: false,
// };

export const globalState: StateCreator<GlobalStore, [], [], GlobalState> = (
  set,
  get
) => ({
  isLoading: false,
  error: null,
  success: null,
  info: null,
  networkError: false,
  failedRequests: [],
  needsAcceptance: false,
  isChecking: true,
  requiredTerms: [],

  setSuccess: (success) => set({ success }),

  setError: (error) =>
    set({
      error,
      networkError: error === "Network Error" || error === "Network Error",
    }),

  setInfo: (info) => set({ info }),

  clearInfo: () => set({ info: null }),
  clearSuccess: () => set({ success: null }),
  clearError: () => set({ error: null, networkError: false }),
  setLoading: (loading) => set({ isLoading: loading }),

  setNetworkError: (status) => set({ networkError: status }),

  // setInfo: (info) => set({ info }),
  // clearInfo: () => set({ info: null }),
  // clearSuccess: () => set({ success: null }),
  // clearError: () => set({ error: null, networkError: false }),
  // setLoading: (loading) => set({ isLoading: loading }),
  // setError: (error) =>
  //   set({
  //     error,
  //     networkError: error === "Network Error" || error === "Network Error",
  //   }),
  // setNetworkError: (status) => set({ networkError: status }),
  // addFailedRequest: (request) =>
  //   set((state) => ({
  //     failedRequests: [...state.failedRequests, request],
  //   })),

  // clearFailedRequests: () => set({ failedRequests: [] }),
  switchRole: get()?.user?.activeRole || "Client",
  setSwitchRole: async (role) => {
    // set({
    //   chats: null,
    //   selectedChat: null,
    //   messages: [],
    //   groupedMessages: [],
    //   filteredChats: [],
    // });
    const formData = new FormData();
    formData.append("activeRole", role);
    await get().updateUserProfile("Client", formData);
    // get().fetchChats();
  },
  paramsFrom: null,
  setParamsFrom: (params) => set({ paramsFrom: params }),
  // progress: 0,
  // setProgress: (progress) => set({ progress }),

  // // Terms and privacy logics
  // resetAcceptance: () => {
  //   set({
  //     needsAcceptance: true,
  //     isChecking: true,
  //   });
  // },

  // setRequiredTerms: (terms: RequiredTerms[]) => {
  //   set({ requiredTerms: terms });
  // },

  // markAsAccepted: async () => {
  //   set({
  //     needsAcceptance: false,
  //     requiredTerms: [],
  //     isChecking: false,
  //   });
  // },

  // finishChecking: () => {
  //   set({ isChecking: false });
  // },

  // // app config
  // config: null,
  // versionState: "ok",
  // appLoading: true,

  // setConfig: (config) => set({ config }),
  // setVersionState: (versionState) => set({ versionState }),
  // setAppLoading: (loading) => set({ appLoading: loading }),

  // rateUsTracking: DEFAULT_RATE_US_TRACKING,

  // /** Call once per app session (in useAppGuard or root navigator mount). */
  // incrementSession: () =>
  //   set((state) => ({
  //     rateUsTracking: {
  //       ...state.rateUsTracking,
  //       installDate: state.rateUsTracking.installDate ?? Date.now(),
  //       sessionCount: state.rateUsTracking.sessionCount + 1,
  //     },
  //   })),

  // /** Call when the rate-us modal is displayed. */
  // recordPromptShown: () =>
  //   set((state) => ({
  //     rateUsTracking: {
  //       ...state.rateUsTracking,
  //       lastPromptedAt: Date.now(),
  //       nativePromptCount: state.rateUsTracking.nativePromptCount + 1,
  //     },
  //   })),

  // /** Call when user rates the app or taps "Don't ask again". */
  // markNeverShow: () =>
  //   set((state) => ({
  //     rateUsTracking: {
  //       ...state.rateUsTracking,
  //       neverShow: true,
  //     },
  //   })),

  // resetRateUsTracking: () => set({ rateUsTracking: DEFAULT_RATE_US_TRACKING }),
});
