import { useState, useEffect } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { CheckIcon, CloseIcon } from "@/components/ui/icon";
import { useOnboarding } from "@/context/OnboardingContext";
import { Subcategory } from "@/types";
import { useTranslation } from "@/context/TranslationContext";

interface SelectedSubcategory extends Subcategory {
  categoryName: string;
  categoryId: string;
}

const MAX_SERVICES = 3;

const ServicesInfo = () => {
  const { prevStep, nextStep, data, setData, categories } = useOnboarding();
  const { t } = useTranslation();

  const [selectedServices, setSelectedServices] = useState<
    SelectedSubcategory[]
  >((data.subcategories as SelectedSubcategory[]) || []);
  const [selectionLimitReached, setSelectionLimitReached] = useState(false);
  // console.log("ServicesInfo selectedServices:", data);
  useEffect(() => {
    setSelectionLimitReached(selectedServices.length >= MAX_SERVICES);
  }, [selectedServices]);

  const handleToggleSubcategory = (
    subcategory: Subcategory,
    categoryName: string,
    categoryId: string
  ): void => {
    const isAlreadySelected = selectedServices.some(
      (service) => service._id === subcategory._id
    );

    if (isAlreadySelected) {
      // Remove from selected
      handleRemoveSubcategory(subcategory._id);
    } else {
      // Add to selected (if under limit)
      if (selectedServices.length < MAX_SERVICES) {
        handleAddSubcategory(subcategory, categoryName, categoryId);
      }
    }
  };

  const handleAddSubcategory = (
    subcategory: Subcategory,
    categoryName: string,
    categoryId: string
  ): void => {
    setSelectedServices((prev: SelectedSubcategory[]) => {
      const updated = [
        ...prev,
        {
          ...subcategory,
          _id: subcategory._id, // ensure _id is present
          categoryName,
          categoryId,
        },
      ];
      setData({ subcategories: updated });
      return updated;
    });
  };

  const handleRemoveSubcategory = (subcategoryId: string): void => {
    setSelectedServices((prev: SelectedSubcategory[]) => {
      const updatedSelected = prev.filter((item) => item._id !== subcategoryId);
      setData({ subcategories: updatedSelected });
      return updatedSelected;
    });
  };

  const isSubcategorySelected = (subcategoryId: string): boolean => {
    return selectedServices.some((service) => service._id === subcategoryId);
  };

  return (
    <VStack className="w-full h-full bg-white p-8 gap-8">
      <VStack space="3xl">
        <VStack className="items-center gap-2">
          <Heading size="2xl" className="hidden md:inline text-center">
            {t("chooseServicesTitle")}
          </Heading>
          <Text
            size="sm"
            className="text-gray-600 text-center max-w-2xl mx-auto"
          >
            {`${t("chooseServicesDescription")} ${MAX_SERVICES}`}
            {selectedServices.length > 0 && (
              <Text size="sm" className="text-primary-500 font-medium">
                {" "}
                {t("selectedCount")
                  .replace("{current}", selectedServices.length.toString())
                  .replace("{max}", MAX_SERVICES.toString())}
              </Text>
            )}
          </Text>
          {selectionLimitReached && (
            <Text
              size="sm"
              className="md:bg-transparent bg-red-100 text-red-500 rounded p-2"
            >
              {t("selectionLimitReached")}
            </Text>
          )}
        </VStack>

        {/* Services List with Highlighted Selection */}
        <VStack className="w-full">
          <Heading size="sm" className="md:text-lg mb-4">
            {t("availableServices")}
          </Heading>
          {categories.map((category) => (
            <VStack key={category._id} className="mb-6">
              <Card variant="outline" className="p-4">
                <Heading size="md" className="mb-2">
                  {category.name}
                </Heading>
                {category.subcategories.length > 0 ? (
                  <HStack className="flex-wrap gap-x-4 gap-y-2">
                    {category.subcategories.map((subcategory) => {
                      const isSelected = isSubcategorySelected(subcategory._id);
                      return (
                        <Button
                          key={subcategory._id}
                          variant={isSelected ? "solid" : "outline"}
                          size="xs"
                          className={`rounded-3xl ${
                            selectionLimitReached && !isSelected
                              ? "opacity-50 cursor-not-allowed"
                              : "data-[hover=true]:bg-[#F6F6F6]"
                          } ${
                            isSelected
                              ? "bg-brand-primary data-[hover=true]:bg-brand-primary/60"
                              : ""
                          }`}
                          onPress={() =>
                            handleToggleSubcategory(
                              subcategory,
                              category.name,
                              category._id
                            )
                          }
                          disabled={selectionLimitReached && !isSelected}
                        >
                          {isSelected ? (
                            <>
                              <ButtonIcon
                                as={CloseIcon}
                                className="text-white"
                              />
                              <ButtonText className="text-white">
                                {subcategory.name}
                              </ButtonText>
                            </>
                          ) : (
                            <>
                              <ButtonIcon as={CheckIcon} />
                              <ButtonText>{subcategory.name}</ButtonText>
                            </>
                          )}
                        </Button>
                      );
                    })}
                  </HStack>
                ) : (
                  <Text className="text-sm text-gray-400">
                    {t("noSubcategories")}
                  </Text>
                )}
              </Card>
            </VStack>
          ))}
        </VStack>
      </VStack>

      <HStack className="ml-auto gap-8 mt-auto">
        <Button variant="outline" onPress={prevStep}>
          <ButtonText>{t("back")}</ButtonText>
        </Button>
        <Button
          onPress={nextStep}
          disabled={selectedServices.length === 0}
          className={`${
            selectedServices.length === 0
              ? "bg-gray-300 cursor-not-allowed"
              : ""
          }`}
        >
          <ButtonText>{t("continue")}</ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
};

export default ServicesInfo;
