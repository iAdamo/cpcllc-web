import { useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { Input, InputField } from "@/components/ui/input";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";
import { FieldWithInfo } from "./FieldWithInfo";
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

const StepOne = ({
  setStep,
  categories,
  register,
  watch,
  setValue,
  errors,
  handleSubmit,
}: {
  setStep: (step: number) => void;
  categories: {
    id: string;
    name: string;
    subcategories: { id: string; name: string }[];
  }[];
  register: UseFormRegister<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  errors: FieldErrors<FormData>;
  handleSubmit: UseFormHandleSubmit<FormData>;
}) => {
  const [focusedField, setFocusedField] = useState<string | "">("");

  return (
    <VStack>
      {/* Title Field */}
      <FieldWithInfo
        id="title"
        infoText="This is where you enter the title of your service. Make sure it is descriptive and clear."
        focusedField={focusedField}
        errors={errors}
      >
        <Input className="md:h-12 border-gray-300">
          <InputField
            {...register("title", {
              required: "Service title is required",
              maxLength: {
                value: 100,
                message: "Title cannot exceed 100 characters",
              },
              minLength: {
                value: 5,
                message: "Title must be at least 5 characters",
              },
            })}
            onFocus={() => setFocusedField("title")}
            onBlur={() => setFocusedField("")}
            onChangeText={(text) => setValue("title", text)}
            id="title"
            placeholder="Service Title"
            className="md:text-[15px] text-xs"
          />
        </Input>
      </FieldWithInfo>

      {/* Description Field */}
      <FieldWithInfo
        id="description"
        infoText="Provide a detailed description of your service. Include key features, benefits, and any important details users should know."
        focusedField={focusedField}
        errors={errors}
      >
        <Textarea className="md:h-40 border-gray-300">
          <TextareaInput
            onFocus={() => setFocusedField("description")}
            {...register("description", {
              required: "Service description is required",
              maxLength: {
                value: 300,
                message: "Description cannot exceed 300 characters",
              },
              minLength: {
                value: 50,
                message: "Description must be at least 50 characters",
              },
            })}
            onChangeText={(text) => setValue("description", text)}
            onBlur={() => setFocusedField("")}
            id="description"
            placeholder="Service Description"
            className="md:text-[15px] text-xs"
          />
        </Textarea>
      </FieldWithInfo>

      {/* Category Field */}
      <FieldWithInfo
        id="category"
        infoText="Choose a category that best fits your service. This helps users find your service more easily."
        focusedField={focusedField}
        errors={errors}
      >
        <Select
          selectedValue={watch("category")}
          onValueChange={(value) => setValue("category", value)}
          isInvalid={!!errors.category}
          onPointerEnter={() => setFocusedField("category")}
          onPointerLeave={() => setFocusedField("")}
        >
          <SelectTrigger className="md:h-12 border-gray-300">
            <SelectInput
              className="md:text-[15px] text-xs"
              placeholder="Select Category"
              {...register("category", {
                required: "Category is required",
                onBlur: () => setFocusedField(""),
              })}
            />
            <SelectIcon className="mr-3" as={ChevronDownIcon} />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              {categories.map((category) => (
                <SelectItem
                  key={category.id}
                  label={category.name}
                  value={category.name}
                />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>
      </FieldWithInfo>

      {/* Next Button */}
      <VStack className="w-full md:w-3/5 mt-4 md:mt-12">
        <Button
          size="md"
          onPress={() => handleSubmit(() => setStep(2))()}
          className="self-end"
        >
          <ButtonText>Next</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
};

export default StepOne;
