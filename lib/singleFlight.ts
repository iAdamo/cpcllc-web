/**
 * Wrap an async factory so that while one call is in flight, concurrent callers
 * share the SAME promise instead of each starting their own. Used to collapse a
 * burst of 401s into a single token refresh (no refresh stampede).
 *
 * Once the in-flight promise settles, the next call starts fresh.
 */
export function createSingleFlight<T>(fn: () => Promise<T>): () => Promise<T> {
  let inflight: Promise<T> | null = null;
  return () => {
    if (!inflight) {
      inflight = fn().finally(() => {
        inflight = null;
      }) as Promise<T>;
    }
    return inflight;
  };
}
