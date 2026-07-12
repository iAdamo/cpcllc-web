"use client";

import { useQuery } from "@tanstack/react-query";
import useGlobalStore from "@/stores";
import { getMetrics } from "@/axios/admin";

/**
 * Admin analytics time-series. Granularity / year / month are dashboard UI
 * state (Zustand); the metrics payload is server data keyed on them, so a
 * control change re-keys the query and refetches automatically — this
 * replaces the old store-side fetchMetrics.
 */
export function useMetrics(opts: { enabled?: boolean } = {}) {
  const granularity = useGlobalStore((s) => s.granularity);
  const selectedYear = useGlobalStore((s) => s.selectedYear);
  const selectedMonth = useGlobalStore((s) => s.selectedMonth);

  const validSelection = granularity !== "daily" || selectedMonth != null;

  return useQuery({
    queryKey: ["admin", "metrics", granularity, selectedYear, selectedMonth],
    queryFn: () =>
      getMetrics({
        granularity,
        year: selectedYear,
        month: granularity === "daily" ? selectedMonth : null,
      }),
    enabled: (opts.enabled ?? true) && validSelection,
    staleTime: 60 * 1000,
  });
}
