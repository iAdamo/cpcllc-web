"use client";

import { useEffect, useRef } from "react";
import HomeHeader from "@/screens/homepage/HomeHeader";
import BrowseCompanies from "@/screens/homepage/BrowseCompanies";
import ForClient from "./ForClient";
import ForCompany from "./ForCompany";
import WhyChooseUs from "./WhyChooseUs";
import Categories from "./Categories";
import useGlobalStore from "@/stores";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const { user, isAuthenticated, setParamsFrom } = useGlobalStore();
  const lastRedirectRef = useRef<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(
        { isAuthenticated },
        { isOnboardingComplete: user?.isOnboardingComplete }
      );

      let target:
        | "/"
        | "/onboarding"
        | "/providers"
        | "/clients"
        | null = null;

      if (!isAuthenticated) {
        target = user?.isOnboardingComplete ? "/onboarding" : "/";
      } else if (!user?.isOnboardingComplete) {
        if (user?.isEmailVerified === false) {
          //  useGlobalStore.setState({ currentStep: 3 });
          target = "/onboarding";
        } else if (
          user?.termsAcceptances &&
          user?.termsAcceptances.length < 1
        ) {
          //  useGlobalStore.setState({ currentStep: 4 });
          target = "/onboarding";
          // target = user?.activeRole === "Client" ? "/providers" : "/clients";
        } else {
          //  useGlobalStore.setState({ currentStep: 5 });
          target = "/onboarding";
        }
      } else if (isAuthenticated && user?.isOnboardingComplete) {
        target = user?.activeRole === "Client" ? "/providers" : "/clients";
      }

      if (target && lastRedirectRef.current !== target) {
        lastRedirectRef.current = target;
        setParamsFrom(target);
        router.replace(target);
      }
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [isAuthenticated, user, router, setParamsFrom]);
  if (!user?._id)
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

  return <Loader />;
};

export default HomePage;
