export interface PlatformUnits {
  banner?: string;
  interstitial?: string;
  rewarded?: string;
}

export interface AdMobConfig {
  enabled: boolean;
  testMode: boolean;
  android: PlatformUnits;
  ios: PlatformUnits;
}

/**
 * Shape the write payload the PATCH endpoint accepts. The GET response is a
 * full Mongoose document (carries `_id`, `__v`, `createdAt`, `updatedAt`, and
 * an `_id` on each nested `android`/`ios` subdoc). The backend DTO runs under a
 * `forbidNonWhitelisted` ValidationPipe, so echoing the read model straight
 * back 400s ("property _id should not exist"). Pick only the editable fields,
 * down to the three unit ids per platform.
 *
 * Kept in this side-effect-free module (no axios singleton import) so it stays
 * unit-testable without the `@/` alias or a browser environment.
 */
export function toAdConfigUpdate(input: AdMobConfig): AdMobConfig {
  const units = (u?: PlatformUnits): PlatformUnits => ({
    banner: u?.banner ?? "",
    interstitial: u?.interstitial ?? "",
    rewarded: u?.rewarded ?? "",
  });
  return {
    enabled: input.enabled,
    testMode: input.testMode,
    android: units(input.android),
    ios: units(input.ios),
  };
}
