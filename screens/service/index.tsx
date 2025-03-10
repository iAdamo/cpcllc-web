import { SafeAreaView } from "@/components/ui/safe-area-view";
import NavBar from "@/components/layout/NavBar";
import PreFooter from "@/components/layout/PreFooter";
import Footer from "@/components/layout/Footer";
import SectionOne from "./SectionOne";
import AiChat from "@/components/AiChatFab";
import ServicesSection from "./ServicesSection";

const Service = () => {
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
