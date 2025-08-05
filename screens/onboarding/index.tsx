"use client";

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

const Onboarding = () => {
  const { step } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(step);

  const router = useRouter();

  useEffect(() => {
    setCurrentStep(step);
  }, [step]);

  return (
    <section id="onboarding">
      {currentStep === 1 ? (
        <PageOne />
      ) : (
        <VStack className="w-full min-h-screen">
          <VStack className="md:flex-row w-full bg-white flex-1">
            {/* Sidebar - Fixed width, independent height */}
            <VStack className=" bg-brand-primary md:w-1/6 w-full md:min-h-full md:h-auto h-32">
              <Button
                variant="outline"
                className="self-start border-none data-[hover=true]:bg-brand-primary data-[active=true]:bg-brand-primary mt-4"
                onPress={() => router.replace("/")}
              >
                <ButtonText size="lg" className="text-white">
                  CompanyCenter
                </ButtonText>
              </Button>
            </VStack>

            {/* Content Area - Flexible width, independent height */}
            <VStack className="flex-1 overflow-auto">
              {currentStep === 2 && <BasicInfo />}
              {currentStep === 3 && <ServicesInfo />}
              {currentStep === 4 && <LocationBoard />}
              {currentStep === 5 && <FinalStep />}
            </VStack>
          </VStack>
        </VStack>
      )}
    </section>
  );
};

export default Onboarding;
