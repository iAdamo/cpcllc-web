/**
 * Where to go after signing in or accepting the Terms: a path on this site,
 * or the fallback. "//evil.example" and "/\evil.example" start with "/" but
 * leave the site, so they are refused (an open redirect otherwise).
 */
export function safeNextPath(
  next: string | null | undefined,
  fallback = "/",
): string {
  if (typeof next !== "string" || !next.startsWith("/")) return fallback;
  if (next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
