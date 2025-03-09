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
import { Input, InputField } from "@/components/ui/input";
import { useState } from "react";
import { useOnboarding } from "@/context/OnboardingContext";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useForm, Controller } from "react-hook-form";

type FormData = {
  companyName: string;
  companyEmail: string;
  companyPhoneNumber: string;
  companyAddress: string;
  companyLogo: File | null;
};

const InfoOne = () => {
  const { prevStep, nextStep, setData, data } = useOnboarding();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ image?: string }>({});
  const { control, handleSubmit, formState: { errors: formErrors } } = useForm<FormData>({
    defaultValues: {
      companyName: data.companyName,
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
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </Input>
              )}
            />
            {formErrors.companyName && (
              <FormControlError>
                <FormControlErrorText>{formErrors.companyName.message}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
          <FormControl isInvalid={!!formErrors.companyEmail}>
            <FormControlLabel>
              <FormControlLabelText>Company Email</FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="companyEmail"
              control={control}
              rules={{ required: "Company email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input className="h-12">
                  <InputField
                    placeholder="companyemail@example.com"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </Input>
              )}
            />
            {formErrors.companyEmail && (
              <FormControlError>
                <FormControlErrorText>{formErrors.companyEmail.message}</FormControlErrorText>
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
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </Input>
              )}
            />
            {formErrors.companyPhoneNumber && (
              <FormControlError>
                <FormControlErrorText>{formErrors.companyPhoneNumber.message}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
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
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </Input>
              )}
            />
            {formErrors.companyAddress && (
              <FormControlError>
                <FormControlErrorText>{formErrors.companyAddress.message}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        </VStack>
        <Card variant="filled" className="w-1/3">
          <FormControl isInvalid={!!errors.image} className="justify-center items-center">
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
      </HStack>
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

export default InfoOne;