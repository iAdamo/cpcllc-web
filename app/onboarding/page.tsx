"use client";
import { OnboardingProvider } from "@/context/OnboardingContext";
import Onboarding  from "@/screens/onboarding";

export default function Page() {
  return (
    <OnboardingProvider>
      <Onboarding />
    </OnboardingProvider>
  );
}
