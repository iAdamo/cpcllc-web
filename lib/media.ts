/**
 * Pure media helpers — no React / Next imports, so they run as free unit tests.
 *
 * Backend stores each gallery item as `{ type: 'image'|'video', url, thumbnail }`.
 * A player/opener needs the real `url`; a grid poster wants the `thumbnail`.
 * Conflating them is why gallery videos "only load a thumbnail and never play".
 */

export interface MediaLike {
  type?: string;
  url?: string;
  thumbnail?: string;
}

const VIDEO_EXT = /\.(mp4|mov|m4v|webm|avi|mkv|3gp)(\?|#|$)/i;

/** The real, playable source — NOT the thumbnail. */
export function mediaSource(src: unknown, fallback = ""): string {
  if (!src) return fallback;
  if (typeof src === "string") return src || fallback;
  const s = src as MediaLike;
  return s.url || s.thumbnail || fallback;
}

/** True if a media item is a video, by explicit type or file extension. */
export function isVideoItem(src: unknown): boolean {
  if (!src) return false;
  if (typeof src === "string") return VIDEO_EXT.test(src);
  const s = src as MediaLike;
  if (typeof s.type === "string" && s.type.toLowerCase().includes("video")) {
    return true;
  }
  return VIDEO_EXT.test(s.url || "");
}
