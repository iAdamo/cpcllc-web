import type { Metadata } from "next";
import { getUserProfile } from "@/axios/user";
import { MediaItem, UserData } from "@/types";

import ProfilePage from "@/screens/profile";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  let user: UserData | null = null;
  try {
    user = await getUserProfile(params.id);
  } catch {
    return { title: "Provider Profile" };
  }
  const provider = user?.activeRole === "Provider" ? user.activeRoleId : null;

  const title = provider?.providerName;

  const description =
    user?.activeRole === "Provider"
      ? `${provider?.providerDescription?.slice(0, 100)}${
          (provider?.providerDescription?.length ?? 0) > 100 ? "..." : ""
        }`
      : "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        ...(provider?.providerLogo
          ? [(provider.providerLogo as MediaItem).thumbnail]
          : []),
        ...((provider?.providerImages ?? []) as MediaItem[])
          .slice()
          .map((img) => img.thumbnail)
          .filter((v): v is string => Boolean(v)),
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: provider?.providerLogo
        ? [(provider.providerLogo as MediaItem).thumbnail]
        : [],
    },
  };
}

export default ProfilePage;
