import { useState, useEffect } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { FieldWithInfo } from "./FieldWithInfo";
import { CloseIcon } from "@/components/ui/icon";
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";

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

const StepTwo = ({
  setStep,
  popularTags,
  register,
  watch,
  setValue,
  errors,
  handleSubmit,
}: {
  setStep: (step: number) => void;
  popularTags: string[];
  register: UseFormRegister<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  errors: FieldErrors<FormData>;
  handleSubmit: UseFormHandleSubmit<FormData>;
}) => {
  const [focusedField, setFocusedField] = useState<string | "">("");
  const [tagInput, setTagInput] = useState("");
  const maxTags = 5;

  // Register the field separately since we're managing it manually
  useEffect(() => {
    register("tags", {
      validate: {
        required: (value) =>
          value?.length > 0 || "At least one tag is required",
        max: (value) =>
          value?.length <= maxTags || `Maximum ${maxTags} tags allowed`,
        unique: (value) =>
          new Set(value).size === value?.length || "Tags must be unique",
        valid: (value) =>
          value?.every((tag) => tag.trim().length > 0) ||
          "Tags cannot be empty",
      },
    });
  }, [register]);

  // Handle tag addition
  const handleAddTag = (newTag: string) => {
    const currentTags = watch("tags") || [];
    if (!newTag.trim() || currentTags.includes(newTag)) return;

    const updatedTags = [...currentTags, newTag];
    setValue("tags", updatedTags, { shouldValidate: true });
    setTagInput("");
  };

  // Handle tag removal
  const handleRemoveTag = (index: number) => {
    const currentTags = [...watch("tags")];
    currentTags.splice(index, 1);
    setValue("tags", currentTags, { shouldValidate: true });
  };
  return (
    <VStack>
      {/** Pricing */}
      <FieldWithInfo
        id="price"
        infoText="Set the price for your service. Ensure it reflects the value you provide and is competitive in the market."
        focusedField={focusedField}
        errors={errors}
      >
        <Input className="border-gray-300">
          <InputField
            onFocus={() => setFocusedField("price")}
            {...register("price", {
              required: "Price is required",
              valueAsNumber: true,
              min: {
                value: 1,
                message: "Price must be a positive number",
              },
            })}
            onBlur={() => setFocusedField("")}
            onChangeText={(text) => {
              const value = Number(text);
              if (!isNaN(value)) {
                setValue("price", value);
              }
            }}
            className="text-gray-700"
            id="price"
            placeholder="Service Price"
          />
        </Input>
      </FieldWithInfo>
      {/** delivery time */}
      <FieldWithInfo
        id="deliveryTime"
        infoText="Specify the estimated delivery time for your service. This helps manage customer expectations."
        focusedField={focusedField}
        errors={errors}
      >
        <Input className="border-gray-300">
          <InputField
            onFocus={() => setFocusedField("deliveryTime")}
            {...register("deliveryTime", {
              required: "Delivery time is required",
              valueAsNumber: true,
              min: {
                value: 1,
                message: "Delivery time must be at least 1 day",
              },
            })}
            onChangeText={(text) => {
              const value = Number(text);
              if (!isNaN(value)) {
                setValue("deliveryTime", value);
              }
            }}
            onBlur={() => setFocusedField("")}
            id="deliveryTime"
            placeholder="Delivery Time (e.g., 3 days)"
          />
        </Input>
      </FieldWithInfo>
      {/** Tags Field */}
      <FieldWithInfo
        id="tags"
        infoText={`Add relevant tags to help users find your service (max ${maxTags} tags). Use popular tags or keywords related to your service.`}
        focusedField={focusedField}
        errors={errors}
      >
        {/* Display existing tags */}
        <HStack className="flex-wrap gap-2 mb-2 items-center">
          {watch("tags")?.map((tag, index) => (
            <Button
              key={index}
              variant="outline"
              size="xs"
              onPress={() => handleRemoveTag(index)}
              className="border-gray-300 bg-gray-100"
            >
              <ButtonText className="text-indigo-400">{tag}</ButtonText>
              <ButtonIcon as={CloseIcon} className="text-gray-500" />
            </Button>
          ))}
          <Text className="text-xs text-gray-500 ml-auto">
            {watch("tags")?.length || 0}/{maxTags}
          </Text>
        </HStack>

        {/* Tags input */}
        <Input isDisabled={watch("tags")?.length >= maxTags}>
          <InputField
            onFocus={() => setFocusedField("tags")}
            onBlur={() => setFocusedField("")}
            id="tags-input"
            placeholder="Add tags (press Enter or comma)"
            value={tagInput}
            onChangeText={setTagInput}
            onKeyPress={(e) => {
              if (
                (e.nativeEvent.key === "Enter" || e.nativeEvent.key === ",") &&
                tagInput.trim()
              ) {
                e.preventDefault();
                handleAddTag(tagInput.trim().replace(/,/g, ""));
              }
            }}
          />
        </Input>
        {/* Popular tags suggestions */}
        <VStack className="mt-2">
          <Text className="text-sm text-gray-500">Popular Tags:</Text>
          <HStack className="flex-wrap gap-2 mt-1">
            {popularTags.map((tag, index) => (
              <Button
                key={index}
                variant="outline"
                size="xs"
                onPress={() => {
                  if (watch("tags")?.length < maxTags) {
                    handleAddTag(tag);
                  }
                }}
                className="border-none bg-gray-100"
                disabled={
                  watch("tags")?.includes(tag) ||
                  watch("tags")?.length >= maxTags
                }
              >
                <ButtonText
                  className={
                    watch("tags")?.includes(tag)
                      ? "text-gray-400"
                      : "text-gray-600"
                  }
                >
                  {tag}
                </ButtonText>
              </Button>
            ))}
          </HStack>
        </VStack>
      </FieldWithInfo>

      {/* Next Button */}
      <VStack className="w-3/5 mt-12">
        <Button
          onPress={() => handleSubmit(() => setStep(3))()}
          className="self-end"
        >
          <ButtonText>Next</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
};

export default StepTwo;
