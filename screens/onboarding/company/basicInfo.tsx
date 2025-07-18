import { useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { TrashIcon } from "@/components/ui/icon";
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
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  onboardingFormSchema,
  onboardingFormSchemaType,
} from "@/components/forms/OnboardingFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";

const BasicInfo = () => {
  const { prevStep, nextStep, setData, data } = useOnboarding();

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedProfileImage, setSelectedProfileImage] = useState<File | null>(
    data.profilePicture
  );

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<onboardingFormSchemaType>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      firstName: data.firstName,
      lastName: data.lastName,
      profilePicture: data.profilePicture ?? undefined,
      companyEmail: data.companyEmail,
      companyName: data.companyName,
      companyDescription: data.companyDescription,
      companyPhoneNumber: data.companyPhoneNumber,
      companyImages: data.companyImages || [],
    },
  });

  // useEffect(() => {
  // setValue("firstName", data.firstName);
  //setValue("lastName", data.lastName);
  //setSelectedProfileImage(data.profilePicture);
  //setSelectedImages(data.companyImages || []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  //}, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const MAX_IMAGE_SIZE_MB = 9;
    const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

    const newFiles = Array.from(event.target.files).slice(
      0,
      6 - selectedImages.length
    );

    const oversizedFile = newFiles.find(
      (file) => file.size > MAX_IMAGE_SIZE_BYTES
    );

    if (oversizedFile) {
      setError("companyImages", {
        type: "manual",
        message: `Each image must be less than ${MAX_IMAGE_SIZE_MB}MB`,
      });
      return;
    }

    const updated = [...selectedImages, ...newFiles];
    setSelectedImages(updated);
    setValue("companyImages", updated);
    clearErrors("companyImages");
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const MAX_IMAGE_SIZE_MB = 9;
    const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

    const droppedFiles = Array.from(event.dataTransfer.files).slice(
      0,
      6 - selectedImages.length
    );

    const oversizedFile = droppedFiles.find(
      (file) => file.size > MAX_IMAGE_SIZE_BYTES
    );

    if (oversizedFile) {
      setError("companyImages", {
        type: "manual",
        message: `Each image must be less than ${MAX_IMAGE_SIZE_MB}MB`,
      });
      return;
    }

    const updated = [...selectedImages, ...droppedFiles];
    setSelectedImages(updated);
    setValue("companyImages", updated);
    clearErrors("companyImages");
  };

  const handleRemoveImage = (index: number) => {
    const updated = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updated);
    setValue("companyImages", updated);
  };

  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedProfileImage(file);
    }
  };

  const onSubmit = (formData: onboardingFormSchemaType) => {
    setData({
      ...formData,
      profilePicture: selectedProfileImage,
      companyImages: selectedImages,
    });
    nextStep();
  };

  const handleFormSubmit = handleSubmit(onSubmit, (errors) => {
    console.log("Validation Errors:", errors);
  });

  return (
    <VStack className="w-full h-full px-4 my-10">
      <HStack className="gap-4">
        <VStack className="w-1/2 gap-6">
          <HStack className="justify-between">
            <FormControl isInvalid={!!errors.firstName} className="w-[48%]">
              <FormControlLabel>
                <FormControlLabelText className="font-semibold text-md">
                  First Name
                </FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: "First name is required" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input className="">
                    <InputField
                      placeholder="John"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                    />
                  </Input>
                )}
              />
              {errors.firstName && (
                <FormControlError>
                  <FormControlErrorText className="text-sm">
                    {errors.firstName.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.lastName} className="w-[48%]">
              <FormControlLabel>
                <FormControlLabelText className="font-semibold text-md">
                  Last Name
                </FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: "Last name is required" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input className="">
                    <InputField
                      placeholder="Doe"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                    />
                  </Input>
                )}
              />
              {errors.lastName && (
                <FormControlError>
                  <FormControlErrorText className="text-sm">
                    {errors.lastName.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          </HStack>
          {/** Company Name */}
          <FormControl isInvalid={!!errors.companyName}>
            <FormControlLabel>
              <FormControlLabelText className="font-semibold text-md">
                Company Name
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="companyName"
              control={control}
              rules={{ required: "Company name is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input className="">
                  <InputField
                    placeholder="Your Company Name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="words"
                  />
                </Input>
              )}
            />
            {errors.companyName && (
              <FormControlError>
                <FormControlErrorText className="text-sm">
                  {errors.companyName.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
          {/** Company Phone Number */}
          <FormControl isInvalid={!!errors.companyPhoneNumber} className="z-50">
            <FormControlLabel>
              <FormControlLabelText>Company Phone Number</FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="companyPhoneNumber"
              control={control}
              rules={{ required: "Company phone number is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <PhoneInput
                  country={"us"}
                  value={value}
                  onChange={(phone) => onChange(phone)}
                  onBlur={onBlur}
                  inputStyle={{
                    width: "100%",
                    height: "2.5rem",
                    zIndex: 1,
                  }}
                  containerStyle={{
                    position: "relative",
                    zIndex: 1,
                  }}
                  buttonStyle={{
                    zIndex: 1,
                  }}
                  dropdownStyle={{
                    zIndex: 1,
                  }}
                />
              )}
            />
            {errors.companyPhoneNumber && (
              <FormControlError>
                <FormControlErrorText className="text-sm">
                  {errors.companyPhoneNumber.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
          {/** Company Email */}
          <FormControl isInvalid={!!errors.companyEmail}>
            <FormControlLabel>
              <FormControlLabelText className="font-semibold text-md">
                Company Email
              </FormControlLabelText>
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
                <Input className="">
                  <InputField
                    placeholder="companyemail@example.com"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </Input>
              )}
            />
            {errors.companyEmail && (
              <FormControlError>
                <FormControlErrorText className="text-sm">
                  {errors.companyEmail.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
          {/** Description */}
          <FormControl isInvalid={!!errors.companyDescription}>
            <FormControlLabel>
              <FormControlLabelText className="font-semibold text-md">
                Company Description
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="companyDescription"
              control={control}
              rules={{ required: "Company description is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Textarea className="h-20">
                  <TextareaInput
                    placeholder="Describe your company and its services"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </Textarea>
              )}
            />
            {errors.companyDescription && (
              <FormControlError>
                <FormControlErrorText className="text-sm">
                  {errors.companyDescription.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <HStack className="justify-between mt-auto">
            <Button variant="outline" onPress={prevStep} className="">
              <ButtonText>Back</ButtonText>
            </Button>
            <Button onPress={handleFormSubmit} className="">
              <ButtonText>Continue</ButtonText>
            </Button>
          </HStack>
        </VStack>
        <VStack className="w-1/2 gap-4">
          <FormControl
            isInvalid={!!errors.profilePicture}
            className="flex-row justify-between items-start border border-gray-300 rounded-xl p-4"
          >
            <VStack className="w-44 h-40">
              <Controller
                name="profilePicture"
                control={control}
                render={({ field: { onChange } }) => (
                  <div className="text-center cursor-pointer h-40 border w-full flex items-center justify-center">
                    <label className="w-full h-full cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          onChange((e.target as HTMLInputElement).files?.[0]);
                          handleProfileImageChange(e);
                        }}
                        className="hidden"
                      />
                      {selectedProfileImage instanceof File ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={URL.createObjectURL(selectedProfileImage)}
                            alt="Selected image"
                            fill
                            style={{ objectFit: "cover" }}
                            className="rounded-lg"
                          />
                        </div>
                      ) : (
                        <p className="text-gray-500 mt-16">Click to Upload</p>
                      )}
                    </label>
                  </div>
                )}
              />
            </VStack>
            <VStack className="w-1/2 ml-auto">
              <FormControlLabel>
                <FormControlLabelText className="font-semibold text-md">
                  Profile Picture
                </FormControlLabelText>
              </FormControlLabel>
              <Card
                variant="filled"
                className={`${
                  errors.profilePicture ? "bg-red-200" : "bg-green-200"
                }`}
              >
                {errors.profilePicture ? (
                  <Text className="text-red-950">
                    {errors.profilePicture?.message}
                  </Text>
                ) : (
                  <Text size="sm" className="text-green-950 ">
                    A profile picture helps build trust and credibility by
                    allowing clients to recognize and connect with you, creating
                    a more personalized and professional experience
                  </Text>
                )}
              </Card>
            </VStack>
          </FormControl>
          {/**Company Images */}
          <FormControl
            isInvalid={selectedImages.length === 0 || !!errors.companyImages}
            className="border border-gray-300 rounded-xl p-4 gap-4"
          >
            <Heading size="md">Professional Company Images</Heading>
            <FormControlLabel className="flex-col flex items-start">
              <FormControlLabelText className="text-md font-medium bg-green-200 p-2 rounded">
                Upload up to 6 professional company images (.jpg or .png) that
                showcase your company. Ensure each image is under 10MB.{" "}
                <span className="text-red-500">
                  The first image should be the company&apos;s logo or the most
                  preferred image.
                </span>
              </FormControlLabelText>
            </FormControlLabel>
            <HStack className="gap-4 grid grid-cols-3">
              {selectedImages.map((image, index) => (
                <Card
                  key={index}
                  variant="filled"
                  className="h-36 justify-center items-center relative"
                >
                  <Image
                    src={URL.createObjectURL(image)}
                    alt={`Selected image ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-lg"
                  />
                  <Button
                    size="xs"
                    className="absolute top-2 right-2 bg-red-600 data-[hover=true]:bg-red-500"
                    onPress={() => handleRemoveImage(index)}
                  >
                    <ButtonIcon as={TrashIcon} className="text-white" />
                  </Button>
                </Card>
              ))}
              {selectedImages.length < 6 && (
                <Card variant="filled" className="border h-36">
                  <div
                    className="text-center cursor-pointer h-36 w-full flex items-center justify-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <label className="cursor-pointer w-full h-full">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <p className="text-gray-500 text-sm mt-4">
                        Drag companyImages here or{" "}
                        <span className="text-blue-500 mt-10">
                          Click to Upload
                        </span>
                      </p>
                    </label>
                  </div>
                </Card>
              )}
            </HStack>
            {errors.companyImages && (
              <FormControlError>
                <FormControlErrorText className="text-sm">
                  {errors.companyImages.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default BasicInfo;
