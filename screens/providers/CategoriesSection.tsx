import { useState, useEffect, useMemo } from "react";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionContent,
  AccordionIcon,
} from "@/components/ui/accordion";
import { Button, ButtonText } from "@/components/ui/button";
import { getAllCategoriesWithSubcategories } from "@/axios/service";
import useGlobalStore from "@/stores";
import { Category, Subcategory, SubcategoryData } from "@/types";
import { SvgXml } from "react-native-svg";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

const CategoriesSection = () => {
  const [view, viewAll] = useState(false);
  const {
    categories,
    selectedSubcategories,
    toggleSubcategory,
    setCategories,
    error,
  } = useGlobalStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (categories?.length > 0 || error === "terms error") return;
    const fetchCategories = async () => {
      // console.log("Fetching categories...");
      const data = await getAllCategoriesWithSubcategories();
      // print th data color
      setCategories(data);
    };
    fetchCategories();
  });

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return categories.filter(
        (cat) => cat.subcategories && cat.subcategories.length > 0
      );
    }

    const query = searchQuery.toLowerCase().trim();

    return categories
      .map((category) => {
        // Create a Set to ensure unique subcategories
        const subcategorySet = new Map();
        (category.subcategories || []).forEach((sub) => {
          subcategorySet.set(sub._id, sub);
        });

        const filteredSubcategories = Array.from(
          subcategorySet.values()
        ).filter((sub) => sub.name.toLowerCase().includes(query));

        if (filteredSubcategories.length > 0) {
          return {
            ...category,
            subcategories: filteredSubcategories,
          };
        }

        if (category.name.toLowerCase().includes(query)) {
          return {
            ...category,
            subcategories: category.subcategories || [],
          };
        }

        return null;
      })
      .filter(Boolean) as Category[];
  }, [categories, searchQuery]);
  const allSubcategories: Subcategory[] = useMemo(
    () => categories.flatMap((c) => c.subcategories || []),
    [categories]
  );
  const isSelected = (id: string) =>
    selectedSubcategories.some((s) => s._id === id);

  return (
    <Skeleton
      variant="rounded"
      startColor="bg-green-500"
      className="w-full rounded-sm"
      isLoaded={!!filteredCategories}
    >
      <VStack className="w-full bg-green-500 gap-6 items-start">
        <Heading size="md">Categories</Heading>
        <Accordion size="md" variant="unfilled" type="single" className="gap-2">
          {filteredCategories
            .slice(0, view ? filteredCategories.length : 4)
            .map((category: Category, idx) => (
              <AccordionItem key={idx} value={category._id} className="">
                <AccordionHeader className="bg-white border-gray-300 rounded-lg">
                  <AccordionTrigger>
                    <AccordionTitleText className="font-semibold text-sm">
                      {category.name}
                    </AccordionTitleText>
                    <AccordionIcon as={null} className="ml-3" />
                    <Text className="font-light text-xs">
                      {category.subcategories.length}
                    </Text>
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent className="gap-2">
                  {category.subcategories.map((subcategory, sub_idx) => (
                    <Pressable
                      key={sub_idx}
                      className="flex flex-row items-center p-2 rounded-lg bg-white"
                    >
                      {subcategory.icon && (
                        <SvgXml
                          xml={subcategory.icon}
                          width={20}
                          height={20}
                          fill={subcategory.iconColor}
                          color="#162660"
                          style={{ marginRight: 8 }}
                        />
                      )}
                      <Text className="text-xs">{subcategory.name}</Text>
                    </Pressable>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          <Button
            size="sm"
            variant="outline"
            onPress={() => viewAll(!view)}
            className="bg-white border-gray-300 hover:border-gray-300"
          >
            <ButtonText className="text-brand-primary">
              {view ? "View less" : "View all categories"}
            </ButtonText>
          </Button>
        </Accordion>
      </VStack>
    </Skeleton>
  );
};

export default CategoriesSection;
