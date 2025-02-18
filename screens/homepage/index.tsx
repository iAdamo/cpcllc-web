import { SafeAreaView } from "@/components/ui/safe-area-view";
import NavBar from "@/screens/layout/NavBar";
import HomeHeader from "@/screens/homepage/HomeHeader";
import FeaturedCompanies from "@/screens/homepage/FeaturedCompanies";
import BrowseCompanies from "@/screens/homepage/BrowseCompanies";
import PreFooter from "@/screens/layout/PreFooter";
import Footer from "@/screens/layout/Footer";
import ForClient from "./ForClient";
import ForCompany from "./ForCompany";
import WhyChooseUs from "./WhyChooseUs";
import AiChat from "@/components/Overlays/AiChatFab";
import Categories from "./Categories";

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
      <FeaturedCompanies />
      <BrowseCompanies />
      <ForClient />
      <WhyChooseUs />
      <ForCompany />
      <PreFooter />
      <Footer />
      <AiChat />
    </SafeAreaView>
  );
};

export default HomePage;
