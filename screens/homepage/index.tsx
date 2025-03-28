"use client";

import { SafeAreaView } from "@/components/ui/safe-area-view";
import HomeHeader from "@/screens/homepage/HomeHeader";
import FeaturedCompanies from "@/screens/homepage/FeaturedCompanies";
import BrowseCompanies from "@/screens/homepage/BrowseCompanies";
import ForClient from "./ForClient";
import ForCompany from "./ForCompany";
import WhyChooseUs from "./WhyChooseUs";
import Categories from "./Categories";
import AiChat from "@/components/AiChatFab";

const HomePage = () => {
  return (
    <SafeAreaView>
      <HomeHeader />
      <Categories />
      <FeaturedCompanies />
      <BrowseCompanies />
      <ForClient />
      <WhyChooseUs />
      <ForCompany />
      <AiChat />
    </SafeAreaView>
  );
};

export default HomePage;
