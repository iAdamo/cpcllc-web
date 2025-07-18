"use client";

import { HStack } from "@/components/ui/hstack";
import { useOnboarding } from "@/context/OnboardingContext";
import { useEffect, useState } from "react";
import PageOne from "@/screens/onboarding/pageOne";
import BasicInfo from "@/screens/onboarding/company/basicInfo";
import ServicesInfo from "./company/serviceInfo";
import LocationBoard from "./company/locationBoard";
import { VStack } from "@/components/ui/vstack";
import FinalStep from "@/screens/onboarding/company/finalStep";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import OpenInApp from "@/components/OpenInApp";

const Onboarding = () => {
  const { step } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(step);

  const router = useRouter();

  useEffect(() => {
    setCurrentStep(step);
  }, [step]);

  return (
    <section>
      {currentStep === 1 ? (
        <PageOne />
      ) : (
        <VStack className="w-full min-h-screen">
  <HStack className="hidden md:flex w-full bg-white flex-1">
    {/* Sidebar - Fixed width, independent height */}
    <VStack className="bg-brand-primary w-1/6 min-h-full">
      <Button
        className="bg-brand-primary data-[hover=true]:bg-brand-primary data-[active=true]:bg-brand-primary mt-4"
        onPress={() => router.replace("/")}
      >
        <ButtonText size="lg" className="text-white">
          CompanyCenterLLC
        </ButtonText>
      </Button>
    </VStack>

    {/* Content Area - Flexible width, independent height */}
    <VStack className="flex-1 overflow-auto">
      {currentStep === 3 && <BasicInfo />}
      {currentStep === 2 && <ServicesInfo />}
      {currentStep === 4 && <LocationBoard />}
      {currentStep === 5 && <FinalStep />}
    </VStack>
  </HStack>
  <OpenInApp />
</VStack>
      )}
    </section>
  );
};

export default Onboarding;
