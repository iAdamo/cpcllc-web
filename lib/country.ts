/**
 * Resolving which country a marketplace search should be scoped to. The backend
 * filters providers/tasks hard by `location.primary.address.country`, so sending
 * the wrong country returns the wrong country's results (or nothing).
 *
 * Priority: the signed-in user's own account country → the device's
 * reverse-geocoded country → a last-resort default. We never blind-default to
 * "United States" before checking the user, which was the bug that made a
 * Nigerian user see US providers.
 */

const LAST_RESORT_COUNTRY = "United States";

/**
 * The signed-in user's account country (from their primary address), if set.
 * Typed `any` because the app has a few overlapping user shapes; we only ever
 * read this one path.
 */
export function getUserCountry(user: any): string | undefined {
  return user?.location?.primary?.address?.country || undefined;
}

/**
 * Best available country for a search, given the user and a resolved device
 * location. Returns undefined only when nothing is known yet; callers that must
 * send a value fall back to `resolveSearchCountry(...) ?? LAST_RESORT_COUNTRY`.
 */
export function resolveSearchCountry(
  user: any,
  geocodedCountry?: string | null,
): string | undefined {
  return getUserCountry(user) || geocodedCountry || undefined;
}

export { LAST_RESORT_COUNTRY };
