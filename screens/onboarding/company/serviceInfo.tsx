import { useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { CheckIcon, CloseIcon } from "@/components/ui/icon";
import { useOnboarding } from "@/context/OnboardingContext";

const ServicesInfo = () => {
  const { prevStep, nextStep, setData, data } = useOnboarding();

  const [availableServices, setAvailableServices] = useState([
    { category: "Plumbing" },
    { category: "Electrical" },
    { category: "Cleaning" },
    { category: "Landscaping" },
    { category: "HVAC" },
    { category: "Painting" },
    { category: "Pest Control" },
    { category: "Roofing" },
    { category: "Moving" },
    { category: "Home Security" },
    { category: "Appliance Repair" },
    { category: "Carpentry" },
    { category: "Flooring" },
    { category: "Window Installation" },
    { category: "Garage Door Services" },
    { category: "Handyman" },
    { category: "Interior Design" },
    { category: "Pool Services" },
    { category: "Solar Panel Installation" },
    { category: "Fencing" },
    { category: "Masonry" },
    { category: "Gutter Services" },
    { category: "Waterproofing" },
    { category: "Foundation Repair" },
    { category: "Septic Services" },
    { category: "Snow Removal" },
    { category: "Junk Removal" },
    { category: "Tree Services" },
    { category: "Pressure Washing" },
  ]);

  const [selectedServices, setSelectedServices] = useState(
    data.selectedServices || []
  );

  const handleSelectService = (service) => {
    const category = service.category;

    setAvailableServices((prev) =>
      prev.filter((item) => item.category !== category)
    );

    setSelectedServices((prev) => {
      const updated = [...prev, category];
      setData({ selectedServices: updated });
      return updated;
    });
  };

  const handleRemoveService = (category) => {
    setSelectedServices((prev) => prev.filter((item) => item !== category));
    setAvailableServices((prev) => [
      ...prev,
      { category },
    ]);
  };

  return (
    <VStack className="w-full h-screen bg-white p-8 gap-8">
      <VStack space="3xl">
        <Heading size="2xl">Choose Specialized Company Services</Heading>
        <Text className="text-gray-600 text-sm">
          Selecting specialized services helps us better understand your
          company&apos;s expertise and ensures that customers can easily find
          and connect with you for the services you offer.
        </Text>
        <VStack className="flex-row h-full gap-4">
          {/* Available Services */}
          <VStack
            className={`${
              selectedServices.length > 0 ? "w-3/5" : "w-full"
            } h-full`}
          >
            <Card
              variant="outline"
              className="flex-row flex-wrap gap-x-4 gap-y-2"
            >
              {availableServices.map((service, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="xs"
                  className="data-[hover=true]:bg-[#F6F6F6] rounded-3xl"
                  onPress={() => handleSelectService(service)}
                >
                  <ButtonIcon as={CheckIcon} />
                  <ButtonText>{service.category}</ButtonText>
                </Button>
              ))}
            </Card>
          </VStack>
          {/* Selected Services */}
          {selectedServices.length > 0 && ( // Conditionally render the card
            <VStack className="w-3/5 h-full">
              <Card variant="outline" className="flex-row flex-wrap gap-2">
                {selectedServices.map((category, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="xs"
                    className="bg-[#F6F6F6] rounded-3xl"
                    onPress={() => handleRemoveService(category)}
                  >
                    <ButtonIcon as={CloseIcon} />
                    <ButtonText>{category.toString()}</ButtonText>
                  </Button>
                ))}
              </Card>
            </VStack>
          )}
        </VStack>
      </VStack>
      <HStack className="ml-auto gap-8 mt-auto">
        <Button variant="outline" onPress={prevStep}>
          <ButtonText>Back</ButtonText>
        </Button>
        <Button
          onPress={nextStep}
          disabled={selectedServices.length === 0}
          className={`${
            selectedServices.length === 0 && "bg-gray-300 cursor-not-allowed"
          }`}
        >
          <ButtonText>Continue</ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
};

export default ServicesInfo;
