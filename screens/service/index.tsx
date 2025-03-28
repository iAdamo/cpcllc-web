import { SafeAreaView } from "@/components/ui/safe-area-view";
import SectionOne from "./SectionOne";
import AiChat from "@/components/AiChatFab";
import ServicesSection from "./ServicesSection";

const Service = () => {
  return (
    <SafeAreaView>
      <SectionOne />
      <ServicesSection />
      <AiChat />
    </SafeAreaView>
  );
};

export default Service;
