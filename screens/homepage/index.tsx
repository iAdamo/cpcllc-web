"use client";

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
    <header>
      <HomeHeader />
      <Categories />
      <FeaturedCompanies />
      <BrowseCompanies />
      <ForClient />
      <WhyChooseUs />
      <ForCompany />
      <AiChat />
    </header>
  );
};

export default HomePage;
