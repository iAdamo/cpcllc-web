import { Metadata } from "next";
import AccountDeletionPage from "@/screens/settings/account-control/deletion";

export const metadata: Metadata = {
  title: "Account Control",
  description: "Deactivate or permanently delete your account",
};

export default function Page() {
  return <AccountDeletionPage />;
}
