import type { ProviderData } from "@/types";

/**
 * The signed-in person's business, or null when they have none. `activeRoleId`
 * is absent for a client in the database, a `{ permissions }` stub in the
 * sign-in response, and the populated business for a provider. Regression:
 * the profile menu read `activeRoleId._id` unguarded, so a client whose stored
 * user came from anywhere but sign-in got the error screen on every page with
 * the nav bar (found 2026-10-09).
 */
export function providerProfileOf(user: { activeRoleId?: unknown } | null | undefined): ProviderData | null {
  const role = user?.activeRoleId as Partial<ProviderData> | null | undefined;
  return role && typeof role === "object" && role._id ? (role as ProviderData) : null;
}
