"use client";

import HomeHeader from "@/screens/homepage/HomeHeader";
import BrowseCompanies from "@/screens/homepage/BrowseCompanies";
import ForClient from "./ForClient";
import ForCompany from "./ForCompany";
import WhyChooseUs from "./WhyChooseUs";
import Categories from "./Categories";

const HomePage = () => {
  return (
    <main className="md:space-y-20 space-y-10">
      <HomeHeader />
      <Categories />
      <BrowseCompanies />
      <ForClient />
      <WhyChooseUs />
      <ForCompany />
    </main>
  );
};

export default HomePage;
