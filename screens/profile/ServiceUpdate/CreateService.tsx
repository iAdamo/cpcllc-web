"use client";

import { useState, useEffect } from "react";
import { VStack } from "@/components/ui/vstack";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { getServiceById } from "@/axios/services";
import urlToFile from "@/utils/UrlToFile";

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
  duration: number;
  revisions: number;
  images: File[];
  videos: File[];
  // Optionally add id if you want to distinguish edit mode
  _id?: string;
};

// Accept initialData as a prop for edit mode
const CreateService = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [initialData, setInitialData] = useState<Partial<FormData> | null>(
    null
  );

  useEffect(() => {
    if (isEditMode) {
      const fetchService = async () => {
        try {
          const serviceData = await getServiceById(id);
          // console.log("Fetched category data:", serviceData);
          const images = await Promise.all(
            serviceData.images.map((url: string) =>
              urlToFile(url, `image-${Date.now()}.jpg`, "image/jpeg")
            )
          );
          const videos = await Promise.all(
            serviceData.videos.map((url: string) =>
              urlToFile(url, `video-${Date.now()}.mp4`, "video/mp4")
            )
          );
          setInitialData({
            ...serviceData,
            images,
            videos,
          });
        } catch (error) {
          console.error("Error fetching category data:", error);
        }
      };
      fetchService();
    }
  }, [id, isEditMode]);

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
    reset,
  } = useForm<FormData>({
    defaultValues: {
      tags: [],
      price: 0,
      duration: 0,
      revisions: 1,
      images: [],
      videos: [],
      ...initialData, // Use initialData if present
    },
  });

  // If initialData changes (e.g., after fetch), reset the form
  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        images: initialData.images || [],
        videos: initialData.videos || [],
      });
    }
  }, [initialData, reset]);

  return (
    <VStack className="mt-28 py-8 md:px-20 px-4 w-full bg-[#F6F6F6] min-h-screen">
      <VStack>
        {/* Progress Steps */}
        <div className="border-b border-gray-200 w-full md:w-3/5">
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
        {/* Step Content */}
        {step === 1 && (
          <StepOne
            setStep={setStep}
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
