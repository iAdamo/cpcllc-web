"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminKeys } from "@/hooks/admin/adminQueryKeys";
import {
  decideLegalRequest,
  getLegalRequest,
  getLegalRequests,
  moveLegalRequest,
  noteLegalRequest,
  type LegalRequestFilters,
} from "@/axios/legalRequests";
import type { LegalRequestDetail } from "@/lib/legalRequests";

export function useLegalRequests(filters: LegalRequestFilters) {
  return useQuery({
    queryKey: adminKeys.legalRequestsView(filters as Record<string, unknown>),
    queryFn: () => getLegalRequests(filters),
    placeholderData: keepPreviousData,
  });
}

export function useLegalRequest(id: string | null) {
  return useQuery({
    queryKey: adminKeys.legalRequest(id ?? ""),
    queryFn: () => getLegalRequest(id!),
    enabled: !!id,
  });
}

/** Every action answers with the updated request: put it in the cache and
 *  refresh the list (its status and counts changed). */
function useRequestAction<T>(fn: (input: T) => Promise<LegalRequestDetail>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: (doc) => {
      qc.setQueryData(adminKeys.legalRequest(doc._id), doc);
      qc.invalidateQueries({ queryKey: adminKeys.legalRequests });
    },
  });
}

export const useMoveLegalRequest = () => useRequestAction(moveLegalRequest);
export const useNoteLegalRequest = () => useRequestAction(noteLegalRequest);
export const useDecideLegalRequest = () => useRequestAction(decideLegalRequest);
