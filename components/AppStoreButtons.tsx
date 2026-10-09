"use client";

import { usePublicAppConfig } from "@/hooks/usePublicAppConfig";
import { shownStoreLinks } from "@/lib/appRelease";

/** The store links staff set (Admin > Settings > App release), valid ones only. */
export function useStoreLinks() {
  return shownStoreLinks(usePublicAppConfig().data);
}

const AppleGlyph = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
    />
  </svg>
);
const PlayGlyph = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path fill="currentColor" d="M3 20.5v-17c0-.83 1-.97 1.45-.42l13 8.5c.4.26.4.58 0 .84l-13 8.5C3.97 21.47 3 21.33 3 20.5z" />
  </svg>
);

const SIZES = {
  sm: { link: "gap-1.5 px-3 py-1.5 text-[10px] rounded-lg", glyph: "w-3 h-3" },
  lg: { link: "gap-2 px-5 py-3 text-sm rounded-xl", glyph: "w-5 h-5" },
} as const;

/**
 * "App Store" and "Google Play" buttons for the stores the app is live in.
 * Nothing at all while neither link is set: a button to a listing that
 * doesn't exist is a dead link (both stores returned 404 on 2026-10-09).
 */
export function AppStoreButtons({ size = "lg", className = "" }: { size?: keyof typeof SIZES; className?: string }) {
  const { appStore, googlePlay } = useStoreLinks();
  if (!appStore && !googlePlay) return null;
  const s = SIZES[size];
  return (
    <div className={`flex flex-wrap justify-center gap-2 ${className}`}>
      {appStore ? (
        <a
          href={appStore}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center font-bold whitespace-nowrap bg-gray-900 hover:bg-gray-800 text-white ${s.link}`}
        >
          <AppleGlyph className={s.glyph} />
          App Store
        </a>
      ) : null}
      {googlePlay ? (
        <a
          href={googlePlay}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center font-bold whitespace-nowrap bg-green-600 hover:bg-green-700 text-white ${s.link}`}
        >
          <PlayGlyph className={s.glyph} />
          Google Play
        </a>
      ) : null}
    </div>
  );
}
