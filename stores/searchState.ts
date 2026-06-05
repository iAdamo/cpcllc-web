"use client";

import { StateCreator } from "zustand";
import {
  GlobalStore,
  SearchState,
  SearchFilters,
  ProviderData,
  JobData,
} from "@/types";
import { globalSearch } from "@/axios/search";
import { queryClient } from "@/lib/queryClient";

const LIMIT = 15;

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

function buildSearchParams(
  model: "providers" | "jobs",
  filters: SearchFilters,
  page: number
) {
  const hasLocation = !!filters.location;
  return {
    model,
    page,
    limit: LIMIT,
    engine: hasLocation,
    searchInput: filters.query || (hasLocation ? "pass" : undefined),
    address: hasLocation ? filters.location : undefined,
    country: filters.country ?? "United States",
    lat: filters.lat?.toString(),
    long: filters.long?.toString(),
    sortBy: filters.sortBy,
    categories:
      model === "providers"
        ? filters.categoryIds?.length
          ? filters.categoryIds
          : undefined
        : filters.category
        ? [filters.category]
        : undefined,
  } as const;
}

export const searchSlice: StateCreator<GlobalStore, [], [], SearchState> = (
  set,
  get
) => ({
  // ── Model ──────────────────────────────────────────────────────────────────
  searchModel: "providers",
  setSearchModel: (model) => {
    if (get().searchModel !== model) {
      set({
        searchModel: model,
        providerResults: [],
        jobResults: [],
        searchPage: 1,
      });
    }
  },

  // ── Filters ────────────────────────────────────────────────────────────────
  searchFilters: DEFAULT_FILTERS,
  setSearchFilters: (f) =>
    set((state) => ({ searchFilters: { ...state.searchFilters, ...f } })),
  resetSearchFilters: () => set({ searchFilters: DEFAULT_FILTERS }),

  // ── Results ────────────────────────────────────────────────────────────────
  providerResults: [],
  jobResults: [],
  filteredProviders: [],
  filteredJobs: [],
  setFilteredProviders: (providers) => set({ filteredProviders: providers }),
  setFilteredJobs: (jobs) => set({ filteredJobs: jobs }),

  // ── Pagination ─────────────────────────────────────────────────────────────
  searchPage: 1,
  searchTotalPages: 1,
  searchTotal: 0,

  // ── Status ─────────────────────────────────────────────────────────────────
  isSearching: false,
  isLoadingMore: false,

  // ── executeSearch ──────────────────────────────────────────────────────────
  // Resets to page 1 and fetches fresh results. Pass overrides to temporarily
  // diverge from stored filters without mutating them (e.g. one-shot queries).
  executeSearch: async (overrides) => {
    const state = get();
    const model =
      (overrides?.model as "providers" | "jobs") ?? state.searchModel;
    let filters: SearchFilters = { ...state.searchFilters, ...overrides };

    // Auto-request location if no coordinates available
    if (!filters.lat && !filters.long && state.getCurrentLocation) {
      try {
        const loc = await state.getCurrentLocation();
        if (loc?.coords) {
          filters = {
            ...filters,
            lat: loc.coords.latitude,
            long: loc.coords.longitude,
            country: loc.country ?? filters.country,
          };
          set((s) => ({
            searchFilters: {
              ...s.searchFilters,
              lat: loc.coords.latitude,
              long: loc.coords.longitude,
              country: loc.country ?? s.searchFilters.country,
            },
          }));
        }
      } catch {
        // proceed without location
      }
    }

    const params = buildSearchParams(model, filters, 1);

    set({
      isSearching: true,
      searchPage: 1,
      providerResults: [],
      jobResults: [],
    });

    try {
      const result = await queryClient.fetchQuery({
        queryKey: ["search", model, params],
        queryFn: () => globalSearch(params),
        staleTime: 2 * 60 * 1000,
      });

      const providers = result.data.providers ?? [];
      const jobs = result.data.jobs ?? [];

      set({
        providerResults: model === "providers" ? providers : [],
        jobResults: model === "jobs" ? jobs : [],
        searchTotalPages: result.totalPages ?? 1,
        searchTotal:
          (result as any).total ??
          (model === "providers" ? providers.length : jobs.length),
      });
    } catch (err) {
      console.error("[SearchState] executeSearch error:", err);
    } finally {
      set({ isSearching: false });
    }
  },

  // ── loadMore ───────────────────────────────────────────────────────────────
  // Appends the next page to existing results (infinite scroll).
  loadMore: async () => {
    const state = get();
    if (state.isLoadingMore || state.searchPage >= state.searchTotalPages)
      return;

    const model = state.searchModel;
    const filters = state.searchFilters;
    const nextPage = state.searchPage + 1;
    const params = buildSearchParams(model, filters, nextPage);

    set({ isLoadingMore: true });

    try {
      const result = await queryClient.fetchQuery({
        queryKey: ["search", model, params],
        queryFn: () => globalSearch(params),
        staleTime: 2 * 60 * 1000,
      });

      set((s) => ({
        providerResults:
          model === "providers"
            ? [...s.providerResults, ...(result.data.providers ?? [])]
            : s.providerResults,
        jobResults:
          model === "jobs"
            ? [...s.jobResults, ...(result.data.jobs ?? [])]
            : s.jobResults,
        searchPage: nextPage,
        searchTotalPages: result.totalPages ?? s.searchTotalPages,
      }));
    } catch (err) {
      console.error("[SearchState] loadMore error:", err);
    } finally {
      set({ isLoadingMore: false });
    }
  },

  // ── clearSearchResults ─────────────────────────────────────────────────────
  clearSearchResults: () =>
    set({
      providerResults: [],
      jobResults: [],
      filteredProviders: [],
      filteredJobs: [],
      searchPage: 1,
      searchTotalPages: 1,
      searchTotal: 0,
    }),
});
