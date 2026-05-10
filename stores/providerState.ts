import {
  ProviderData,
  Category,
  SearchParams,
  AddressSuggestion,
} from "@/types";
import { StateCreator } from "zustand";
import {
  GlobalStore,
  ProviderState,
  SearchResultData,
  SortBy,
  JobData,
} from "@/types";
import { globalSearch } from "@/axios/search";
import { setUserFavourites } from "@/axios/user";

export const providerViewSlice: StateCreator<
  GlobalStore,
  [],
  [],
  ProviderState
> = (set, get) => ({
  isSearching: false,
  displayStyle: "Grid",
  sortBy: "Relevance",
  categories: [],
  setCategories: (categories: Category[]) => set({ categories }),
  setSortBy: (sortBy: SortBy) => set({ sortBy }),
  savedJobs: [],
  selectedSubcategories: [],
  // setSelectedSubcategories: (subs) => {
  //   set({ selectedSubcategories: subs });
  // },

  setSelectedSubcategories: (subs) => {
    const unique = Array.from(new Map(subs.map((s) => [s._id, s])).values());

    set({ selectedSubcategories: unique });
  },

  toggleSubcategory: (sub) => {
    set((state) => {
      const map = new Map(state.selectedSubcategories.map((s) => [s._id, s]));

      if (map.has(sub._id)) {
        map.delete(sub._id);
      } else {
        map.set(sub._id, sub);
      }

      return {
        selectedSubcategories: Array.from(map.values()),
      };
    });
  },

  clearSelectedSubcategories: () => {
    set({ selectedSubcategories: [] });
  },

  // Search-related state and actions
  searchResults: { providers: [], services: [], jobs: [] },
  setSearchResults: (results: SearchResultData) =>
    set({ searchResults: results }),

  filteredProviders: [],
  setFilteredProviders: (providers: ProviderData[]) => {
    set({ filteredProviders: providers });
  },

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
              (provider) => provider._id !== providerId
            ),
            success: "Removed from Saved Companies",
          });
        }
      }
    } catch (error) {
      set({ error: "Failed to update favourites." });
      console.error("Failed to update favourites:", error);
    }
  },

  setSavedJobs: (job: JobData) => {
    const existing = get().savedJobs.find((j) => j._id === job._id);
    if (existing) {
      // remove
      set({ savedJobs: get().savedJobs.filter((j) => j._id !== job._id) });
      set({ success: "Removed from Saved Jobs" });
    } else {
      // add
      set({ savedJobs: [...get().savedJobs, job] });
      set({ success: "Added to Saved Jobs" });
    }
  },
  filteredJobs: [],
  setFilteredJobs: (jobs: JobData[]) => {
    set({ filteredJobs: jobs });
  },

  executeSearch: async (params: SearchParams) => {
    set({ error: null, success: null, isSearching: true });
    try {
      const {
        model,
        page,
        limit,
        engine,
        featured,
        searchInput,
        lat,
        long,
        city,
        state,
        country,
        address,
        sortBy,
        categories,
      } = params;
      if (get().error === "terms error") {
        set({ isSearching: false });
        return;
      }
      const response = await globalSearch({
        model,
        page,
        limit,
        engine,
        featured,
        searchInput,
        lat: lat?.toString(),
        long: long?.toString(),
        city,
        state,
        country,
        address,
        sortBy,
        categories,
      });
      if (response.type === "providers") {
        set({
          searchResults: {
            providers: response.data.providers || [],
            // services: response.services || [],
            // jobs: [],
            page: page,
            totalPages: response.totalPages,
          },
        });
      } else if (response.type === "jobs") {
        set({
          searchResults: {
            // providers: [],
            // services: [],
            jobs: response.data.jobs || [],
            page: page,
            totalPages: response.totalPages,
          },
        });
      }
    } catch (error: any) {
      console.error("Search error:", error);
      // set({
      //   error:
      //     error?.response?.data?.message || "An error occurred during search.",
      // });
    } finally {
      set({ isSearching: false });
    }
  },
  clearSearchResults: () =>
    set({ searchResults: { providers: [], services: [], jobs: [] } }),
});
