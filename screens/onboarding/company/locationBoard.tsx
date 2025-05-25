"use client";

import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
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
import {
  fullLocationSchema,
  fullLocationSchemaType,
} from "@/components/forms/OnboardingFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";

const LocationBoard = () => {
  const { prevStep, nextStep, setData, data } = useOnboarding();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<fullLocationSchemaType>({
    resolver: zodResolver(fullLocationSchema),
    defaultValues: {
      primary: {
        address: {
          address: data.companyAddress,
          city: data.city,
          state: data.state,
          country: data.country,
          zip: data.zip,
        },
        coordinates: {
          lat: data.latitude,
          long: data.longitude,
        },
      },
    },
  });

  const onSubmit = (formData: fullLocationSchemaType) => {
    const payload = {
      companyAddress: formData.primary.address.address,
      city: formData.primary.address.city,
      state: formData.primary.address.state,
      zip: formData.primary.address.zip,
      country: formData.primary.address.country,
    };
    setData(payload);
    nextStep();
  };

  return (
    <VStack className="w-full p-8 gap-8 h-screen ">
      <VStack className="w-full gap-8 justify-center items-center h-full">
        <Card variant="filled" className="w-[32rem]">
          <Text className="text-gray-600 text-sm">
            Providing your company location helps us ensure accurate service
            delivery, compliance with local regulations, and better
            communication with your clients. This information will also help
            customers find and connect with your business more easily.
          </Text>
        </Card>
        <Card variant="outline" className="gap-4">
          {/* Address */}
          <FormControl isInvalid={!!errors.primary?.address?.address}>
            <FormControlLabel>
              <FormControlLabelText className="font-semibold text-md">
                Address
              </FormControlLabelText>
            </FormControlLabel>

            <Controller
              name="primary.address.address"
              control={control}
              rules={{ required: "Company address is required" }}
              render={({ field }) => (
                <Input className="h-12">
                  <InputField placeholder="1234 Street Name" {...field} />
                </Input>
              )}
            />
            {errors.primary?.address?.address && (
              <FormControlError>
                <FormControlErrorText>
                  {errors.primary?.address?.address.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Other Address Fields */}
          <HStack className="gap-4">
            {/* City */}
            <FormControl
              isInvalid={!!errors.primary?.address?.city}
              className=""
            >
              <FormControlLabel>
                <FormControlLabelText className="font-semibold text-md">
                  City
                </FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="primary.address.city"
                control={control}
                rules={{ required: "City is required" }}
                render={({ field }) => (
                  <Input className="h-12">
                    <InputField placeholder="City" {...field} />
                  </Input>
                )}
              />
              {errors.primary?.address?.city && (
                <FormControlError>
                  <FormControlErrorText>
                    {errors.primary?.address?.city?.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* State */}
            <FormControl
              isInvalid={!!errors.primary?.address?.state}
              className=""
            >
              <FormControlLabel>
                <FormControlLabelText className="font-semibold text-md">
                  State
                </FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="primary.address.state"
                control={control}
                rules={{ required: "State is required" }}
                render={({ field }) => (
                  <Input className="h-12">
                    <InputField placeholder="State" {...field} />
                  </Input>
                )}
              />
              {errors.primary?.address?.state && (
                <FormControlError>
                  <FormControlErrorText>
                    {errors.primary?.address?.state.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          </HStack>

          <HStack className="gap-4">
            {/* ZIP Code */}
            <FormControl
              isInvalid={!!errors.primary?.address?.zip}
              className=""
            >
              <FormControlLabel>
                <FormControlLabelText className="font-semibold text-md">
                  ZIP Code
                </FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="primary.address.zip"
                control={control}
                rules={{ required: "ZIP Code is required" }}
                render={({ field }) => (
                  <Input className="h-12">
                    <InputField placeholder="ZIP Code" {...field} />
                  </Input>
                )}
              />
              {errors.primary?.address?.zip && (
                <FormControlError>
                  <FormControlErrorText>
                    {errors.primary?.address?.zip.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Country */}
            <FormControl
              isInvalid={!!errors.primary?.address?.country}
              className=""
            >
              <FormControlLabel>
                <FormControlLabelText className="font-semibold text-md">
                  Country
                </FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="primary.address.country"
                control={control}
                rules={{ required: "Country is required" }}
                render={({ field }) => (
                  <Input className="h-12">
                    <InputField placeholder="Country" {...field} />
                  </Input>
                )}
              />
              {errors.primary?.address?.country && (
                <FormControlError>
                  <FormControlErrorText>
                    {errors.primary?.address?.country.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          </HStack>
          <HStack className="justify-between mt-auto">
            <Button variant="outline" onPress={prevStep}>
              <ButtonText>Back</ButtonText>
            </Button>
            <Button onPress={handleSubmit(onSubmit)}>
              <ButtonText>Continue</ButtonText>
            </Button>
          </HStack>
        </Card>
      </VStack>
    </VStack>
  );
};

export default LocationBoard;
