import Link from "next/link";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const Categories = () => {
  const categories = [
    {
      title: "Search Marketing",
      image: "#",
      url: "",
    },
    {
      title: "Social Media Marketing",
      image: "#",
      url: "",
    },
    {
      title: "Channel-Specific Marketing",
      image: "#",
      url: "",
    },
    {
      title: "Industry & Purpose-Specific Marketing",
      image: "#",
      url: "",
    },
    {
      title: "E-Commerce Marketing & Management",
      image: "#",
      url: "",
    },
    {
      title: "Content Marketing & Copywriting",
      image: "#",
      url: "",
    },
    {
      title: "Video & Multimedia Marketing",
      image: "#",
      url: "",
    },
    {
      title: "Web Design & Development",
      image: "#",
      url: "",
    },
    {
      title: "Marketing Design & Branding",
      image: "#",
      url: "",
    },
    {
      title: "Analytics & Strategy",
      image: "#",
      url: "",
    },
    {
      title: "Operations & Business Consulting",
      image: "#",
      url: "",
    },
    {
      title: "Sales & Customer Care",
      image: "#",
      url: "",
    },
    {
      title: "Tech & Marketing Consulting",
      image: "#",
      url: "",
    },
  ];
  return (
    <VStack className="md:p-10 md:mt-4 p-4 md:mx-14 gap-4 rounded-3xl">
      <HStack className="flex-wrap justify-center md:gap-4 gap-2 rounded-lg">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={category.title}
            className="md:w-44 md:h-44 w-24 transform transition-transform duration-300 hover:scale-105"
          >
            <Card className="md:pt-4 p-1 md:w-44 md:h-44  justify-between rounded-lg shadow-hard-5">
              <HStack className="justify-center items-center">
                <Image
                  className="md:w-24 md:h-24 w-20 h-20 "
                  src={category.image}
                  alt={category.title}
                  width={100}
                  height={100}
                />
              </HStack>
              <HStack className="">
                <Text className="hidden md:block text-center text-md font-bold">
                  {category.title}
                </Text>
              </HStack>
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
