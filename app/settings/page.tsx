import { Metadata } from "next";
import SettingsPage from "@/screens/settings";

export const metadata: Metadata = {
  title: "Settings — CompaniesCenter",
  description: "Manage your account preferences and profile information",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <SettingsPage />;
}
