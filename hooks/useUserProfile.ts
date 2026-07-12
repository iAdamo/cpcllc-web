"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/axios/user";
import type { UserData } from "@/types";

/**
 * Fetch any user's profile by id. Pass no id for the signed-in user's own
 * profile (the API resolves it from the session). The Zustand `user` slice
 * remains the session identity; this hook is for viewing profiles — own or
 * other people's — as server data with proper caching.
 */
export function useUserProfile(userId?: string, opts: { enabled?: boolean } = {}) {
  return useQuery<UserData>({
    queryKey: ["user-profile", userId ?? "me"],
    queryFn: () => getUserProfile(userId),
    enabled: opts.enabled ?? true,
    staleTime: 60 * 1000,
  });
}
