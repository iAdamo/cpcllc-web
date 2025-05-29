"use client";

import { SafeAreaView } from "@/components/ui/safe-area-view";
import AiChat from "@/components/AiChatFab";
import ServicesSection from "./ServicesSection";

const Service = () => {
  return (
    <SafeAreaView>
      <ServicesSection />
      <AiChat />
    </SafeAreaView>
  );
};

export default Service;
