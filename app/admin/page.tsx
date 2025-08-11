import type { Metadata } from "next";
import AdminDashboard from "@/screens/admin/dashboard";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default AdminDashboard;
