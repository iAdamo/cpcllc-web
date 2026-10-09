import { ApiClientSingleton } from "@/axios/conf";
import type { SocialLinks } from "@/lib/socialLinks";
import { appStoreId, type AppRelease } from "@/lib/appRelease";

const { axiosInstance } = ApiClientSingleton.getInstance();

/** The parts of GET app/config the website uses. */
export interface PublicAppConfig extends AppRelease {
  socialLinks?: SocialLinks;
}

/** Public: the footer reads the social links from here. */
export async function getPublicAppConfig(): Promise<PublicAppConfig> {
  const { data } = await axiosInstance.get("app/config");
  return data;
}

/**
 * Safari's "open in the App Store app" banner for a share page, only once the
 * App Store link is set. Regression: share pages sent app-id=0000000000.
 */
export async function appStoreBannerMeta(canonical: string): Promise<Record<string, string>> {
  try {
    const id = appStoreId((await getPublicAppConfig()).iosStoreUrl);
    return id ? { "apple-itunes-app": `app-id=${id}, app-argument=${canonical}` } : {};
  } catch {
    return {};
  }
}

/** Admin: the same config, editable (app_config permissions). */
export async function getAdminAppConfig(): Promise<PublicAppConfig> {
  const { data } = await axiosInstance.get("admin/app-config");
  return data;
}

/** Store links and version numbers (Admin > Settings > App release). */
export async function updateAppRelease(release: AppRelease): Promise<PublicAppConfig> {
  const { data } = await axiosInstance.patch("admin/app-config", release);
  return data;
}

export async function updateSocialLinks(socialLinks: SocialLinks): Promise<PublicAppConfig> {
  const { data } = await axiosInstance.patch("admin/app-config", { socialLinks });
  return data;
}
