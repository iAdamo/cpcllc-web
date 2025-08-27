import { useState, useEffect } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { CheckIcon, CloseIcon } from "@/components/ui/icon";
import { useOnboarding } from "@/context/OnboardingContext";
import { ServiceCategory, Subcategory } from "@/types";
import { useTranslation } from "@/context/TranslationContext"; // Add this import

interface SelectedSubcategory extends Subcategory {
  categoryName: string;
}

const MAX_SERVICES = 3;

const ServicesInfo = () => {
  const { prevStep, nextStep, data, setData, categories } = useOnboarding();
  const { t } = useTranslation(); // Add this hook

  const [selectedServices, setSelectedSubcategory] = useState<
    SelectedSubcategory[]
  >((data.subcategories as SelectedSubcategory[]) || []);
  const [availableCategories, setAvailableCategories] = useState<
    ServiceCategory[]
  >(
    (data.availableCategories as ServiceCategory[]) ||
      categories.map((category) => ({
        ...category,
        subcategories: category.subcategories.filter(
          (subcategory: Subcategory) =>
            !selectedServices.some((selected) => selected.id === subcategory.id)
        ),
      }))
  );
  const [selectionLimitReached, setSelectionLimitReached] = useState(false);

  useEffect(() => {
    setSelectionLimitReached(selectedServices.length >= MAX_SERVICES);
  }, [selectedServices]);

  const handleSelectSubcategory = (
    subcategory: Subcategory,
    categoryName: string
  ): void => {
    if (selectedServices.length >= MAX_SERVICES) return;

    const subcategoryId = subcategory.id;

    // Remove from available
    setAvailableCategories((prev: ServiceCategory[]) => {
      const updatedCategories = prev.map((category) => ({
        ...category,
        subcategories: category.subcategories.filter(
          (item) => item.id !== subcategoryId
        ),
      }));
      setData({ availableCategories: updatedCategories });
      return updatedCategories;
    });

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
      const updatedSelected = prev.filter((item) => item.id !== subcategoryId);
      setData({ subcategories: updatedSelected });
      return updatedSelected;
    });

    // Restore to original category
    setAvailableCategories((prev: ServiceCategory[]) => {
      const updatedCategories = prev.map((category) =>
        category.name === subcategory.categoryName
          ? {
              ...category,
              subcategories: [
                ...category.subcategories,
                { id: subcategory.id, name: subcategory.name },
              ],
            }
          : category
      );

      setData({ availableCategories: updatedCategories });
      return updatedCategories;
    });
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

        <VStack className="md:flex-row flex-col-reverse h-full gap-4">
          {/* Available Services */}
          <VStack
            className={`${
              selectedServices.length > 0 ? "md:w-3/5 w-full" : "w-full"
            } h-full`}
          >
            <Heading size="sm" className="md:text-lg mb-4">
              {t("availableServices")}
            </Heading>
            {availableCategories.map((category, categoryIndex) => (
              <VStack key={categoryIndex} className="mb-6">
                <Card variant="outline" className="p-4">
                  <Heading size="md" className="mb-2">
                    {category.name}
                  </Heading>
                  {category.subcategories.length > 0 ? (
                    <HStack className="flex-wrap gap-x-4 gap-y-2">
                      {category.subcategories.map(
                        (subcategory, subcategoryIndex) => (
                          <Button
                            key={subcategoryIndex}
                            variant="outline"
                            size="xs"
                            className={`rounded-3xl ${
                              selectionLimitReached
                                ? "opacity-50 cursor-not-allowed"
                                : "data-[hover=true]:bg-[#F6F6F6]"
                            }`}
                            onPress={() =>
                              !selectionLimitReached &&
                              handleSelectSubcategory(
                                subcategory,
                                category.name
                              )
                            }
                            disabled={selectionLimitReached}
                          >
                            <ButtonIcon as={CheckIcon} />
                            <ButtonText>{subcategory.name}</ButtonText>
                          </Button>
                        )
                      )}
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

          {/* Selected Services */}
          {selectedServices.length > 0 && (
            <VStack className="md:w-3/5 w-full h-full">
              <Heading size="sm" className="md:text-lg mb-4">
                {t("selectedServices")}
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
