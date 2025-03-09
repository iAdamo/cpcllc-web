"use client";

import { SafeAreaView } from "@/components/ui/safe-area-view";
import { useOnboarding } from "@/context/OnboardingContext";
import { useEffect, useState } from "react";
import PageOne from "@/screens/onboarding/pageOne";
import BasicInfo from "@/screens/onboarding/company/basicInfo";
import InfoOne from "@/screens/onboarding/company/infoOne";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";

const Onboarding = () => {
  const { step } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(step);

  useEffect(() => {
    setCurrentStep(step);
  }, [step]);

  return (
    <SafeAreaView>
      {currentStep === 1 ? (
        <PageOne />
      ) : (
        <VStack className="w-full h-screen">
          <HStack className="w-full h-full bg-[#F7F7F7]">
            <VStack className="bg-brand-primary h-full w-1/5">
              <Heading className="text-white p-4">CompanyCenterLLC</Heading>
            </VStack>
            {currentStep === 2 && <BasicInfo />}
            {currentStep === 3 && <InfoOne />}
          </HStack>
        </VStack>
      )}
    </SafeAreaView>
  );
};

export default Onboarding;
