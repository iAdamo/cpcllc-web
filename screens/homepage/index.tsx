"use client";

import dynamic from "next/dynamic";

const HeroSection = dynamic(() => import("@/components/home/HeroSection"), {
  ssr: false,
});
const CategoriesSection = dynamic(
  () => import("@/components/home/CategoriesSection")
);
const ProvidersSection = dynamic(
  () => import("@/components/home/ProvidersSection")
);
const HowItWorksSection = dynamic(
  () => import("@/components/home/HowItWorksSection")
);
const StatsSection = dynamic(() => import("@/components/home/StatsSection"));
const TestimonialsSection = dynamic(
  () => import("@/components/home/TestimonialsSection")
);
const ForBusinessSection = dynamic(
  () => import("@/components/home/ForBusinessSection")
);
const FAQSection = dynamic(() => import("@/components/home/FAQSection"));
const NewsletterSection = dynamic(
  () => import("@/components/home/NewsletterSection")
);

const HomePage = () => {
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
};

export default HomePage;
