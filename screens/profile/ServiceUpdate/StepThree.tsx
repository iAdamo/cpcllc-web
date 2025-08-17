import { useState, useCallback } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { FieldWithInfo } from "./FieldWithInfo";
import { CloseIcon, ArrowUpIcon, Icon } from "@/components/ui/icon";
import Image from "next/image";
import { createService, updateService } from "@/axios/services";
import { useRouter } from "next/navigation";
import { Toast, useToast, ToastTitle } from "@/components/ui/toast";

import {
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormSetError,
  UseFormClearErrors,
} from "react-hook-form";
import { ServiceData } from "@/types";

type FormData = {
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  duration: number;
  revisions: number;
  images: File[];
  videos: File[];
  // Optionally add id if you want to distinguish edit mode
  _id?: string;
};

const MAX_IMAGE_SIZE_MB = 5; // 5MB
const MAX_VIDEO_SIZE_MB = 20; // 20MB
const MAX_IMAGES = 3;
const MAX_VIDEOS = 2;

const StepThree = ({
  setStep,
  watch,
  setValue,
  errors,
  setError,
  clearErrors,
  handleSubmit,
}: {
  setStep: (step: number) => void;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  errors: FieldErrors<FormData>;
  setError: UseFormSetError<FormData>;
  clearErrors: UseFormClearErrors<FormData>;
  handleSubmit: UseFormHandleSubmit<FormData>;
}) => {
  const [focusedField, setFocusedField] = useState<string | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const images = watch("images") || [];
  const videos = watch("videos") || [];

  const router = useRouter();
  const toast = useToast();

  const showToast = useCallback(
    (message: string, type: "error" | "success") => {
      toast.show({
        placement: "top",
        duration: 3000,
        render: ({ id }) => (
          <Toast nativeID={id} variant="outline" action={type}>
            <ToastTitle>{message}</ToastTitle>
          </Toast>
        ),
      });
    },
    [toast]
  );

  const handleFileUpload = useCallback(
    (type: "images" | "videos", files: FileList | null) => {
      if (!files) return;

      const maxSize = type === "images" ? MAX_IMAGE_SIZE_MB : MAX_VIDEO_SIZE_MB;
      const maxCount = type === "images" ? MAX_IMAGES : MAX_VIDEOS;
      const currentFiles = watch(type) || [];
      const newFiles: File[] = [];
      Array.from(files).forEach((file) => {
        if (currentFiles.length + newFiles.length >= maxCount) return;

        if (file.size <= maxSize * 1024 * 1024) {
          newFiles.push(file);
          clearErrors(type);
        } else {
          setError(type, {
            type: "size",
            message: `Each ${type.slice(0, -1)} must be less than ${maxSize}MB`,
          });
          return;
        }
      });

      if (newFiles.length > 0) {
        setValue(type, [...currentFiles, ...newFiles], {
          shouldValidate: true,
        });
      }
    },
    [watch, setValue, setError, clearErrors]
  );

  const removeFile = useCallback(
    (type: "images" | "videos", index: number) => {
      const currentFiles = [...watch(type)];
      currentFiles.splice(index, 1);
      setValue(type, currentFiles, { shouldValidate: true });
    },
    [watch, setValue]
  );

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((file: any) => {
            formData.append(key, file);
          });
        } else {
          formData.append(
            key,
            typeof value === "number" ? value.toString() : value
          );
        }
      });
      setIsSubmitting(true);
      let serviceData: ServiceData | null = null;
      if (data._id) {
        serviceData = await updateService(data._id, formData);
        if (serviceData) {
          showToast("Service data updated successfully", "success");
          router.replace("/");
        }
      } else {
        serviceData = await createService(formData);
        if (serviceData) {
          showToast("Service data has been created successfully", "success");
          router.replace("/");
        }
      }
    } catch (error) {
      showToast(`${error}`, "error");
      console.error("Error creating category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VStack className="space-y-6">
      {/* Images Upload */}
      <FieldWithInfo
        id="images"
        infoText={`Upload up to ${MAX_IMAGES} images (max ${MAX_IMAGE_SIZE_MB}MB each). Showcase your work with high-quality photos.`}
        focusedField={focusedField}
        errors={errors}
      >
        <VStack className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((file: File, index: number) => (
              <div key={index} className="relative group">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  width={1280}
                  height={1280}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onPress={() => removeFile("images", index)}
                >
                  <ButtonIcon as={CloseIcon} />
                </Button>
                <Text className="text-xs mt-1 truncate">{file.name}</Text>
                <Text className="text-xs text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)}MB
                </Text>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <label
                htmlFor="image-upload"
                onPointerEnter={() => setFocusedField("images")}
                onPointerLeave={() => setFocusedField("")}
                className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-32 cursor-pointer hover:border-indigo-500 transition-colors"
              >
                <Icon as={ArrowUpIcon} className="w-8 h-8 text-gray-400 mb-2" />
                <Text className="text-xs md:text-sm text-gray-600">
                  Add Image
                </Text>
                <Text className="text-xs text-gray-400">
                  {images.length}/{MAX_IMAGES}
                </Text>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload("images", e.target.files)}
                />
              </label>
            )}
          </div>
        </VStack>
      </FieldWithInfo>

      {/* Videos Upload */}
      <FieldWithInfo
        id="videos"
        infoText={`Upload up to ${MAX_VIDEOS} videos (max ${MAX_VIDEO_SIZE_MB}MB each). Demonstrate your process or showcase examples.`}
        focusedField={focusedField}
        errors={errors}
      >
        <VStack className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {videos.map((file: File, index: number) => (
              <div key={index} className="relative group">
                <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Text className="text-gray-500">Video Preview</Text>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute bg-red-500 top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onPress={() => removeFile("videos", index)}
                >
                  <ButtonIcon as={CloseIcon} />
                </Button>
                <Text className="text-xs mt-1 truncate">{file.name}</Text>
                <Text className="text-xs text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)}MB
                </Text>
              </div>
            ))}
            {videos.length < MAX_VIDEOS && (
              <label
                htmlFor="video-upload"
                className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-32 cursor-pointer hover:border-indigo-500 transition-colors"
                onPointerEnter={() => setFocusedField("videos")}
                onPointerLeave={() => setFocusedField("")}
              >
                <Icon as={ArrowUpIcon} className="w-8 h-8 text-gray-400 mb-2" />
                <Text className="text-xs md:text-sm text-gray-600">
                  Add Video
                </Text>
                <Text className="text-xs text-gray-400">
                  {videos.length}/{MAX_VIDEOS}
                </Text>
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload("videos", e.target.files)}
                />
              </label>
            )}
          </div>
        </VStack>
      </FieldWithInfo>

      {/* Navigation Buttons */}
      <HStack className="md:hidden justify-between mt-8">
        <Button
          size="xs"
          variant="outline"
          onPress={() => setStep(2)}
          className="border-gray-300"
        >
          <ButtonText>Back</ButtonText>
        </Button>
        <Button
          size="xs"
          onPress={() => handleSubmit(onSubmit)()}
          className="bg-indigo-600 disabled:opacity-50"
        >
          <ButtonText className="text-white">
            {isSubmitting ? "Submitting..." : "Submit Service"}
          </ButtonText>
        </Button>
      </HStack>
      <HStack className="hidden md:flex w-3/5 justify-between mt-8">
        <Button
          variant="outline"
          onPress={() => setStep(2)}
          className="border-gray-300"
        >
          <ButtonText>Back</ButtonText>
        </Button>
        <Button
          onPress={() => handleSubmit(onSubmit)()}
          isDisabled={isSubmitting}
          className="bg-indigo-600 disabled:opacity-50"
        >
          <ButtonText className="text-white">
            {isSubmitting ? "Submitting..." : "Submit Service"}
          </ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
};

export default StepThree;
