"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { globalSearch } from "@/axios/search";
import { JobData } from "@/types";

export interface JobFilters {
  query?: string;
  location?: string;
  country?: string;
  lat?: number;
  long?: number;
  sortBy?: string; // "Newest" | "Oldest" | "Budget" | "Relevance"
  category?: string; // category name filter
  urgency?: string; // "Normal" | "Urgent" | "Immediate"
}

export interface JobPage {
  jobs: JobData[];
  totalPages: number;
  page: number;
  total?: number;
}

export function useJobSearch(filters: JobFilters) {
  return useInfiniteQuery<JobPage>({
    queryKey: ["jobs-explore", filters],
    queryFn: async ({ pageParam }) => {
      const page = (pageParam as number) ?? 1;
      const hasLocation = !!filters.location;
      const result = await globalSearch({
        model: "jobs",
        page,
        limit: 15,
        engine: hasLocation,
        searchInput: filters.query || (hasLocation ? "pass" : undefined),
        address: hasLocation ? filters.location : undefined,
        country: filters.country || "Nigeria",
        lat: filters.lat?.toString(),
        long: filters.long?.toString(),
        sortBy: filters.sortBy,
        categories: filters.category ? [filters.category] : undefined,
      });
      return {
        jobs: result.data.jobs ?? [],
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
