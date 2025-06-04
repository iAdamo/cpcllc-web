"use client";

import AiChat from "@/components/AiChatFab";
import ServicesSection from "./ServicesSection";

const Service = () => {
  return (
    <section className="flex-1 bg-[#F6F6F6] dark:bg-gray-900">
      <ServicesSection />
      <AiChat />
    </section>
  );
};

export default Service;
