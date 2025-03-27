import { SafeAreaView } from "@/components/ui/safe-area-view";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import MiddleView from "./MiddleView";
import PreFooter from "@/components/layout/PreFooter";
import Footer from "@/components/layout/Footer";
import { HStack } from "@/components/ui/hstack";

const CompanyDashboard = () => {
  return (
    <SafeAreaView className="">
      <NavBar />
      <HStack className="bg-[#F6F6F6] justify-between">
        <SideBar />
        <MiddleView />
      </HStack>
      <PreFooter />
      <Footer />
    </SafeAreaView>
  );
};

export default CompanyDashboard;
