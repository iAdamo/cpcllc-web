import { useEffect, useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import Image from "next/image";
import { Input, InputField } from "@/components/ui/input";
import { useOnboarding } from "@/context/OnboardingContext";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { useForm, Controller } from "react-hook-form";

type FormData = {
  firstName: string;
  lastName: string;
  profilePicture: File | null;
};

const BasicInfo = () => {
  const { prevStep, nextStep, setData, data } = useOnboarding();
  const [errors, setErrors] = useState<{ image?: string }>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(
    data.profilePicture
  );
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors: formErrors },
  } = useForm<FormData>({
    defaultValues: {
      firstName: data.firstName,
      lastName: data.lastName,
      profilePicture: data.profilePicture,
    },
  });

  useEffect(() => {
    setValue("firstName", data.firstName);
    setValue("lastName", data.lastName);
    setSelectedImage(data.profilePicture);
  }, [data, setValue]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const onSubmit = (formData: FormData) => {
    if (!selectedImage) {
      setErrors({ image: "Image is required" });
      return;
    }
    setData({ ...formData, profilePicture: selectedImage });
    nextStep();
  };

  return (
    <VStack className="bg-white mx-auto w-2/5 my-10 p-8 gap-10 rounded-lg">
      <HStack className="w-full justify-between">
        <FormControl isInvalid={!!formErrors.firstName}>
          <FormControlLabel>
            <FormControlLabelText>First Name</FormControlLabelText>
          </FormControlLabel>
          <Controller
            name="firstName"
            control={control}
            rules={{ required: "First name is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input className="h-12">
                <InputField
                  placeholder="John"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              </Input>
            )}
          />
          {formErrors.firstName && (
            <FormControlError>
              <FormControlErrorText>
                {formErrors.firstName.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
        <FormControl isInvalid={!!formErrors.lastName}>
          <FormControlLabel>
            <FormControlLabelText>Last Name</FormControlLabelText>
          </FormControlLabel>
          <Controller
            name="lastName"
            control={control}
            rules={{ required: "Last name is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input className="h-12">
                <InputField
                  placeholder="Doe"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              </Input>
            )}
          />
          {formErrors.lastName && (
            <FormControlError>
              <FormControlErrorText>
                {formErrors.lastName.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </HStack>
      <FormControl
        isInvalid={!!errors.image}
        className="mx-auto justify-center items-center"
      >
        <FormControlLabel>
          <FormControlLabelText>Profile Picture</FormControlLabelText>
        </FormControlLabel>
        <VStack className="w-48 h-48 rounded-full border-4">
          <div className="text-center cursor-pointer h-48 border rounded-full w-full flex items-center justify-center">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {selectedImage ? (
                <Image
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected image"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              ) : (
                <p className="text-gray-500">Click to Upload</p>
              )}
            </label>
          </div>
        </VStack>
        {errors.image && (
          <FormControlError>
            <FormControlErrorText>{errors.image}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>
      <HStack className="justify-between mt-auto">
        <Button variant="outline" onPress={prevStep} className="">
          <ButtonText>Back</ButtonText>
        </Button>
        <Button onPress={handleSubmit(onSubmit)} className="">
          <ButtonText>Continue</ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
};

export default BasicInfo;
