"use client";

import { useEffect, useMemo } from "react";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import useGlobalStore from "@/stores";
import { globalSearch } from "@/axios/search";
import { queryClient } from "@/lib/queryClient";
import { getUserCountry, LAST_RESORT_COUNTRY } from "@/lib/country";
import type { SearchFilters, ProviderData, JobData } from "@/types";

const LIMIT = 15;

interface SearchPage {
  providers: ProviderData[];
  jobs: JobData[];
  totalPages: number;
  total?: number;
  page: number;
}

function buildSearchParams(
  model: "providers" | "tasks",
  filters: SearchFilters,
  page: number,
) {
  const hasLocation = !!filters.location;
  return {
    model,
    page,
    limit: LIMIT,
    engine: hasLocation,
    searchInput: filters.query || (hasLocation ? "pass" : undefined),
    address: hasLocation ? filters.location : undefined,
    country: filters.country ?? LAST_RESORT_COUNTRY,
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

/**
 * Imperative, non-subscribing read of the most recent cached job results.
 * Used by NavBar's client-side narrowing so it never mounts (and therefore
 * never fetches) the search query itself.
 */
export function getCachedJobResults(): JobData[] {
  const entries = queryClient.getQueriesData<InfiniteData<SearchPage>>({
    queryKey: ["search", "tasks"],
  });
  for (let i = entries.length - 1; i >= 0; i--) {
    const data = entries[i][1];
    if (data?.pages?.length) {
      return data.pages.flatMap((p) => p.jobs);
    }
  }
  return [];
}

/**
 * Server side of the marketplace search. Filters and model live in Zustand
 * (they're shared UI state between NavBar, UniversalSearch and the result
 * pages); the fetching, caching, dedup and pagination live here. Changing
 * `setSearchFilters` / `setSearchModel` changes the query key, which
 * re-runs the search — there is no imperative `executeSearch` anymore.
 */
export function useGlobalSearch(model?: "providers" | "tasks") {
  const storeModel = useGlobalStore((s) => s.searchModel);
  const filters = useGlobalStore((s) => s.searchFilters);
  const setSearchFilters = useGlobalStore((s) => s.setSearchFilters);
  const getCurrentLocation = useGlobalStore((s) => s.getCurrentLocation);
  const user = useGlobalStore((s) => s.user);

  const activeModel = model ?? storeModel;

  // If the search has no country yet, seed it from the signed-in user's own
  // account country — so a Nigerian user searches Nigeria immediately, without
  // waiting on (or being forced past) geolocation.
  useEffect(() => {
    if (filters.country) return;
    const accountCountry = getUserCountry(user);
    if (accountCountry) setSearchFilters({ country: accountCountry });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Auto-request device location once if the filters carry no coordinates —
  // preserves the old executeSearch behaviour of location-aware first search.
  useEffect(() => {
    if (filters.lat != null || filters.long != null) return;
    let cancelled = false;
    (async () => {
      try {
        const loc = await getCurrentLocation();
        if (cancelled || !loc?.coords) return;
        setSearchFilters({
          lat: loc.coords.latitude,
          long: loc.coords.longitude,
          country: (loc as any).country ?? undefined,
        });
      } catch {
        // proceed without location
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const query = useInfiniteQuery<SearchPage>({
    queryKey: ["search", activeModel, filters],
    queryFn: async ({ pageParam }) => {
      const page = (pageParam as number) ?? 1;
      const result = await globalSearch(
        buildSearchParams(activeModel, filters, page),
      );
      return {
        providers: result.data.providers ?? [],
        jobs: result.data.tasks ?? [],
        totalPages: result.totalPages ?? 1,
        total: (result as any).total,
        page,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.totalPages ? last.page + 1 : undefined,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const providerResults = useMemo(
    () => query.data?.pages.flatMap((p) => p.providers) ?? [],
    [query.data],
  );
  const jobResults = useMemo(
    () => query.data?.pages.flatMap((p) => p.jobs) ?? [],
    [query.data],
  );

  const lastPage = query.data?.pages[query.data.pages.length - 1];

  return {
    providerResults,
    jobResults,
    isSearching: query.isLoading,
    isLoadingMore: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    loadMore: () => void query.fetchNextPage(),
    refetch: () => void query.refetch(),
    total:
      lastPage?.total ??
      (activeModel === "providers" ? providerResults.length : jobResults.length),
    totalPages: lastPage?.totalPages ?? 1,
    error: query.error,
  };
}
