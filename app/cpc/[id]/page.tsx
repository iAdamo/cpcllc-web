import type { Metadata } from "next";
import { userProfile } from "@/axios/users";

import ProfilePage from "@/screens/profile";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const user = await userProfile(params.id);

  const title = `${user?.firstName} ${user?.lastName} | ${user?.activeRoleId?.providerName}`;

  const description =
    user?.activeRole === "Provider"
      ? `${user?.activeRoleId?.providerDescription?.slice(0, 100)}${
          (user?.activeRoleId?.providerDescription?.length ?? 0) > 100
            ? "..."
            : ""
        }`
      : "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: user?.profilePicture ? [user.profilePicture] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: user?.profilePicture ? [user.profilePicture] : [],
    },
  };
}

export default ProfilePage;
