import type { Metadata } from "next";
import { userProfile } from "@/axios/users";

import ProfilePage from "@/screens/profile";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const user = await userProfile(params.id);

  const title =
    user?.activeRole === "Company"
      ? `${user?.activeRoleId?.companyName} | CompaniesCenterLLC`
      : `${user?.firstName} ${user?.lastName} | CompaniesCenterLLC`;

  const description =
    user?.activeRole === "Company"
      ? `${user?.activeRoleId?.companyDescription?.slice(0, 60)}${
          (user?.activeRoleId?.companyDescription?.length ?? 0) > 60
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
