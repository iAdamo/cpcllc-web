import { ApiClientSingleton } from "@/axios/conf";
import type { SocialLinks } from "@/lib/socialLinks";

const { axiosInstance } = ApiClientSingleton.getInstance();

/** The parts of GET app/config the website uses. */
export interface PublicAppConfig {
  socialLinks?: SocialLinks;
}

/** Public: the footer reads the social links from here. */
export async function getPublicAppConfig(): Promise<PublicAppConfig> {
  const { data } = await axiosInstance.get("app/config");
  return data;
}

/** Admin: the same config, editable (app_config permissions). */
export async function getAdminAppConfig(): Promise<PublicAppConfig> {
  const { data } = await axiosInstance.get("admin/app-config");
  return data;
}

export async function updateSocialLinks(socialLinks: SocialLinks): Promise<PublicAppConfig> {
  const { data } = await axiosInstance.patch("admin/app-config", { socialLinks });
  return data;
}
