/**
 * Broadcast popups in the composer: pure rules, no React, so they run as
 * plain unit tests. The API applies the same rules on submit
 * (cpcllc-backend src/modules/broadcast/popup.ts); the app draws the popup
 * with the same sizes (companiescenterllc src/services/broadcast/popup.ts).
 */
import type { Broadcast, BroadcastPlacement } from "@/axios/broadcast";

export type PopupSize = "SM" | "MD" | "LG";

/** Export size per popup size, and how much of the phone's width the popup
 *  takes (the app caps LG by the screen height too). */
export const POPUP_SIZES: Record<
  PopupSize,
  { width: number; height: number; label: string; shape: string; screenWidth: number }
> = {
  SM: { width: 1080, height: 1080, label: "Small", shape: "Square", screenWidth: 0.72 },
  MD: { width: 1080, height: 1350, label: "Medium", shape: "Portrait 4:5", screenWidth: 0.84 },
  LG: { width: 1080, height: 1920, label: "Large", shape: "Full screen 9:16", screenWidth: 0.92 },
};
export const POPUP_SIZE_KEYS = Object.keys(POPUP_SIZES) as PopupSize[];

export const PLACEMENTS: { value: BroadcastPlacement; label: string; hint: string }[] = [
  {
    value: "NOTIFICATION_CENTER",
    label: "Notification center",
    hint: "An entry under the bell and in Updates.",
  },
  {
    value: "HOME_BANNER",
    label: "Home banner",
    hint: "A banner or carousel on the home screen.",
  },
  {
    value: "POPUP_ONLY",
    label: "Popup only",
    hint: "Only the popup. Push and email still go out if you pick them; a push also lists under the bell.",
  },
];

/** The JPG/PNG/WebP/GIF the API accepts, up to 5 MB. */
export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;

type Draft = Partial<Broadcast>;

/** The image the popup shows: its own, else the cover image. */
export function popupImageOf(b: Draft): string {
  return b.popupImage || b.coverImage || "";
}

/** An older home banner saved as an "Overlay modal". It shows as a popup. */
export function isLegacyOverlay(b: Draft): boolean {
  return !b.popup && b.placement === "HOME_BANNER" && b.displayMode === "OVERLAY";
}

/**
 * A draft saved as an "Overlay modal" banner, before popups existed, opens
 * as a popup-only draft: same size, its first slide's image and link.
 */
export function upgradeLegacyOverlay(b: Draft): Draft {
  if (!isLegacyOverlay(b)) return b;
  const s = b.slides?.[0];
  return {
    ...b,
    placement: "POPUP_ONLY",
    displayMode: "INLINE",
    popup: true,
    popupSize: b.bannerSize ?? "LG",
    popupImage: s?.image || b.coverImage || "",
    ctaUrl: b.ctaUrl || s?.ctaUrl || "",
  };
}

/** Choosing "Popup only" turns the popup on. */
export function withPlacement(b: Draft, placement: BroadcastPlacement): Draft {
  return placement === "POPUP_ONLY"
    ? { ...b, placement, popup: true, popupSize: b.popupSize ?? "MD" }
    : { ...b, placement };
}

/** Turning the popup off on a popup-only draft moves it to the
 *  notification center, so it still shows somewhere. */
export function withPopup(b: Draft, on: boolean): Draft {
  if (on) return { ...b, popup: true, popupSize: b.popupSize ?? "MD" };
  return {
    ...b,
    popup: false,
    ...(b.placement === "POPUP_ONLY" ? { placement: "NOTIFICATION_CENTER" as const } : {}),
  };
}

/** Where a broadcast shows and how it goes out, in words. */
export function surfacesOf(b: Draft): string[] {
  const out: string[] = [];
  if (b.popup || isLegacyOverlay(b)) {
    const size = (b.popup ? b.popupSize : b.bannerSize) ?? (b.popup ? "MD" : "LG");
    out.push(`Popup · ${POPUP_SIZES[size as PopupSize]?.label ?? size}`);
  }
  if (b.placement === "HOME_BANNER" && !isLegacyOverlay(b)) out.push("Home banner");
  if (!b.placement || b.placement === "NOTIFICATION_CENTER") out.push("Notification center");
  if (b.channels?.includes("PUSH")) out.push("Push");
  if (b.channels?.includes("EMAIL")) out.push("Email");
  return out;
}

/** What the popup still needs before it can be submitted, or null. */
export function popupHint(b: Draft): string | null {
  if (!b.popup) return null;
  if (!popupImageOf(b)) return "Add an image. The popup is the image.";
  return null;
}

/** Why a picked file can't be uploaded, or null. Checked before sending so
 *  a 30 MB photo fails at once, not after the upload. */
export function imageFileProblem(file: { type: string; size: number }): string | null {
  if (!IMAGE_ACCEPT.split(",").includes(file.type)) return "Use a JPG, PNG, WebP or GIF image";
  if (file.size > IMAGE_MAX_BYTES) return "Images can be up to 5 MB";
  return null;
}
