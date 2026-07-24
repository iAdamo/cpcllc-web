"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyAdminUser } from "@/axios/admin";
import type { AdminUserMe } from "@/types/admin";

const WILDCARD = "*:*";

export type SensitiveSection =
  | "contact"
  | "private"
  | "security"
  | "login_history"
  | "device_sessions"
  | "audit";

/**
 * The current admin's own authorization context, cached. The single primitive
 * the admin UI uses to gate itself — hide sections/actions the admin lacks
 * permission for instead of rendering forbidden controls.
 */
export function usePermissions() {
  const { data, isLoading } = useQuery<AdminUserMe | null>({
    queryKey: ["admin", "me"],
    queryFn: () => getMyAdminUser(),
    staleTime: 5 * 60 * 1000,
  });

  const permissions = data?.permissions ?? [];
  const has = (perm: string) =>
    permissions.includes(WILDCARD) || permissions.includes(perm);
  const hasAny = (...perms: string[]) => perms.some(has);
  const canView = (section: SensitiveSection) =>
    (data?.sensitiveSections ?? []).includes(section);
  const canViewMore = (data?.sensitiveSections ?? []).length > 0;

  return {
    me: data ?? null,
    role: data?.adminUser?.role,
    rank: data?.rank ?? 0,
    permissions,
    manageableRoles: data?.manageableRoles ?? [],
    isLoading,
    has,
    hasAny,
    canView,
    /** True when the admin may see any expanded/sensitive section — gates the
     *  "View More Information" affordance. */
    canViewMore,
  };
}
