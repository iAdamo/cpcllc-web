"use client";

import { useCallback } from "react";

/**
 * Triggers a deep link into the mobile app via the custom scheme.
 * Universal Links / App Links open the app automatically when the user
 * clicks the http URL from *outside* a browser tab (iMessage, WhatsApp,
 * etc.). When they're already inside Safari / Chrome — having loaded the
 * web page directly — the OS doesn't re-intercept. That's what this
 * button is for: an explicit "Open in App" click.
 *
 * Custom scheme path mirrors the web path (`/p/slug`, `/t/id`) so the
 * Expo Router consumes it identically regardless of entry vector.
 */
export function OpenInAppButton({ path }: { path: string }) {
  const handleClick = useCallback(() => {
    if (typeof window === "undefined") return;
    // Custom scheme from mobile app.json
    window.location.href = `companiescenterllc://${path.replace(/^\//, "")}`;
  }, [path]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition"
    >
      Open in CompaniesCenter app
    </button>
  );
}
