"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useGlobalStore from "@/stores";
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

/**
 * Generic "read-from-Zustand, fetch-on-miss" hook. Pure REST + axios — no
 * GraphQL anywhere. On mount, if the slice is empty, fire the fetcher and
 * write the result back. Subsequent mounts read from the slice and skip the
 * network entirely. The websocket bridge wipes slices it cares about, which
 * triggers a fresh fetch the next time the relevant view mounts.
 */
function useCachedRest<TData>(opts: {
  readCache: () => TData | undefined;
  writeCache: (data: TData) => void;
  fetcher: () => Promise<TData>;
  skip?: boolean;
}) {
  const { readCache, writeCache, fetcher, skip } = opts;
  const cached = readCache();
  const [loading, setLoading] = useState(!cached && !skip);
  const [error, setError] = useState<Error | null>(null);
  const inFlightRef = useRef(false);

  const refresh = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const data = await fetcher();
      if (data !== undefined) writeCache(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  }, [fetcher, writeCache]);

  useEffect(() => {
    if (skip) return;
    if (cached !== undefined) return;
    void refresh();
  }, [skip, cached, refresh]);

  return { data: cached, loading: loading && !cached, error, refresh };
}

/* ─── Overview (bundled dashboard) ─────────────────────────────────────── */

export function useAdminOverview(opts: { skip?: boolean } = {}) {
  const data = useGlobalStore((s) => s.adminDashboard) ?? undefined;
  const setData = useGlobalStore((s) => s.setAdminDashboard);

  const result = useCachedRest<AdminOverviewShape>({
    readCache: () =>
      (useGlobalStore.getState().adminDashboard as
        | AdminOverviewShape
        | undefined) ?? undefined,
    writeCache: (d) => setData(d as any),
    fetcher: getAdminOverview,
    skip: opts.skip,
  });
  return { ...result, data: (result.data ?? data) as AdminOverviewShape | undefined };
}

/** Kept as an alias so the dashboard view keeps working without rename. */
export const useAdminDashboard = useAdminOverview;

/* ─── Marketplace list views ───────────────────────────────────────────── */

function keyOf(filter: Record<string, unknown>): string {
  return JSON.stringify(filter ?? {});
}

export function useAdminUsersView(filter: Record<string, unknown>) {
  const key = keyOf(filter);
  const cached = useGlobalStore((s) => s.adminUsersByKey[key]);
  const setBundle = useGlobalStore((s) => s.setAdminUsers);
  const result = useCachedRest<AdminUsersBundle>({
    readCache: () => useGlobalStore.getState().adminUsersByKey[key],
    writeCache: (d) => setBundle(key, d),
    fetcher: () => getAdminUsersView(filter),
  });
  return { ...result, data: result.data ?? cached };
}

export function useAdminProvidersView(filter: Record<string, unknown>) {
  const key = keyOf(filter);
  const cached = useGlobalStore((s) => s.adminProvidersByKey[key]);
  const setBundle = useGlobalStore((s) => s.setAdminProviders);
  const result = useCachedRest<AdminProvidersBundle>({
    readCache: () => useGlobalStore.getState().adminProvidersByKey[key],
    writeCache: (d) => setBundle(key, d),
    fetcher: () => getAdminProvidersView(filter),
  });
  return { ...result, data: result.data ?? cached };
}

export function useAdminClientsView(filter: Record<string, unknown>) {
  const key = keyOf(filter);
  const cached = useGlobalStore((s) => s.adminClientsByKey[key]);
  const setBundle = useGlobalStore((s) => s.setAdminClients);
  const result = useCachedRest<AdminClientsBundle>({
    readCache: () => useGlobalStore.getState().adminClientsByKey[key],
    writeCache: (d) => setBundle(key, d),
    fetcher: () => getAdminClientsView(filter),
  });
  return { ...result, data: result.data ?? cached };
}

export function useAdminTasksView(filter: Record<string, unknown>) {
  const key = keyOf(filter);
  const cached = useGlobalStore((s) => s.adminTasksByKey[key]);
  const setBundle = useGlobalStore((s) => s.setAdminTasks);
  const result = useCachedRest<AdminTasksBundle>({
    readCache: () => useGlobalStore.getState().adminTasksByKey[key],
    writeCache: (d) => setBundle(key, d),
    fetcher: () => getAdminTasksView(filter),
  });
  return { ...result, data: result.data ?? cached };
}

/* ─── Detail drawer hooks ──────────────────────────────────────────────── */

export function useAdminUserDetail(id: string | null) {
  const cached = useGlobalStore((s) =>
    id ? s.adminUserById[id] : undefined,
  );
  const setDetail = useGlobalStore((s) => s.setAdminUserDetail);
  const result = useCachedRest<AdminUserDetail>({
    readCache: () =>
      id ? useGlobalStore.getState().adminUserById[id] : undefined,
    writeCache: (d) => {
      if (id) setDetail(id, d);
    },
    fetcher: () => getAdminUserDetail(id ?? ""),
    skip: !id,
  });
  return { ...result, data: result.data ?? cached };
}

export function useAdminProviderDetail(id: string | null) {
  const cached = useGlobalStore((s) =>
    id ? s.adminProviderById[id] : undefined,
  );
  const setDetail = useGlobalStore((s) => s.setAdminProviderDetail);
  const result = useCachedRest<AdminProviderDetail>({
    readCache: () =>
      id ? useGlobalStore.getState().adminProviderById[id] : undefined,
    writeCache: (d) => {
      if (id) setDetail(id, d);
    },
    fetcher: () => getAdminProviderDetail(id ?? ""),
    skip: !id,
  });
  return { ...result, data: result.data ?? cached };
}

export function useAdminClientDetail(id: string | null) {
  const cached = useGlobalStore((s) =>
    id ? s.adminClientById[id] : undefined,
  );
  const setDetail = useGlobalStore((s) => s.setAdminClientDetail);
  const result = useCachedRest<AdminUserDetail>({
    readCache: () =>
      id ? useGlobalStore.getState().adminClientById[id] : undefined,
    writeCache: (d) => {
      if (id) setDetail(id, d);
    },
    fetcher: () => getAdminClientDetail(id ?? ""),
    skip: !id,
  });
  return { ...result, data: result.data ?? cached };
}

export function useAdminTaskDetail(id: string | null) {
  const cached = useGlobalStore((s) =>
    id ? s.adminTaskById[id] : undefined,
  );
  const setDetail = useGlobalStore((s) => s.setAdminTaskDetail);
  const result = useCachedRest<AdminTaskDetail>({
    readCache: () =>
      id ? useGlobalStore.getState().adminTaskById[id] : undefined,
    writeCache: (d) => {
      if (id) setDetail(id, d);
    },
    fetcher: () => getAdminTaskDetail(id ?? ""),
    skip: !id,
  });
  return { ...result, data: result.data ?? cached };
}
