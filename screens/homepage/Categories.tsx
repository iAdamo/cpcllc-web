import Link from "next/link";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Button, ButtonText } from "@/components/ui/button";
import Image from "next/image";
import {
  cleaning,
  electrical,
  hvac,
  painting,
  pestcontrol,
  plumbing,
  roofing,
  poolservice,
  solar,
  moving,
  security,
  appliance_repair,
  capentry,
  flooring,
  handyman,
} from "@/public/assets/icons";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/context/TranslationContext";
// import { searchCompanies } from "@/axios/users";
// import CompaniesSection from "../companies/CompaniesSection";

const Categories = () => {
  const mcategories = [
    {
      title: "Plumbing",
      image: plumbing,
      url: "",
    },
    {
      title: "Electrical",
      image: electrical,
      url: "",
    },
    {
      title: "Cleaning",
      image: cleaning,
      url: "",
    },
    {
      title: "HVAC",
      image: hvac,
      url: "",
    },
    {
      title: "Painting",
      image: painting,
      url: "",
    },
    {
      title: "Pest Control",
      image: pestcontrol,
      url: "",
    },
    {
      title: "Roofing",
      image: roofing,
      url: "",
    },
  ];
  const categories = [
    {
      title: "Plumbing",
      image: plumbing,
      url: "",
    },
    {
      title: "Electrical",
      image: electrical,
      url: "",
    },
    {
      title: "Cleaning",
      image: cleaning,
      url: "",
    },
    {
      title: "HVAC",
      image: hvac,
      url: "",
    },
    {
      title: "Painting",
      image: painting,
      url: "",
    },
    {
      title: "Pest Control",
      image: pestcontrol,
      url: "",
    },
    {
      title: "Roofing",
      image: roofing,
      url: "",
    },
    {
      title: "Pool Service",
      image: poolservice,
      url: "",
    },
    {
      title: "Solar Panel Installation",
      image: solar,
      url: "",
    },
    {
      title: "Moving",
      image: moving,
      url: "",
    },
    {
      title: "Home Security",
      image: security,
      url: "",
    },
    {
      title: "Appliance Repair",
      image: appliance_repair,
      url: "",
    },
    {
      title: "Capentry",
      image: capentry,
      url: "",
    },
    {
      title: "Flooring",
      image: flooring,
      url: "",
    },
    {
      title: "Handyman",
      image: handyman,
      url: "",
    },
  ];
  const router = useRouter();

  const { t } = useTranslation();

  const handleCategoryClick = (categoryTitle: string) => {
    // Redirect to the CompaniesSection page with the category title as a query parameter
    router.push(`/companies?category=${encodeURIComponent(categoryTitle)}`);
  };

  return (
    <VStack className="md:px-12 px-4 gap-4 pt-24 md:pt-0 ">
      <Heading size="md" className="md:text-2xl">
        {t("homeServices")}
      </Heading>
      <HStack className="hidden md:grid grid-cols-7 rounded-lg">
        {categories.map((category, index) => (
          <Pressable
            key={index}
            // href={category.title.toLowerCase().replace("&", "")}
            className="aspect-square text-center rounded-lg transform transition-transform duration-300 hover:scale-105"
            onPress={() => handleCategoryClick(category.title)}
          >
            <Card className="pt-4 p-1 w-36 h-36 justify-between rounded-lg shadow-hard-5">
              <HStack className="justify-center items-center">
                <Image
                  className="w-20 h-20"
                  src={category.image}
                  alt={category.title}
                  width={200}
                  height={200}
                  priority
                />
              </HStack>
              <Text className="text-center text-sm font-bold">
                {category.title}
              </Text>
            </Card>
          </Pressable>
        ))}
        <Button
          variant="outline"
          onPress={() => {
            router.push("companies/home-services");
          }}
          className="flex-col justify-center items-center h-full border-none"
        >
          <ButtonText className="text-typography-600">More...</ButtonText>
        </Button>
      </HStack>
      {/**mobile */}
      <Card
        variant="filled"
        className="md:hidden grid grid-cols-4 items-center gap-2"
      >
        {mcategories.map((category, index) => (
          <Link
            key={index}
            href={category.title}
            className="aspect-square text-center rounded-lg transform transition-transform duration-300 hover:scale-105"
          >
            <Card className="bg-[#1E40AF10] p-2 justify-center items-center">
              <Image
                className="w-14 h-14"
                src={category.image}
                alt={category.title}
                width={100}
                height={100}
                priority
              />
            </Card>
            <Text className="text-xs">{category.title}</Text>
          </Link>
        ))}
        <Button variant="outline" className="flex-col border-none">
          <ButtonText className="font-normal text-sm text-typography-600">
            ...
          </ButtonText>
          <ButtonText className="font-normal text-sm text-typography-600">
            More
          </ButtonText>
        </Button>
      </Card>
    </VStack>
  );
};

export default Categories;
