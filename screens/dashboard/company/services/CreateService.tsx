import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import Image from "next/image";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { TrashIcon } from "@/components/ui/icon";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { useState } from "react";
import { Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ServiceFormSchema,
  ServiceFormSchemaType,
} from "@/components/forms/ServiceFormSchema";
import { Input, InputField } from "@/components/ui/input";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { ChevronDownIcon } from "@/components/ui/icon";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/components/ui/select";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import PreFooter from "@/components/layout/PreFooter";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { createService } from "@/axios/services";
import { useSession } from "@/context/AuthContext";

type ControllerRenderType<T> = {
  field: {
    onChange: (value: T) => void;
    onBlur: () => void;
    value: T;
  };
};

const CreateService = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const { userData } = useSession();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files).slice(
        0,
        3 - selectedImages.length
      );
      const updatedImages = [...selectedImages, ...files];
      setSelectedImages(updatedImages); // Update local state
      setValue("images", updatedImages); // Update form state
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files).slice(
      0,
      3 - selectedImages.length
    );
    const updatedImages = [...selectedImages, ...files];
    setSelectedImages(updatedImages); // Update local state
    setValue("images", updatedImages); // Update form state
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages); // Update local state
    setValue("images", updatedImages); // Update form state
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormSchemaType>({
    resolver: zodResolver(ServiceFormSchema),
    defaultValues: {
      images: [], // Initialize images as an empty array
    },
  });

  const onSubmit = async (data: ServiceFormSchemaType) => {
    Keyboard.dismiss();
    setIsLoading(true);
    try {
      const formData = new FormData();

      // Append form fields
      formData.append("title", data.title);
      formData.append("category", data.category);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());

      // Append company ID
      if (userData?.activeRoleId) {
        formData.append("company", userData.activeRoleId._id ?? "");
      } else {
        console.error("Company ID is missing");
        setIsLoading(false);
        return;
      }

      if (data.location) {
        console.log(location);
        formData.append("location", data.location);
      }

      // Append images with specific keys
      if (selectedImages[0]) formData.append("primary", selectedImages[0]);
      if (selectedImages[1]) formData.append("secondary", selectedImages[1]);
      if (selectedImages[2]) formData.append("tertiary", selectedImages[2]);

      // Send the request to the backend
      const response = await createService(formData);
      if (response) {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Error creating service:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <VStack className="p-20 bg-[#F7F7F7] gap-8 border-b">
        <Card className="bg-green-200 w-3/5">
          <Heading className="text-green-800">
            Create and showcase your service globally
          </Heading>
          <Text className="text-green-800">
            Fill out the form below to create your service listing.
          </Text>
        </Card>
        <HStack className="justify-between">
          <VStack className="gap-6 w-3/5 bg-white p-8 border rounded-lg">
            <FormControl isInvalid={!!errors?.title}>
              <FormControlLabel className="flex-col flex items-start gap-2">
                <Heading size="xl">Title</Heading>
                <FormControlLabelText>
                  Describe what the client will be hiring you for.
                </FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="title"
                control={control}
                render={({
                  field: { onChange, onBlur, value },
                }: ControllerRenderType<string>) => (
                  <Input>
                    <InputField
                      placeholder="We offer ..."
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </Input>
                )}
              />
              {errors.title && (
                <FormControlError>
                  <FormControlErrorText>
                    {errors.title.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.category} className="w-96">
              <FormControlLabel className="flex-col flex items-start gap-2">
                <Heading size="xl">Service Category</Heading>
                <FormControlLabelText>
                  Select a category so it&apos;s easy for clients to find your
                  service.
                </FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="category"
                control={control}
                render={({
                  field: { onChange, value },
                }: ControllerRenderType<string>) => (
                  <Select
                    selectedValue={value}
                    onValueChange={onChange}
                    isInvalid={!!errors.category}
                    isRequired
                  >
                    <SelectTrigger>
                      <SelectInput placeholder="Browse our list of categories" />
                      <SelectIcon className="mr-3" as={ChevronDownIcon} />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectItem label="Plumbing" value="plumbing" />
                        <SelectItem
                          label="House Cleaning"
                          value="house-cleaning"
                        />
                        <SelectItem
                          label="Electrical Work"
                          value="electrical-work"
                        />
                        <SelectItem
                          label="Industrial Painting"
                          value="industrial-painting"
                        />
                      </SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                    </SelectPortal>
                  </Select>
                )}
              />
              {errors.category && (
                <FormControlError>
                  <FormControlErrorText>
                    {errors.category.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
              {/** Service pricing */}
            </FormControl>
            <FormControl isInvalid={!!errors.price} className="w-40">
              <FormControlLabel className="flex-col flex items-start gap-2">
                <Heading size="xl">Pricing</Heading>
                <FormControlLabelText>Price</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="price"
                control={control}
                render={({
                  field: { onChange, onBlur, value },
                }: ControllerRenderType<number>) => (
                  <Input>
                    <InputField
                      placeholder="Enter price in $"
                      value={value?.toString()}
                      onChangeText={(text) => onChange(Number(text))}
                      onBlur={onBlur}
                    />
                  </Input>
                )}
              />
              {errors.price && (
                <FormControlError>
                  <FormControlErrorText>
                    {errors.price.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
            {/** Location */}
            <FormControl isInvalid={!!errors.location} className="w-60">
              <FormControlLabel className="flex-col flex items-start gap-2">
                <Heading size="xl">Service Location</Heading>
                <FormControlLabelText>
                  Where will you be providing this service?
                </FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="location"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    selectedValue={value}
                    onValueChange={onChange}
                    isInvalid={!!errors.location}
                    isRequired
                  >
                    <SelectTrigger>
                      <SelectInput placeholder="Choose from your registered address" />
                      <SelectIcon className="mr-3" as={ChevronDownIcon} />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        {Object.values(userData?.activeRoleId?.location || {})
                          .filter(
                            (location) =>
                              typeof location === "object" &&
                              location !== null &&
                              "address" in location &&
                              typeof location.address === "object" &&
                              location.address !== null &&
                              "address" in location.address
                          )
                          .map((location, index) => (
                            <SelectItem
                              key={index}
                              label={location.address.address}
                              value={location.address.address}
                            />
                          ))}
                      </SelectContent>

                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                    </SelectPortal>
                  </Select>
                )}
              />
              <FormControlError>
                <FormControlErrorText>address is required</FormControlErrorText>
              </FormControlError>
            </FormControl>
            <FormControl isInvalid={!!errors.description}>
              <FormControlLabel className="flex-col flex items-start gap-2">
                <Heading size="xl">Service Description</Heading>
                <FormControlLabelText>
                  Briefly explain what sets you and your Service apart.
                </FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="description"
                control={control}
                render={({
                  field: { onChange, onBlur, value },
                }: ControllerRenderType<string>) => (
                  <Textarea>
                    <TextareaInput
                      placeholder="Enter service description"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </Textarea>
                )}
              />
              {errors.description && (
                <FormControlError>
                  <FormControlErrorText>
                    {errors.description.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
            <FormControl isInvalid={selectedImages.length === 0} className="">
              <FormControlLabel className="flex-col flex items-start gap-2">
                <Heading size="xl">Service Image</Heading>
                <FormControlLabelText>
                  Upload up to 3 images (.jpg or .png), up to 10MB each and less
                  than 4,000 pixels, in width or height.
                </FormControlLabelText>
              </FormControlLabel>
              <HStack className="gap-4 grid grid-cols-3">
                {selectedImages.map((image, index) => (
                  <Card
                    key={index}
                    variant="filled"
                    className="border h-52 justify-center items-center relative"
                  >
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`Selected image ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <Button
                      className="absolute top-2 right-2 bg-red-600 data-[hover=true]:bg-red-500"
                      onPress={() => handleRemoveImage(index)}
                    >
                      <ButtonIcon as={TrashIcon} className="text-white" />
                    </Button>
                  </Card>
                ))}
                {selectedImages.length < 3 && (
                  <Card variant="filled" className="border h-52">
                    <div
                      className="text-center cursor-pointer h-52 w-full flex items-center justify-center"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                    >
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <p className="text-gray-500">
                          Drag images here or{" "}
                          <span className="text-blue-500">Click to Upload</span>
                        </p>
                      </label>
                    </div>
                  </Card>
                )}
              </HStack>
              {errors.images && (
                <FormControlError>
                  <FormControlErrorText>
                    {errors.images.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
            <Button
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="bg-blue-600 w-52 mx-auto"
            >
              <ButtonText>
                {isLoading ? (
                  <HStack space="sm">
                    <Spinner /> <Text size="md">Please Wait</Text>
                  </HStack>
                ) : (
                  "Done"
                )}
              </ButtonText>
            </Button>
          </VStack>
        </HStack>
      </VStack>
      <PreFooter />
      <Footer />
    </SafeAreaView>
  );
};

export default CreateService;
