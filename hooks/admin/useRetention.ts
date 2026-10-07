"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminKeys } from "@/hooks/admin/adminQueryKeys";
import {
  getRetentionHolds,
  getRetentionOverview,
  getRetentionRuns,
  placeRetentionHold,
  previewRetention,
  releaseRetentionHold,
} from "@/axios/retention";

/** Periods, the job's mode and its last run. */
export function useRetentionOverview() {
  return useQuery({ queryKey: adminKeys.retention, queryFn: getRetentionOverview });
}

export function useRetentionRuns() {
  return useQuery({ queryKey: adminKeys.retentionRuns, queryFn: () => getRetentionRuns(30) });
}

export function useRetentionHolds() {
  return useQuery({ queryKey: adminKeys.retentionHolds, queryFn: getRetentionHolds });
}

/** A dry run now: counts what the job would delete, deletes nothing. */
export function usePreviewRetention() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: previewRetention,
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.retention }),
  });
}

export function usePlaceHold() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: placeRetentionHold,
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.retentionHolds }),
  });
}

export function useReleaseHold() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: releaseRetentionHold,
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.retentionHolds }),
  });
}
