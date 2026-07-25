"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAdminOverview,
  getAdminUsersView,
  getAdminUserDetail,
  getAdminProvidersView,
  getAdminProviderDetail,
  getAdminClientsView,
  getAdminClientDetail,
  getAdminTasksView,
  getAdminTaskDetail,
  getAdminEngagementsView,
  getAdminEngagementDetail,
  getAdminReviewsView,
  type AdminEngagementsBundle,
  type AdminReviewsBundle,
} from "@/axios/admin";
import type {
  AdminClientsBundle,
  AdminOverviewShape,
  AdminProviderDetail,
  AdminProvidersBundle,
  AdminTaskDetail,
  AdminTasksBundle,
  AdminUserDetail,
  AdminUsersBundle,
} from "@/types/admin-marketplace";
import { adminKeys } from "./adminQueryKeys";

const ADMIN_STALE_TIME = 60 * 1000;

/**
 * All admin data flows through TanStack Query. The websocket bridge
 * (useAdminCacheBridge) invalidates or patches these keys directly on the
 * shared queryClient, so views refetch (or update in place) without any
 * hand-rolled cache. Return shape is { data, loading, error, refresh } to
 * match what the admin views already consume.
 */
function shape<T>(q: {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => unknown;
}) {
  return {
    data: q.data,
    loading: q.isLoading,
    error: q.error,
    refresh: () => void q.refetch(),
  };
}

/* ─── Overview (bundled dashboard) ─────────────────────────────────────── */

export function useAdminOverview(opts: { skip?: boolean } = {}) {
  return shape(
    useQuery<AdminOverviewShape>({
      queryKey: adminKeys.overview,
      queryFn: getAdminOverview,
      enabled: !opts.skip,
      staleTime: ADMIN_STALE_TIME,
    }),
  );
}

/** Kept as an alias so the dashboard view keeps working without rename. */
export const useAdminDashboard = useAdminOverview;

/* ─── Marketplace list views ───────────────────────────────────────────── */

export function useAdminUsersView(filter: Record<string, unknown>) {
  return shape(
    useQuery<AdminUsersBundle>({
      queryKey: adminKeys.usersView(filter),
      queryFn: () => getAdminUsersView(filter),
      staleTime: ADMIN_STALE_TIME,
      placeholderData: (prev) => prev,
    }),
  );
}

export function useAdminProvidersView(filter: Record<string, unknown>) {
  return shape(
    useQuery<AdminProvidersBundle>({
      queryKey: adminKeys.providersView(filter),
      queryFn: () => getAdminProvidersView(filter),
      staleTime: ADMIN_STALE_TIME,
      placeholderData: (prev) => prev,
    }),
  );
}

export function useAdminClientsView(filter: Record<string, unknown>) {
  return shape(
    useQuery<AdminClientsBundle>({
      queryKey: adminKeys.clientsView(filter),
      queryFn: () => getAdminClientsView(filter),
      staleTime: ADMIN_STALE_TIME,
      placeholderData: (prev) => prev,
    }),
  );
}

export function useAdminTasksView(filter: Record<string, unknown>) {
  return shape(
    useQuery<AdminTasksBundle>({
      queryKey: adminKeys.tasksView(filter),
      queryFn: () => getAdminTasksView(filter),
      staleTime: ADMIN_STALE_TIME,
      placeholderData: (prev) => prev,
    }),
  );
}

/* ─── Detail drawer hooks ──────────────────────────────────────────────── */

export function useAdminUserDetail(id: string | null) {
  return shape(
    useQuery<AdminUserDetail>({
      queryKey: adminKeys.userDetail(id ?? ""),
      queryFn: () => getAdminUserDetail(id ?? ""),
      enabled: !!id,
      staleTime: ADMIN_STALE_TIME,
    }),
  );
}

export function useAdminProviderDetail(id: string | null) {
  return shape(
    useQuery<AdminProviderDetail>({
      queryKey: adminKeys.providerDetail(id ?? ""),
      queryFn: () => getAdminProviderDetail(id ?? ""),
      enabled: !!id,
      staleTime: ADMIN_STALE_TIME,
    }),
  );
}

export function useAdminClientDetail(id: string | null) {
  return shape(
    useQuery<AdminUserDetail>({
      queryKey: adminKeys.clientDetail(id ?? ""),
      queryFn: () => getAdminClientDetail(id ?? ""),
      enabled: !!id,
      staleTime: ADMIN_STALE_TIME,
    }),
  );
}

export function useAdminTaskDetail(id: string | null) {
  return shape(
    useQuery<AdminTaskDetail>({
      queryKey: adminKeys.taskDetail(id ?? ""),
      queryFn: () => getAdminTaskDetail(id ?? ""),
      enabled: !!id,
      staleTime: ADMIN_STALE_TIME,
    }),
  );
}

/* ─── Trust & Safety ───────────────────────────────────────────────────── */

export function useAdminEngagementsView(filter: Record<string, unknown>) {
  return shape(
    useQuery<AdminEngagementsBundle>({
      queryKey: adminKeys.engagementsView(filter),
      queryFn: () => getAdminEngagementsView(filter),
      staleTime: ADMIN_STALE_TIME,
      placeholderData: (prev) => prev,
    }),
  );
}

export function useAdminEngagementDetail(id: string | null) {
  return shape(
    useQuery<{ task: any; certificate: any }>({
      queryKey: adminKeys.engagementDetail(id ?? ""),
      queryFn: () => getAdminEngagementDetail(id ?? ""),
      enabled: !!id,
      staleTime: ADMIN_STALE_TIME,
    }),
  );
}

export function useAdminReviewsView(filter: Record<string, unknown>) {
  return shape(
    useQuery<AdminReviewsBundle>({
      queryKey: adminKeys.reviewsModView(filter),
      queryFn: () => getAdminReviewsView(filter),
      staleTime: ADMIN_STALE_TIME,
      placeholderData: (prev) => prev,
    }),
  );
}
