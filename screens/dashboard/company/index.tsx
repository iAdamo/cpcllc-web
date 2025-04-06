"use client";

import { SafeAreaView } from "@/components/ui/safe-area-view";
import SideBar from "./SideBar";
import MiddleView from "./MiddleView";
import { HStack } from "@/components/ui/hstack";

const CompanyDashboard = () => {
  return (
    <SafeAreaView className="mt-20">
      <HStack className="bg-[#F6F6F6] justify-between">
        <SideBar />
        <MiddleView />
      </HStack>
    </SafeAreaView>
  );
};

export default CompanyDashboard;
