"use client";

import { Box } from "@/components/ui/box";
import AdminDashboardLayout from "@/components/layout/admin";
import { useDashboardStore } from "@/stores/dashboard-store";
import DashboardView from "@/screens/admin/dashboard/DashboardView";

const AdminDashboard = () => {
  const { activeView } = useDashboardStore();

  return (
    <Box className="w-full h-full">
      <AdminDashboardLayout>
        <div>
          {activeView === "dashboard" && <DashboardView />}
          {activeView === "users" && <UsersView />}
          {activeView === "settings" && <SettingsView />}
          {activeView === "analytics" && <AnalyticsView />}
        </div>
      </AdminDashboardLayout>
    </Box>
  );
};

export default AdminDashboard;


function UsersView() {
  return <div>Users management...</div>;
}

function SettingsView() {
  return <div>Settings panel...</div>;
}

function AnalyticsView() {
  return <div>Analytics data...</div>;
}
