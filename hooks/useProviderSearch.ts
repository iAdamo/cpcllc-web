"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { globalSearch } from "@/axios/search";
import { ProviderData } from "@/types";

export interface ProviderFilters {
  query?: string;
  location?: string;
  lat?: number;
  long?: number;
  sortBy?: string;
  categoryIds?: string[];
  minRating?: number;
  openNow?: boolean;
  verifiedOnly?: boolean;
  topRated?: boolean;
  radius?: string;
}

export interface ProviderPage {
  providers: ProviderData[];
  totalPages: number;
  page: number;
  total?: number;
}

export function useProviderSearch(filters: ProviderFilters) {
  return useInfiniteQuery<ProviderPage>({
    queryKey: ["providers-explore", filters],
    queryFn: async ({ pageParam }) => {
      const page = (pageParam as number) ?? 1;
      const result = await globalSearch({
        model: "providers",
        page,
        limit: 12,
        engine: false,
        searchInput: filters.query || undefined,
        lat: filters.lat?.toString() ?? "7.7427377",
        long: filters.long?.toString() ?? "4.5643091",
        sortBy: filters.sortBy,
        categories: filters.categoryIds?.length
          ? filters.categoryIds
          : undefined,
        city: filters.location ?? "",
        state: "",
        country: "Nigeria",
        radius: filters.radius,
      });
      return {
        providers: result.data.providers ?? [],
        totalPages: result.totalPages ?? 1,
        page,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.totalPages ? last.page + 1 : undefined,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
