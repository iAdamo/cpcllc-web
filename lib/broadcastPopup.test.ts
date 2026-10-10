import { describe, expect, it } from "vitest";
import {
  POPUP_SIZES,
  imageFileProblem,
  isLegacyOverlay,
  popupHint,
  surfacesOf,
  upgradeLegacyOverlay,
  withPlacement,
  withPopup,
} from "./broadcastPopup";

/** The composer's popup rules. The API enforces the same on submit
 *  (cpcllc-backend src/modules/broadcast/popup.ts). */
describe("broadcast popups in the composer", () => {
  it("sizes match the API and the app: square, 4:5, 9:16", () => {
    expect(Object.values(POPUP_SIZES).map((s) => [s.width, s.height])).toEqual([
      [1080, 1080],
      [1080, 1350],
      [1080, 1920],
    ]);
  });

  it("an old 'Overlay modal' draft opens as a popup-only draft with its image and link", () => {
    const old = {
      placement: "HOME_BANNER" as const,
      displayMode: "OVERLAY" as const,
      bannerSize: "SM" as const,
      slides: [{ image: "https://cdn/x.jpg", ctaUrl: "/jobs" }],
    };
    expect(isLegacyOverlay(old)).toBe(true);
    expect(upgradeLegacyOverlay(old)).toMatchObject({
      placement: "POPUP_ONLY",
      displayMode: "INLINE",
      popup: true,
      popupSize: "SM",
      popupImage: "https://cdn/x.jpg",
      ctaUrl: "/jobs",
    });
    const inline = { placement: "HOME_BANNER" as const, displayMode: "INLINE" as const };
    expect(upgradeLegacyOverlay(inline)).toBe(inline);
  });

  it("'Popup only' turns the popup on; turning it off moves the draft to the notification center", () => {
    const d = withPlacement({ placement: "NOTIFICATION_CENTER" }, "POPUP_ONLY");
    expect([d.placement, d.popup, d.popupSize]).toEqual(["POPUP_ONLY", true, "MD"]);
    expect(withPopup(d, false)).toMatchObject({ popup: false, placement: "NOTIFICATION_CENTER" });
    const banner = withPopup({ placement: "HOME_BANNER" }, false);
    expect(banner.placement).toBe("HOME_BANNER");
    expect(withPopup({ popupSize: "LG" }, true).popupSize).toBe("LG");
  });

  it("says where it shows and how it goes out", () => {
    expect(surfacesOf({ placement: "HOME_BANNER", popup: true, popupSize: "LG", channels: ["PUSH", "EMAIL"] })).toEqual([
      "Popup · Large",
      "Home banner",
      "Push",
      "Email",
    ]);
    expect(surfacesOf({ placement: "POPUP_ONLY", popup: true })).toEqual(["Popup · Medium"]);
    expect(surfacesOf({ channels: ["PUSH"] })).toEqual(["Notification center", "Push"]);
    expect(surfacesOf({ placement: "HOME_BANNER", displayMode: "OVERLAY", bannerSize: "SM" })).toEqual([
      "Popup · Small",
    ]);
  });

  it("a popup needs an image; the cover image counts", () => {
    expect(popupHint({ popup: true })).toBe("Add an image. The popup is the image.");
    expect(popupHint({ popup: true, coverImage: "https://c/a.png" })).toBeNull();
    expect(popupHint({ popup: false })).toBeNull();
  });

  it("checks a picked file before uploading it", () => {
    expect(imageFileProblem({ type: "image/png", size: 1000 })).toBeNull();
    expect(imageFileProblem({ type: "application/pdf", size: 1000 })).toBe("Use a JPG, PNG, WebP or GIF image");
    expect(imageFileProblem({ type: "image/jpeg", size: 5 * 1024 * 1024 + 1 })).toBe("Images can be up to 5 MB");
  });
});
