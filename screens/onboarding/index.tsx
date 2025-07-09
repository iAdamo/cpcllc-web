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
        <VStack className="w-full h-screen">
          <HStack className="hidden md:flex w-full h-full bg-white">
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
            {currentStep === 2 && <BasicInfo />}
            {currentStep === 3 && <ServicesInfo />}
            {currentStep === 4 && <LocationBoard />}
            {currentStep === 5 && <FinalStep />}
          </HStack>
          <OpenInApp />
        </VStack>
      )}
    </section>
  );
};

export default Onboarding;
