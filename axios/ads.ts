import { ApiClientSingleton } from "@/axios/conf";

const { axiosInstance } = ApiClientSingleton.getInstance();

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

/** Admin: full AdMob config. */
export const getAdConfig = async (): Promise<AdMobConfig> =>
  (await axiosInstance.get("admin/ads/config")).data;

export const updateAdConfig = async (
  input: Partial<AdMobConfig>,
): Promise<AdMobConfig> =>
  (await axiosInstance.patch("admin/ads/config", input)).data;
