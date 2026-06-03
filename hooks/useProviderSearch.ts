"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { globalSearch } from "@/axios/search";
import { ProviderData } from "@/types";

export interface ProviderFilters {
  query?: string;
  location?: string;
  country?: string;
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
      const hasLocation = !!filters.location;
      const result = await globalSearch({
        model: "providers",
        page,
        limit: 12,
        engine: hasLocation,
        searchInput: filters.query || (hasLocation ? "pass" : undefined),
        lat: filters.lat?.toString(),
        long: filters.long?.toString(),
        sortBy: filters.sortBy,
        categories: filters.categoryIds?.length ? filters.categoryIds : undefined,
        address: hasLocation ? filters.location : undefined,
        state: "",
        country: filters.country || "Nigeria",
        radius: filters.radius,
      });
      return {
        providers: result.data.providers ?? [],
        totalPages: result.totalPages ?? 1,
        page,
        total: (result as any).total,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.totalPages ? last.page + 1 : undefined,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
