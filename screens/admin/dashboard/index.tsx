import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import AdminDashboardBars from "@/components/layout/admin";

const AdminDashboard = () => {
  return (
    <Box className="bg-[#F6F6F6] w-full h-full">
        <AdminDashboardBars />
      <VStack></VStack>
    </Box>
  );
};

export default AdminDashboard;
