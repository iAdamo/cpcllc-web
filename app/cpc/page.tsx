import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | CompanyCenterLLC",
  description: "Multi-service app",
};

import ProfilePage from "@/screens/profile";

const ProfilePageWrapper = () => {
  return <ProfilePage />;
};

export default ProfilePageWrapper;
