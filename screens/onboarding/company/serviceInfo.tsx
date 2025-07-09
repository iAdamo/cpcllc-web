import { useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { CheckIcon, CloseIcon } from "@/components/ui/icon";
import { useOnboarding } from "@/context/OnboardingContext";
import { ServiceCategory, Subcategory } from "@/types";

interface SelectedSubcategory extends Subcategory {
  categoryName: string;
}

const ServicesInfo = () => {
  const { prevStep, nextStep, data, setData, categories } = useOnboarding();
  const [selectedServices, setSelectedSubcategory] = useState<
    SelectedSubcategory[]
  >((data.subcategories as SelectedSubcategory[]) || []);
  const [availableCategories, setAvailableCategories] = useState<
    ServiceCategory[]
  >([
    ...(categories || []).map((category) => ({
      id: category.id,
      name: category.name,
      subcategories: category.subcategories.map((subcategory) => ({
        id: subcategory.id,
        name: subcategory.name,
      })),
    })),
  ]);

  const handleSelectSubcategory = (
    subcategory: Subcategory,
    categoryName: string
  ): void => {
    const subcategoryId = subcategory.id;

    // Remove from available
    setAvailableCategories((prev: ServiceCategory[]) =>
      prev.map((category) => ({
        ...category,
        subcategories: category.subcategories.filter((item) => item.id !== subcategoryId),
      }))
    );

    // Add to selected with categoryName
    setSelectedSubcategory((prev: SelectedSubcategory[]) => {
      const updated = [...prev, { ...subcategory, categoryName }];
      setData({
        subcategories: updated,
      });
      return updated;
    });
  };

  const handleRemoveSubcategory = (subcategory: SelectedSubcategory): void => {
    const subcategoryId = subcategory.id;

    // Remove from selected
    setSelectedSubcategory((prev: SelectedSubcategory[]) => {
      const updated = prev.filter((item) => item.id !== subcategoryId);
      setData({ subcategories: updated });
      return updated;
    });

    // Restore to original category
    setAvailableCategories((prev: ServiceCategory[]) =>
      prev.map((category) =>
        category.name === subcategory.categoryName
          ? {
              ...category,
              subcategories: [
                ...category.subcategories,
                { id: subcategory.id, name: subcategory.name },
              ],
            }
          : category
      )
    );
  };

  return (
    <VStack className="w-full h-screen bg-white p-8 gap-8">
      <VStack space="3xl">
        <Heading size="2xl" className="text-center">
          Choose Specialized Company Services
        </Heading>
        <Text className="text-gray-600 text-sm text-center">
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
            <Heading size="lg" className="mb-4">
              Available Services
            </Heading>
            {availableCategories.map((category, categoryIndex) => (
              <VStack key={categoryIndex} className="mb-6">
                <Card variant="outline" className="p-4">
                  <Heading size="md" className="mb-2">
                    {category.name}
                  </Heading>
                  {category.subcategories.length > 0 ? (
                    <HStack className="flex-wrap gap-x-4 gap-y-2">
                      {category.subcategories.map((subcategory, subcategoryIndex) => (
                        <Button
                          key={subcategoryIndex}
                          variant="outline"
                          size="xs"
                          className="data-[hover=true]:bg-[#F6F6F6] rounded-3xl"
                          onPress={() =>
                            handleSelectSubcategory(subcategory, category.name)
                          }
                        >
                          <ButtonIcon as={CheckIcon} />
                          <ButtonText>{subcategory.name}</ButtonText>
                        </Button>
                      ))}
                    </HStack>
                  ) : (
                    <Text className="text-sm text-gray-400">
                      No subcategories available
                    </Text>
                  )}
                </Card>
              </VStack>
            ))}
          </VStack>
          {/* Selected Services */}
          {selectedServices.length > 0 && (
            <VStack className="w-3/5 h-full">
              <Heading size="lg" className="mb-4">
                Selected Services
              </Heading>
              <Card variant="outline" className="flex-row flex-wrap gap-2 p-4">
                {selectedServices.map((subcategory, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="xs"
                    className="bg-[#F6F6F6] rounded-3xl"
                    onPress={() => handleRemoveSubcategory(subcategory)}
                  >
                    <ButtonIcon as={CloseIcon} />
                    <ButtonText>{subcategory.name}</ButtonText>
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
