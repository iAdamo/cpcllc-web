"use client";

import AiChat from "@/components/AiChatFab";
import CompaniesSection from "./CompaniesSection";

const Companies = () => {
  return (
    <main className="flex-1 bg-[#F6F6F6] dark:bg-gray-900">
      <CompaniesSection />
      <AiChat />
    </main>
  );
};

export default Companies;
