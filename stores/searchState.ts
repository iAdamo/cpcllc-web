"use client";

import { StateCreator } from "zustand";
import {
  GlobalStore,
  SearchState,
  SearchFilters,
} from "@/types";

const DEFAULT_FILTERS: SearchFilters = {
  query: undefined,
  location: undefined,
  country: "United States",
  lat: undefined,
  long: undefined,
  sortBy: undefined,
  categoryIds: [],
  verifiedOnly: false,
  minRating: 0,
  radius: "30",
  topRated: false,
  openNow: false,
  category: undefined,
  urgency: undefined,
};

/**
 * Client side of the marketplace search: which model is active, what the
 * filters are, and the client-side narrowed lists the "What" box produces.
 * The results themselves are server state and live in TanStack Query —
 * see hooks/useGlobalSearch.ts.
 */
export const searchSlice: StateCreator<GlobalStore, [], [], SearchState> = (
  set,
  get
) => ({
  searchModel: "providers",
  setSearchModel: (model) => {
    if (get().searchModel !== model) {
      set({ searchModel: model, filteredProviders: [], filteredJobs: [] });
    }
  },

  searchFilters: DEFAULT_FILTERS,
  setSearchFilters: (f) =>
    set((state) => ({ searchFilters: { ...state.searchFilters, ...f } })),
  resetSearchFilters: () => set({ searchFilters: DEFAULT_FILTERS }),

  filteredProviders: [],
  filteredJobs: [],
  setFilteredProviders: (providers) => set({ filteredProviders: providers }),
  setFilteredJobs: (jobs) => set({ filteredJobs: jobs }),
  clearFiltered: () => set({ filteredProviders: [], filteredJobs: [] }),
});
