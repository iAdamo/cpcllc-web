"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import useGlobalStore from "@/stores";
import Loader from "@/components/Loader";

const HeroSection = dynamic(() => import("@/components/home/HeroSection"), { ssr: false });
const CategoriesSection = dynamic(() => import("@/components/home/CategoriesSection"));
const ProvidersSection = dynamic(() => import("@/components/home/ProvidersSection"));
const HowItWorksSection = dynamic(() => import("@/components/home/HowItWorksSection"));
const StatsSection = dynamic(() => import("@/components/home/StatsSection"));
const TestimonialsSection = dynamic(() => import("@/components/home/TestimonialsSection"));
const ForBusinessSection = dynamic(() => import("@/components/home/ForBusinessSection"));
const FAQSection = dynamic(() => import("@/components/home/FAQSection"));
const NewsletterSection = dynamic(() => import("@/components/home/NewsletterSection"));

const HomePage = () => {
  const { user, isAuthenticated, setParamsFrom } = useGlobalStore();
  const lastRedirectRef = useRef<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      let target: "/" | "/onboarding" | "/providers" | "/clients" | null = null;

      if (!isAuthenticated) {
        target = user?.isOnboardingComplete ? "/onboarding" : "/";
      } else if (!user?.isOnboardingComplete) {
        target = "/onboarding";
      } else if (isAuthenticated && user?.isOnboardingComplete) {
        target = user?.activeRole === "Client" ? "/providers" : "/clients";
      }

      if (target && lastRedirectRef.current !== target) {
        lastRedirectRef.current = target;
        setParamsFrom(target);
        router.replace(target);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router, setParamsFrom]);

  if (!user?._id)
    return (
      <main>
        <HeroSection />
        <StatsSection />
        <CategoriesSection />
        <ProvidersSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <ForBusinessSection />
        <FAQSection />
        <NewsletterSection />
      </main>
    );

  return <Loader />;
};

export default HomePage;
