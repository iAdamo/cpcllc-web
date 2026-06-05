"use client";
import { ProviderData, Category, SearchResultData } from "@/types";
import { StateCreator } from "zustand";
import { GlobalStore, ProviderState, SortBy, JobData } from "@/types";
import { setUserFavourites } from "@/axios/user";

export const providerState: StateCreator<GlobalStore, [], [], ProviderState> = (
  set,
  get
) => ({
  // ── Searching flag (legacy — new code should use SearchState.isSearching) ──
  isSearching: false,

  sortBy: "Relevance",
  categories: [],
  setCategories: (categories: Category[]) => set({ categories }),
  setSortBy: (sortBy: SortBy) => set({ sortBy }),

  // ── Saved ──────────────────────────────────────────────────────────────────
  savedJobs: [],
  savedProviders: [],

  setSavedProviders: async (providerId) => {
    try {
      const data = await setUserFavourites(providerId);
      if (data.provider._id) {
        if (data.provider.favoritedBy.includes(get().user?._id || "")) {
          set({
            savedProviders: [...get().savedProviders, data.provider],
            success: "Added to Saved Companies",
          });
        } else {
          set({
            savedProviders: get().savedProviders.filter(
              (p) => p._id !== providerId
            ),
            success: "Removed from Saved Companies",
          });
        }
      }
    } catch {
      set({ error: "Failed to update favourites." });
    }
  },

  setSavedJobs: (job: JobData) => {
    const exists = get().savedJobs.some((j) => j._id === job._id);
    if (exists) {
      set({
        savedJobs: get().savedJobs.filter((j) => j._id !== job._id),
        success: "Removed from Saved Jobs",
      });
    } else {
      set({ savedJobs: [...get().savedJobs, job], success: "Added to Saved Jobs" });
    }
  },

  // ── Subcategory selection ───────────────────────────────────────────────────
  selectedSubcategories: [],
  setSelectedSubcategories: (subs) => {
    const unique = Array.from(new Map(subs.map((s) => [s._id, s])).values());
    set({ selectedSubcategories: unique });
  },
  toggleSubcategory: (sub) => {
    set((state) => {
      const map = new Map(state.selectedSubcategories.map((s) => [s._id, s]));
      if (map.has(sub._id)) map.delete(sub._id);
      else map.set(sub._id, sub);
      return { selectedSubcategories: Array.from(map.values()) };
    });
  },
  clearSelectedSubcategories: () => set({ selectedSubcategories: [] }),

  // ── Legacy search result slot ───────────────────────────────────────────────
  // SearchState.providerResults / SearchState.jobResults should be used instead.
  searchResults: { providers: [], services: [], jobs: [] },
  setSearchResults: (results: SearchResultData) => set({ searchResults: results }),
  clearSearchResults: () =>
    set({ searchResults: { providers: [], services: [], jobs: [] } }),

  // ── Filtered lists (client-side) — now delegated to SearchState ───────────
  filteredProviders: [],
  setFilteredProviders: (providers: ProviderData[]) =>
    set({ filteredProviders: providers }),
  filteredJobs: [],
  setFilteredJobs: (jobs: JobData[]) => set({ filteredJobs: jobs }),

});
