"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useGlobalStore from "@/stores";
import { safeNextPath } from "@/lib/safeNext";

/**
 * Auth routes are for logged-OUT visitors. If the session store already says
 * the user is authenticated, keep them out of sign-in / forgot / reset and
 * send them on (honouring a ?next=… target, else home).
 *
 * Exceptions: /auth/verify-email and /auth/terms are steps of being signed
 * in (verify the email, accept the current policies), so an authenticated
 * user stays there.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const isAuthenticated = useGlobalStore((s) => s.isAuthenticated);
  const allowWhenAuthed =
    pathname.startsWith("/auth/verify-email") ||
    pathname.startsWith("/auth/terms");
  const shouldRedirect = isAuthenticated && !allowWhenAuthed;

  useEffect(() => {
    if (!shouldRedirect) return;
    const next = new URLSearchParams(window.location.search).get("next");
    // "//host" also starts with "/": only paths on this site.
    router.replace(safeNextPath(next));
  }, [shouldRedirect, router]);

  // Don't flash the auth form while the redirect is in flight.
  if (shouldRedirect) return null;
  return <>{children}</>;
}
