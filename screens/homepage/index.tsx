"use client";

import { useEffect } from "react";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import NavBar from "@/components/layout/NavBar";
import PreFooter from "@/components/layout/PreFooter";
import Footer from "@/components/layout/Footer";
import HomeHeader from "@/screens/homepage/HomeHeader";
import FeaturedCompanies from "@/screens/homepage/FeaturedCompanies";
import BrowseCompanies from "@/screens/homepage/BrowseCompanies";
import ForClient from "./ForClient";
import ForCompany from "./ForCompany";
import WhyChooseUs from "./WhyChooseUs";
import Categories from "./Categories";
import AiChat from "@/components/Overlays/AiChatFab";
import { useSession } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const { loading, session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/service");
    }
  }, [session, router]);

  if (loading && !session) {
    return <div>Loading...</div>; // You can replace this with a proper loading indicator
  }

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
      <AiChat />
      <PreFooter />
      <Footer />
    </SafeAreaView>
  );
};

export default HomePage;