"use client";

import { SafeAreaView } from "@/components/ui/safe-area-view";
import { useOnboarding } from "@/context/OnboardingContext";
import { useEffect, useState } from "react";
import PageOne from "@/screens/onboarding/pageOne";
import BasicInfo from "@/screens/onboarding/company/basicInfo";
import InfoOne from "@/screens/onboarding/company/infoOne";
import InfoTwo from "./company/infoTwo";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import FinalStep from "@/screens/onboarding/company/finalStep";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Onboarding = () => {
  const { step } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(step);

  const router = useRouter();

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
              <Button className="mt-4 justify-start bg-transparent data-[hover=true]:bg-btn-primary" onPress={() => router.push("/")}>
                <ButtonText size="xl">CompanyCenterLLC</ButtonText>
              </Button>
            </VStack>
            {currentStep === 2 && <BasicInfo />}
            {currentStep === 3 && <InfoOne />}
            {currentStep === 4 && <InfoTwo />}
            {currentStep === 5 && <FinalStep />}
          </HStack>
        </VStack>
      )}
    </SafeAreaView>
  );
};

export default Onboarding;
