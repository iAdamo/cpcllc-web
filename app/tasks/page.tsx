import { Metadata } from "next";
import JobsPage from "@/screens/clients/jobs";

export const metadata: Metadata = {
  title: "Tasks — CompaniesCenterLLC",
  description:
    "Tasks — clients manage posts, providers browse open work to bid on.",
};

export default function Page() {
  return <JobsPage />;
}
