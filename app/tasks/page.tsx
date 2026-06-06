import { Metadata } from "next";
import ClientTasksPage from "@/screens/clients/tasks";

export const metadata: Metadata = {
  title: "My Tasks — CompaniesCenterLLC",
  description: "Manage your posted tasks and review proposals from providers",
};

export default function Page() {
  return <ClientTasksPage />;
}
