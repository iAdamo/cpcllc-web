"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { OnboardingData, OnboardingContextType } from "@/types";

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export const OnboardingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [step, setStep] = useState(1);
  const [data, setDataState] = useState<OnboardingData>({
    userType: "",
    firstName: "",
    lastName: "",
    profilePicture: null,
  });

  // Load saved data from localStorage when the app starts
  useEffect(() => {
    const savedData = localStorage.getItem("onboardingData");
    if (savedData) {
      setDataState(JSON.parse(savedData));
    }
  }, []);

  // Save updated data to localStorage
  useEffect(() => {
    localStorage.setItem("onboardingData", JSON.stringify(data));
  }, [data]);

  const setData = (updates: Partial<OnboardingData>) => {
    setDataState((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : prev));

  const submitData = () => {
    console.log("Submitting data:", data);
    localStorage.removeItem("onboardingData"); // Clear storage after submission
  };

  return (
    <OnboardingContext.Provider
      value={{ step, data, setData, nextStep, prevStep, submitData }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
