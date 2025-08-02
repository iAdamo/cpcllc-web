"use client";

import { useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { useForm } from "react-hook-form";

import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";

type FormData = {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  tags: string[];
  price: number;
  deliveryTime: number;
  revisions: number;
  images: File[];
  videos: File[];
};

const CreateService = () => {
  // Mock data - replace with API calls
  const categories = [
    {
      id: "home-services",
      name: "Home Services",
      subcategories: [
        { id: "tree-service", name: "Tree Service" },
        { id: "cleaning", name: "Cleaning" },
        { id: "plumbing", name: "Plumbing" },
      ],
    },
    {
      id: "digital-services",
      name: "Digital Services",
      subcategories: [
        { id: "web-development", name: "Web Development" },
        { id: "graphic-design", name: "Graphic Design" },
      ],
    },
  ];

  const popularTags = [
    "tree trimming",
    "stone grinding",
    "deep cleaning",
    "emergency plumbing",
    "responsive design",
    "logo creation",
  ];

  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      tags: [],
      price: 0,
      deliveryTime: 3,
      revisions: 1,
      images: [],
      videos: [],
    },
  });

  return (
    <VStack className="mt-28 py-8 px-20 bg-[#F6F6F6] min-h-screen">
      <VStack>
        {/** Progress Steps */}{" "}
        <div className="border-b border-gray-200 w-3/5">
          <nav className="flex -mb-px">
            {[1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => i < step && setStep(i)}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  step === i
                    ? "border-indigo-500 text-indigo-600"
                    : i < step
                    ? "border-indigo-100 text-indigo-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {i === 1 && "Basic Info"}
                {i === 2 && "Details"}
                {i === 3 && "Media"}
              </button>
            ))}
          </nav>
        </div>
        {/** Step Content */}
        {step === 1 && (
          <StepOne
            setStep={setStep}
            categories={categories}
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            handleSubmit={handleSubmit}
          />
        )}
        {step === 2 && (
          <StepTwo
            setStep={setStep}
            popularTags={popularTags}
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            handleSubmit={handleSubmit}
          />
        )}
        {step === 3 && (
          <StepThree
            setStep={setStep}
            setValue={setValue}
            watch={watch}
            errors={errors}
            setError={setError}
            clearErrors={clearErrors}
            handleSubmit={handleSubmit}
          />
        )}
      </VStack>
    </VStack>
  );
};

export default CreateService;
