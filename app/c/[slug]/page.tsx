import type { Metadata } from "next";
import { MediaItem } from "@/types";
import { getProviderBySlug } from "@/axios/public";
import { appStoreBannerMeta } from "@/axios/appConfig";
import ProfilePage from "@/screens/profile";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://companiescenter.com";

// Next.js 15 — `params` is a Promise. Await before accessing properties.
type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) return { title: "Provider not found" };

  const title = provider?.providerName;
  const description =
    `${provider?.providerDescription?.slice(0, 180)}${
      (provider?.providerDescription?.length ?? 0) > 180 ? "..." : ""
    }` || "";
  const logoUrl = (provider.providerLogo as MediaItem)?.thumbnail;
  const images = [
    ...(((provider.gallery as MediaItem[]) ?? [])
      .map((m: MediaItem) => m?.thumbnail)
      .filter(Boolean) as string[]),
    ...(logoUrl ? [logoUrl] : []),
  ];

  const canonical = `${APP_URL}/c/${slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "profile",
      url: canonical,
      title,
      description,
      images,
      siteName: "CompaniesCenter",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
    // Safari's "open in the App Store app" banner, only once the App Store
    // link is set in Admin > Settings > App release (it was app-id=0000000000).
    other: await appStoreBannerMeta(canonical),
  };
}

export default ProfilePage;
