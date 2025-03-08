import { useEffect } from "react";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import Image from "next/image";
import { Heading } from "@/components/ui/heading";
import { TrashIcon } from "@/components/ui/icon";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import NavBar from "../NavBar";
import { useState } from "react";
import { Keyboard } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, InputField } from "@/components/ui/input";
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      setErrors({});
    }
  };

   const handleSubmit = () => {
     if (!selectedImage) {
       setErrors({ image: "Image is required" });
       return;
     }
     // Handle form submission
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
              <Input className="h-14">
                <InputField placeholder="John" />
              </Input>
            </FormControl>
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Last Name </FormControlLabelText>
              </FormControlLabel>
              <Input className="h-14">
                <InputField placeholder="Doe" />
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
          <Button onPress={handleSubmit} className="mt-4">
            <ButtonText>Next</ButtonText>
          </Button>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default BasicInfo;
