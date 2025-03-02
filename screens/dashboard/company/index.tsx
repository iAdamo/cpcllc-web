"use client";

import { SafeAreaView } from "@/components/ui/safe-area-view";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import MiddleView from "./MiddleView";
import RightView from "./RightView";
import PreFooter from "@/components/layout/PreFooter";
import Footer from "@/components/layout/Footer";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

const CompanyDashboard = () => {
  return (
    <SafeAreaView className="overflow-hidden h-screen">
      <NavBar />
      <HStack className="justify-between mt-4">
        <SideBar />
        <MiddleView />
        <RightView />
      </HStack>
    </SafeAreaView>
  );
};

export default CompanyDashboard;
