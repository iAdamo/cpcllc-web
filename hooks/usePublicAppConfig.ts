"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicAppConfig } from "@/axios/appConfig";

/** Public app settings (the footer's social links). Changes rarely. */
export function usePublicAppConfig() {
  return useQuery({
    queryKey: ["public-app-config"],
    queryFn: getPublicAppConfig,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
