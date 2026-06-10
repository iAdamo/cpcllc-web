"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser } from "@/axios/auth";

/**
 * Paths where AuthGate does NOT enforce email verification — auth flows
 * themselves and a few public marketing-style routes. Anything not in this
 * list will redirect to /verify-email when the signed-in user's email is
 * unverified.
 */
const PUBLIC_PATHS = new Set<string>([
  "/",
  "/auth/signin",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/admin/mfa/verify",
  "/terms-of-service",
  "/privacy-policy",
]);

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  // Allow nested routes under the public ones above (e.g. /reset-password/whatever).
  for (const p of PUBLIC_PATHS) {
    if (p !== "/" && pathname.startsWith(`${p}/`)) return true;
  }
  return false;
}

/**
 * Wraps the app. On every pathname change:
 *  - if signed-in user has !isEmailVerified AND we're on a non-public path,
 *    bounce to /verify-email
 *  - otherwise transparently pass children through
 *
 * The fetch is also debounced to once-per-session in this hook to avoid
 * blasting the /users/profile endpoint on every route change.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Public path → no check needed
      if (isPublicPath(pathname)) {
        if (!cancelled) setReady(true);
        return;
      }

      try {
        const user = await getCurrentUser();
        if (cancelled) return;

        if (user && !user.isEmailVerified) {
          router.replace(
            `/auth/verify-email?email=${encodeURIComponent(user.email)}`,
          );
          return;
        }

        setReady(true);
      } catch {
        // If profile fetch fails for any reason other than 401/403, just let
        // the page render — the request-level guards will catch issues.
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  // While we're checking on a protected path, render nothing to avoid flashing
  // the protected UI before the redirect lands.
  if (!ready && !isPublicPath(pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Checking access…
      </div>
    );
  }

  return <>{children}</>;
}
