"use client";

import SideBar from "./SideBar";
import MiddleView from "./MiddleView";
import { HStack } from "@/components/ui/hstack";

const CompanyDashboard = () => {
  return (
    <section className="mt-40 bg-red-500">
      <HStack className="bg-[#F6F6F6] justify-between">
        <SideBar />
        <MiddleView />
      </HStack>
    </section>
  );
};

export default CompanyDashboard;
