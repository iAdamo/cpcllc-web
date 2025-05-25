import Link from "next/link";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { cleaning, electrical, hvac, plumbing } from "@/public/assets/icons";

const Categories = () => {
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
    <VStack className="px-12 gap-4 ">
      <Heading size="xl">Home Services</Heading>
      <HStack className="flex-wrap md:gap-4 justify-between gap-2 rounded-lg">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={category.title}
            className="md:w-36 md:h-36 w-24 rounded-lg transform transition-transform duration-300 hover:scale-105"
          >
            <Card className="md:pt-4 p-1 md:w-36 md:h-36 justify-between rounded-lg shadow-hard-5">
              <HStack className="justify-center items-center">
                <Image
                  className="md:w-20 md:h-20 w-20 h-20"
                  src={category.image}
                  alt={category.title}
                  width={100}
                  height={100}
                />
              </HStack>
              <Text className="hidden md:inline text-center text-sm font-bold">
                {category.title}
              </Text>
            </Card>
            <Text className="md:hidden text-center  text-xs font-semibold">
              {category.title}
            </Text>
          </Link>
        ))}
      </HStack>
    </VStack>
  );
};

export default Categories;
