"use client";

import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { useOnboarding } from "@/context/OnboardingContext";

type FormData = {
  businessName: string;
  companyAddress: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

const InfoTwo = () => {
  const { prevStep, nextStep, setData, data } = useOnboarding();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      companyAddress: data.companyAddress || "",
      city: data.city || "",
      state: data.state || "",
      zip: data.zip || "",
      country: data.country || "",
    },
  });

  const onSubmit = (formData: FormData) => {
    setData(formData);
    nextStep();
  };

  return (
    <VStack className="bg-white w-full  p-8 gap-8 rounded-lg h-screen">
      <HStack className="w-full gap-8">
        {/* Left Side - Form */}
        <VStack className="w-2/5 gap-4">
          {/* Address */}
          <FormControl isInvalid={!!errors.companyAddress}>
            <FormControlLabel>
              <FormControlLabelText>Address</FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="companyAddress"
              control={control}
              rules={{ required: "Company address is required" }}
              render={({ field }) => (
                <Input className="h-12">
                  <InputField placeholder="1234 Street Name" {...field} />
                </Input>
              )}
            />
            {errors.companyAddress && (
              <FormControlError>
                <FormControlErrorText>
                  {errors.companyAddress.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Other Address Fields */}
          <HStack className="gap-4">
            {/* City */}
            <FormControl isInvalid={!!errors.city} className="w-1/2">
              <FormControlLabel>
                <FormControlLabelText>City</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="city"
                control={control}
                rules={{ required: "City is required" }}
                render={({ field }) => (
                  <Input className="h-12">
                    <InputField placeholder="City" {...field} />
                  </Input>
                )}
              />
              {errors.city && (
                <FormControlError>
                  <FormControlErrorText>
                    {errors.city.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* State */}
            <FormControl isInvalid={!!errors.state} className="w-1/2">
              <FormControlLabel>
                <FormControlLabelText>State</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="state"
                control={control}
                rules={{ required: "State is required" }}
                render={({ field }) => (
                  <Input className="h-12">
                    <InputField placeholder="State" {...field} />
                  </Input>
                )}
              />
              {errors.state && (
                <FormControlError>
                  <FormControlErrorText>
                    {errors.state.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          </HStack>

          <HStack className="gap-4">
            {/* ZIP Code */}
            <FormControl isInvalid={!!errors.zip} className="w-1/2">
              <FormControlLabel>
                <FormControlLabelText>ZIP Code</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="zip"
                control={control}
                rules={{ required: "ZIP Code is required" }}
                render={({ field }) => (
                  <Input className="h-12">
                    <InputField placeholder="ZIP Code" {...field} />
                  </Input>
                )}
              />
              {errors.zip && (
                <FormControlError>
                  <FormControlErrorText>
                    {errors.zip.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Country */}
            <FormControl isInvalid={!!errors.country} className="w-1/2">
              <FormControlLabel>
                <FormControlLabelText>Country</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="country"
                control={control}
                rules={{ required: "Country is required" }}
                render={({ field }) => (
                  <Input className="h-12">
                    <InputField placeholder="Country" {...field} />
                  </Input>
                )}
              />
              {errors.country && (
                <FormControlError>
                  <FormControlErrorText>
                    {errors.country.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          </HStack>
        </VStack>
      </HStack>

      {/* Navigation Buttons */}
      <HStack className="justify-between mt-auto">
        <Button variant="outline" onPress={prevStep}>
          <ButtonText>Back</ButtonText>
        </Button>
        <Button onPress={handleSubmit(onSubmit)}>
          <ButtonText>Continue</ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
};

export default InfoTwo;