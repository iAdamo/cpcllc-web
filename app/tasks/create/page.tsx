import { Metadata } from "next";
import CreateTaskPage from "@/screens/clients/jobs/create";

export const metadata: Metadata = {
  title: "Post a Task — CompaniesCenterLLC",
  description: "Describe what you need done and get proposals from verified professionals",
};

export default function Page() {
  return <CreateTaskPage />;
}
