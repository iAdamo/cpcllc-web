import { ApiClientSingleton } from "@/axios/conf";

const { axiosInstance } = ApiClientSingleton.getInstance();

export type AdMode = "off" | "demo" | "live";

export interface Ad {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  backgroundColor?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  placement: string;
  mode: "demo" | "live";
  isActive: boolean;
  order: number;
}

export interface AdInput {
  title: string;
  description?: string;
  image?: string;
  backgroundColor?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  placement?: string;
  mode?: "demo" | "live";
  isActive?: boolean;
  order?: number;
}

const base = "admin/ads";

export const listAds = async (): Promise<Ad[]> =>
  (await axiosInstance.get(base)).data ?? [];

export const getAdsMode = async (): Promise<{ mode: AdMode }> =>
  (await axiosInstance.get(`${base}/settings`)).data;

export const setAdsMode = async (mode: AdMode) =>
  (await axiosInstance.patch(`${base}/settings`, { mode })).data;

export const createAd = async (input: AdInput) =>
  (await axiosInstance.post(base, input)).data;

export const updateAd = async (id: string, input: Partial<AdInput>) =>
  (await axiosInstance.patch(`${base}/${id}`, input)).data;

export const toggleAd = async (id: string) =>
  (await axiosInstance.patch(`${base}/${id}/toggle`)).data;

export const deleteAd = async (id: string) =>
  (await axiosInstance.delete(`${base}/${id}`)).data;

/** Public: active ads for a placement in the current global mode. */
export const getActiveAds = async (placement?: string): Promise<Ad[]> =>
  (
    await axiosInstance.get("ads", {
      params: placement ? { placement } : {},
    })
  ).data ?? [];
