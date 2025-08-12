"use client";

import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import AdminDashboardLayout from "@/components/layout/admin";
import { useDashboardStore } from "@/stores/dashboard-store";

const AdminDashboard = () => {
  const { activeView } = useDashboardStore();

  return (
    <Box className="bg-[#F6F6F6] w-full h-full">
      <AdminDashboardLayout>
        <div>
          <h2 className="text-2xl mb-4">Welcome to your dashboard</h2>
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

function DashboardView() {
  return <div>Dashboard content...</div>;
}

function UsersView() {
  return <div>Users management...</div>;
}

function SettingsView() {
  return <div>Settings panel...</div>;
}

function AnalyticsView() {
  return <div>Analytics data...</div>;
}
