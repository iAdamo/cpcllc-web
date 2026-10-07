"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { decideTerms, getCurrentTerms, getTermsStatus } from "@/axios/terms";
import { acceptedTermsFor } from "@/lib/terms";

const STATUS_KEY = ["terms", "status"] as const;

/**
 * The current policy versions for the sign-up Terms checkbox, and the
 * `acceptedTerms` field to send once it is ticked. No retry: a 404 means the
 * API is older than the checkbox, and that account is shown the documents
 * after the email code instead.
 */
export function useCurrentTerms() {
  const query = useQuery({
    queryKey: ["terms", "current"],
    queryFn: getCurrentTerms,
    staleTime: 10 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
  return { ...query, acceptedTerms: acceptedTermsFor(query.data) };
}

/** Which current policies this account still has to accept. Never served
 *  stale: it decides where the person goes next. */
export function useTermsStatus() {
  return useQuery({
    queryKey: STATUS_KEY,
    queryFn: getTermsStatus,
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

/** The same answer on demand (right after the email code). */
export function useFetchTermsStatus() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.fetchQuery({
      queryKey: STATUS_KEY,
      queryFn: getTermsStatus,
      staleTime: 0,
    });
}

/** Record the person's decision on each policy (platform web). */
export function useDecideTerms() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: decideTerms,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: STATUS_KEY }),
  });
}
