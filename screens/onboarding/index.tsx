"use client";

import { SafeAreaView } from "@/components/ui/safe-area-view";
import { useOnboarding } from "@/context/OnboardingContext";
import { useEffect, useState } from "react";
import PageOne from "@/screens/onboarding/pageOne";
import BasicInfo from "@/screens/onboarding/company/basicInfo";
import ServicesInfo from "./company/serviceInfo";
// import InfoOne from "@/screens/onboarding/company/infoOne";
import LocationBoard from "./company/locationBoard";
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
          <HStack className="w-full h-full bg-white">
            <VStack className="bg-brand-primary h-full w-1/5">
              <Button
                variant="link"
                className="mt-4 justify-start"
                onPress={() => router.push("/")}
              >
                <ButtonText
                  size="lg"
                  className="text-white data-[hover=true]:no-underline data-[hover=true]:text-white data-[activer=true]:no-underline"
                >
                  CompanyCenterLLC
                </ButtonText>
              </Button>
            </VStack>
            {currentStep === 3 && <BasicInfo />}
            {currentStep === 4 && <LocationBoard />}
            {currentStep === 2 && <ServicesInfo />}
            {currentStep === 5 && <FinalStep />}
          </HStack>
        </VStack>
      )}
    </SafeAreaView>
  );
};

export default Onboarding;
