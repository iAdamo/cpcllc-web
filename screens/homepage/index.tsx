import { SafeAreaView } from "@/components/ui/safe-area-view";
import NavBar from "@/screens/layout/NavBar";
import HomeHeader from "@/screens/homepage/HomeHeader";
import Categories from "@/screens/homepage/Categories";
import BrowseCompanies from "@/screens/homepage/BrowseCompanies";
import PreFooter from "@/screens/layout/PreFooter";
import Footer from "@/screens/layout/Footer";
import ForClient from "./ForClient";
import ForCompany from "./ForCompany";
import WhyChooseUs from "./WhyChooseUs";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nextlevity",
  description: "Multi-service marketing app",
};

const HomePage = () => {
  return (
    <SafeAreaView>
      <NavBar />
      <HomeHeader />
      <Categories />
      <BrowseCompanies />
      <ForClient />
      <WhyChooseUs />
      <ForCompany />
      <PreFooter />
      <Footer />
    </SafeAreaView>
  );
};

export default HomePage;
