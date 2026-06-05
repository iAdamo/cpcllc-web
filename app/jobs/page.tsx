import { Metadata } from "next";
import JobsPage from "@/screens/clients/jobs";

export const metadata: Metadata = {
  title: "Task Hub — CompaniesCenterLLC",
  description: "Browse and bid on client-posted tasks",
};

export default function Page() {
  return <JobsPage />;
}
