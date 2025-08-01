"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  OnboardingData,
  OnboardingContextType,
  ServiceCategory,
} from "@/types";
import { getAllCategoriesWithSubcategories } from "@/axios/services";

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export const OnboardingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setDataState] = useState<OnboardingData>(() => {
    return JSON.parse(localStorage.getItem("onboardingData") || "{}");
  });
  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  const [step, setStep] = useState(() => {
    return Number(localStorage.getItem("onboardingStep")) || 1;
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const services = await getAllCategoriesWithSubcategories();
        setCategories(services);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    return () => {
      localStorage.removeItem("onboardingData");
      localStorage.removeItem("onboardingStep");
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("onboardingStep", step.toString());
  }, [step]);

  useEffect(() => {
    localStorage.setItem("onboardingData", JSON.stringify(data));
  }, [data]);

  const setData = (updates: Partial<OnboardingData>) => {
    setDataState((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => setStep((prev) => prev + 1);

  const prevStep = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : prev)); // ✅ Fix: Don’t reset to 1 from step 2
  };

  const submitData = () => {
    localStorage.removeItem("onboardingData");
    localStorage.removeItem("onboardingStep");
  };

  return (
    <OnboardingContext.Provider
      value={{
        step,
        data,
        setData,
        nextStep,
        prevStep,
        submitData,
        categories,
      }}
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
