import { Metadata } from "next";
import TasksRouter from "@/screens/tasks/TasksRouter";

export const metadata: Metadata = {
  title: "Tasks — CompaniesCenterLLC",
  description:
    "Tasks — clients manage posts, providers browse open work to bid on.",
};

export default function Page() {
  return <TasksRouter />;
}
