import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Input, InputField } from "@/components/ui/input";
import { useState } from "react";
import { useOnboarding } from "@/context/OnboardingContext";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useForm, Controller } from "react-hook-form";
import { Text } from "@/components/ui/text";

type FormData = {
  companyName: string;
  companyDescription: string;
  companyEmail: string;
  companyPhoneNumber: string;
  companyAddress: string;
  companyLogo: File | null;
};

const InfoOne = () => {
  const { prevStep, nextStep, setData, data } = useOnboarding();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ image?: string }>({});
  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<FormData>({
    defaultValues: {
      companyName: data.companyName,
      companyDescription: data.companyDescription,
      companyEmail: data.companyEmail,
      companyPhoneNumber: data.companyPhoneNumber,
      companyAddress: data.companyAddress,
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      setErrors({});
    }
  };

  const onSubmit = (formData: FormData) => {
    if (!selectedImage) {
      setErrors({ image: "Image is required" });
      return;
    }
    setData({ ...formData, companyLogo: selectedImage });
    nextStep();
  };

  // handle form submission on enter key press
  const handleKeyPress = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <VStack className="bg-white mx-auto w-3/5 my-10 p-8 gap-10 rounded-lg">
      <HStack className="w-full justify-between">
        <VStack className="w-1/2 gap-2">
          <FormControl isInvalid={!!formErrors.companyName}>
            <FormControlLabel>
              <FormControlLabelText>Company Name</FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="companyName"
              control={control}
              rules={{ required: "Company name is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input className="h-12">
                  <InputField
                    placeholder="CompanyCenterLLC"
                    value={value}
                    onSubmitEditing={handleKeyPress}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </Input>
              )}
            />
          </FormControl>
          {/** Description */}
          <FormControl isInvalid={!!formErrors.companyDescription}>
            <FormControlLabel>
              <FormControlLabelText>Company Description</FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="companyDescription"
              control={control}
              rules={{ required: "Company description is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Textarea className="h-32">
                  <TextareaInput
                    placeholder="Company Description"
                    value={value}
                    onSubmitEditing={handleKeyPress}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </Textarea>
              )}
            />
          </FormControl>
          <FormControl isInvalid={!!formErrors.companyEmail}>
            <FormControlLabel>
              <FormControlLabelText>Company Email</FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="companyEmail"
              control={control}
              rules={{
                required: "Company email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input className="h-12">
                  <InputField
                    placeholder="companyemail@example.com"
                    value={value}
                    onSubmitEditing={handleKeyPress}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </Input>
              )}
            />
            {formErrors.companyEmail && (
              <FormControlError>
                <FormControlErrorText>
                  {formErrors.companyEmail.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
          <FormControl isInvalid={!!formErrors.companyPhoneNumber}>
            <FormControlLabel>
              <FormControlLabelText>Company Phone Number</FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="companyPhoneNumber"
              control={control}
              rules={{ required: "Company phone number is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input className="h-12">
                  <InputField
                    placeholder="+1 123 456 7890"
                    value={value}
                    onSubmitEditing={handleKeyPress}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </Input>
              )}
            />
          </FormControl>
          {/* Address */}
          <FormControl isInvalid={!!formErrors.companyAddress}>
            <FormControlLabel>
              <FormControlLabelText>Company Address</FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="companyAddress"
              control={control}
              rules={{ required: "Company address is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input className="h-12">
                  <InputField
                    placeholder="1234 Street Name"
                    value={value}
                    onSubmitEditing={handleKeyPress}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </Input>
              )}
            />
          </FormControl>
        </VStack>
        <VStack className="w-2/5">
          <Card variant="filled" className="w-full">
            <FormControl
              isInvalid={!!errors.image}
              className="justify-center items-center"
            >
              <FormControlLabel className="flex-col flex items-start gap-2">
                <FormControlLabelText>Company&apos;s Logo</FormControlLabelText>
              </FormControlLabel>
              <Card className="w-48 h-48 rounded-full border-4">
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
              </Card>
              {errors.image && (
                <FormControlError>
                  <FormControlErrorText>{errors.image}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          </Card>
          <Card className="bg-green-200 mt-10">
            <Text className="text-green-900">
              Informations like this helps you get the most out of our algorithm
            </Text>
          </Card>
          <VStack className="gap-2 h-full">
            <HStack className="justify-between mt-auto">
              <Button variant="outline" onPress={prevStep} className="">
                <ButtonText>Back</ButtonText>
              </Button>
              <Button onPress={handleSubmit(onSubmit)} className="">
                <ButtonText>Continue</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default InfoOne;
