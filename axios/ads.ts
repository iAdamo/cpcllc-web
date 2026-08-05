import { ApiClientSingleton } from "@/axios/conf";
import { toAdConfigUpdate, type AdMobConfig } from "@/axios/adConfig";

export type { PlatformUnits, AdMobConfig } from "@/axios/adConfig";
export { toAdConfigUpdate } from "@/axios/adConfig";

const { axiosInstance } = ApiClientSingleton.getInstance();

/** Admin: full AdMob config. */
export const getAdConfig = async (): Promise<AdMobConfig> =>
  (await axiosInstance.get("admin/ads/config")).data;

export const updateAdConfig = async (
  input: AdMobConfig,
): Promise<AdMobConfig> =>
  (await axiosInstance.patch("admin/ads/config", toAdConfigUpdate(input))).data;
