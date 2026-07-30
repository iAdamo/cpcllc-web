import { MediaItem } from "@/types";

export function resolveUrl(src: unknown, fallback = "/assets/men.jpg"): string {
  if (!src) return fallback;
  if (typeof src === "string") return src || fallback;
  const s = src as MediaItem;
  return s.thumbnail || s.url || fallback;
}

// Real-source + video detection live in a pure, framework-free module (tested
// there). Re-exported so gallery code keeps importing them from `./helpers`.
export { mediaSource, isVideoItem } from "@/lib/media";

export function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Jan 2022";
  }
}
