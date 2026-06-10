"use client";

import useGlobalStore from "@/stores";
import JobsPage from "@/screens/clients/jobs";
import ClientTasksPage from "@/screens/clients/tasks";

/**
 * Role-aware /tasks router.
 *
 *  - Providers see the "browse open tasks to bid on" view (formerly /jobs).
 *  - Clients see the "manage my posted tasks" view.
 *  - Anyone else (Admin, guests) sees the client view by default — admins
 *    have their own dashboard at /admin, and SessionContext bounces them
 *    there before this ever renders.
 */
export default function TasksRouter() {
  const { user } = useGlobalStore();
  if (user?.activeRole === "Provider") {
    return <JobsPage />;
  }
  return <ClientTasksPage />;
}
