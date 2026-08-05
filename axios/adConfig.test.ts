import { describe, it, expect } from "vitest";
import { toAdConfigUpdate, type AdMobConfig } from "./adConfig";

describe("toAdConfigUpdate", () => {
  it("strips Mongoose metadata the GET response carries", () => {
    // What the backend actually returns from GET /admin/ads/config
    const readModel = {
      _id: "665f0c1e2a1b3c4d5e6f7a8b",
      __v: 0,
      createdAt: "2026-08-01T00:00:00.000Z",
      updatedAt: "2026-08-05T00:00:00.000Z",
      enabled: true,
      testMode: false,
      android: {
        _id: "665f0c1e2a1b3c4d5e6f7a8c",
        banner: "ca-app-pub-4956457069396071/1111111111",
        interstitial: "",
        rewarded: "",
      },
      ios: {
        _id: "665f0c1e2a1b3c4d5e6f7a8d",
        banner: "ca-app-pub-4956457069396071/2222222222",
        interstitial: "",
        rewarded: "",
      },
    } as unknown as AdMobConfig;

    const payload = toAdConfigUpdate(readModel);

    // Exactly the four editable keys, nothing the whitelist pipe rejects.
    expect(Object.keys(payload).sort()).toEqual([
      "android",
      "enabled",
      "ios",
      "testMode",
    ]);
    expect(payload).not.toHaveProperty("_id");
    expect(payload).not.toHaveProperty("__v");
    expect(payload).not.toHaveProperty("createdAt");
    expect(payload).not.toHaveProperty("updatedAt");
    expect(payload.android).not.toHaveProperty("_id");
    expect(payload.ios).not.toHaveProperty("_id");

    // Editable values survive.
    expect(payload.enabled).toBe(true);
    expect(payload.testMode).toBe(false);
    expect(payload.android.banner).toBe(
      "ca-app-pub-4956457069396071/1111111111",
    );
    expect(Object.keys(payload.android).sort()).toEqual([
      "banner",
      "interstitial",
      "rewarded",
    ]);
  });

  it("fills missing unit fields with empty strings", () => {
    const payload = toAdConfigUpdate({
      enabled: false,
      testMode: true,
      android: {},
      ios: {},
    });
    expect(payload.android).toEqual({
      banner: "",
      interstitial: "",
      rewarded: "",
    });
    expect(payload.ios).toEqual({ banner: "", interstitial: "", rewarded: "" });
  });
});
