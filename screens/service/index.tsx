"use client"

import { SafeAreaView } from "@/components/ui/safe-area-view";
import NavBar from "@/components/layout/NavBar";
import PreFooter from "@/components/layout/PreFooter";
import Footer from "@/components/layout/Footer";
import SectionOne from "./SectionOne";
import AiChat from "@/components/Overlays/AiChatFab";
import ServicesSection from "./ServivesSection";
import { useSession } from "@/context/AuthContext";

const Service = () => {
    const { userData } = useSession();

    console.log(userData);

  return (
    <SafeAreaView>
      <NavBar />
      <SectionOne />
      <ServicesSection />
      <AiChat />
      <PreFooter />
      <Footer />
    </SafeAreaView>
  );
};

export default Service;
