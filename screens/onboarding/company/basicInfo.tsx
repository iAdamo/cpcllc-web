import { useEffect } from "react";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import Image from "next/image";
import { Heading } from "@/components/ui/heading";
import { useState } from "react";
import { Input, InputField } from "@/components/ui/input";
import { useOnboarding } from "@/context/OnboardingContext";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";

const BasicInfo = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ image?: string }>({});
  const { prevStep, nextStep, setData, data } = useOnboarding();
  const [firstName, setFirstName] = useState(data.firstName);
  const [lastName, setLastName] = useState(data.lastName);

  useEffect(() => {
    setFirstName(data.firstName);
    setLastName(data.lastName);
    setSelectedImage(data.profilePicture);
  }, [data]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      setErrors({});
    }
  };

  const handleSubmit = () => {
    if (!firstName || !lastName) return;
    setData({ firstName, lastName, profilePicture: selectedImage });
    nextStep();
  };

  return (
    <VStack className="w-full h-full">
      <HStack className="w-full h-full bg-[#F7F7F7]">
        <VStack className="bg-brand-primary h-full w-1/5">
          <Heading className="text-white p-4">COMPANYCENTERLLC</Heading>
        </VStack>
        <VStack className="bg-white mx-auto w-2/5 my-10 p-8 gap-10 rounded-lg">
          <HStack className="w-full justify-between">
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>First Name </FormControlLabelText>
              </FormControlLabel>
              <Input className="h-12">
                <InputField
                  placeholder="John"
                  onChangeText={(value: string) => setFirstName(value)}
                />
              </Input>
            </FormControl>
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Last Name </FormControlLabelText>
              </FormControlLabel>
              <Input className="h-12">
                <InputField
                  placeholder="Doe"
                  onChangeText={(value: string) => setLastName(value)}
                />
              </Input>
            </FormControl>
          </HStack>
          <FormControl
            isInvalid={!!errors.image}
            className="mx-auto  justify-center items-center"
          >
            <FormControlLabel>
              <FormControlLabelText>Profile Picture</FormControlLabelText>
            </FormControlLabel>
            <VStack className="w-48 h-48 rounded-full border-4">
              <div className="text-center cursor-pointer h-48 border rounded-full w-full flex items-center justify-center">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
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
            <Button onPress={handleSubmit} className="">
              <ButtonText>Continue</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default BasicInfo;
