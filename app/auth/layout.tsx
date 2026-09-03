"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useGlobalStore from "@/stores";

/**
 * Auth routes are for logged-OUT visitors. If the session store already says
 * the user is authenticated, keep them out of sign-in / forgot / reset and
 * send them on (honouring a ?next=… target, else home).
 *
 * Exception: /auth/verify-email is part of the authenticated-but-unverified
 * flow, so an authenticated user is allowed to stay there.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const isAuthenticated = useGlobalStore((s) => s.isAuthenticated);
  const allowWhenAuthed = pathname.startsWith("/auth/verify-email");
  const shouldRedirect = isAuthenticated && !allowWhenAuthed;

  useEffect(() => {
    if (!shouldRedirect) return;
    const next = new URLSearchParams(window.location.search).get("next");
    router.replace(next && next.startsWith("/") ? next : "/");
  }, [shouldRedirect, router]);

  // Don't flash the auth form while the redirect is in flight.
  if (shouldRedirect) return null;
  return <>{children}</>;
}
