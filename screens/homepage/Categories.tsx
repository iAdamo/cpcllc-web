import Link from "next/link";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Button, ButtonText } from "@/components/ui/button";
import Image from "next/image";
import { cleaning, electrical, hvac, plumbing } from "@/public/assets/icons";

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
      title: "E-Commerce Marketing & Management",
      image: electrical,
      url: "",
    },
    {
      title: "Content Marketing & Copywriting",
      image: electrical,
      url: "",
    },
    {
      title: "Video & Multimedia Marketing",
      image: electrical,
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
      title: "E-Commerce Marketing & Management",
      image: electrical,
      url: "",
    },
    {
      title: "Content Marketing & Copywriting",
      image: electrical,
      url: "",
    },
    {
      title: "Video & Multimedia Marketing",
      image: electrical,
      url: "",
    },
    {
      title: "Web Design & Development",
      image: electrical,
      url: "",
    },
    {
      title: "Marketing Design & Branding",
      image: electrical,
      url: "",
    },
    {
      title: "Analytics & Strategy",
      image: electrical,
      url: "",
    },
    {
      title: "Operations & Business Consulting",
      image: electrical,
      url: "",
    },
    {
      title: "Sales & Customer Care",
      image: electrical,
      url: "",
    },
    {
      title: "Tech & Marketing Consulting",
      image: electrical,
      url: "",
    },
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
      title: "E-Commerce Marketing & Management",
      image: electrical,
      url: "",
    },
    {
      title: "Content Marketing & Copywriting",
      image: electrical,
      url: "",
    },
    {
      title: "Video & Multimedia Marketing",
      image: electrical,
      url: "",
    },
    {
      title: "Web Design & Development",
      image: electrical,
      url: "",
    },
    {
      title: "Marketing Design & Branding",
      image: electrical,
      url: "",
    },
    {
      title: "Analytics & Strategy",
      image: electrical,
      url: "",
    },
    {
      title: "Operations & Business Consulting",
      image: electrical,
      url: "",
    },
    {
      title: "Sales & Customer Care",
      image: electrical,
      url: "",
    },
    {
      title: "Tech & Marketing Consulting",
      image: electrical,
      url: "",
    },
  ];
  return (
    <VStack className="md:px-12 px-6 gap-4 ">
      <Heading size="md" className="md:text-2xl">
        Home Services
      </Heading>
      <HStack className="hidden md:flex flex-wrap gap-4 justify-between rounded-lg">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={category.title}
            className="w-36 h-36 text-center rounded-lg transform transition-transform duration-300 hover:scale-105"
          >
            <Card className="pt-4 p-1 w-36 h-36 justify-between rounded-lg shadow-hard-5">
              <HStack className="justify-center items-center">
                <Image
                  className="w-20 h-20"
                  src={category.image}
                  alt={category.title}
                  width={100}
                  height={100}
                />
              </HStack>
              <Text className="text-center text-sm font-bold">
                {category.title}
              </Text>
            </Card>
          </Link>
        ))}
      </HStack>
      {/**mobile */}
      <HStack className="md:hidden flex-wrap justify-between items-center gap-1 rounded-lg">
        {mcategories.map((category, index) => (
          <Link
            key={index}
            href={category.title}
            className="w-20 text-center rounded-lg transform transition-transform duration-300 hover:scale-105"
          >
            <Card className="p-1 justify-between rounded-sm">
              <HStack className="justify-center items-center">
                <Image
                  className="w-14 h-14"
                  src={category.image}
                  alt={category.title}
                  width={100}
                  height={100}
                />
              </HStack>
            </Card>
            <Text className="text-xs">{category.title}</Text>
          </Link>
        ))}
        <Button variant="outline" className="flex-col border-none">
          <ButtonText className="font-normal text-sm">...</ButtonText>
          <ButtonText className="font-normal text-sm">More</ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
};

export default Categories;
