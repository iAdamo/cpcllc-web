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
      image: "/assest/homepage/categ1",
      url: "",
    },
    {
      title: "Social Media Marketing",
      image: "/assest/homepage/categ1",
      url: "",
    },
    {
      title: "Channel-Specific Marketing",
      image: "/assest/homepage/categ1",
      url: "",
    },
    {
      title: "Industry & Purpose-Specific Marketing",
      image: "/assest/homepage/categ1",
      url: "",
    },
    {
      title: "E-Commerce Marketing & Management",
      image: "/assest/homepage/categ1",
      url: "",
    },
    {
      title: "Content Marketing & Copywriting",
      image: "/assest/homepage/categ1",
      url: "",
    },
    {
      title: "Video & Multimedia Marketing",
      image: "/assest/homepage/categ1",
      url: "",
    },
    {
      title: "Web Design & Development",
      image: "/assest/homepage/categ1",
      url: "",
    },
    {
      title: "Marketing Design & Branding",
      image: "/assest/homepage/categ1",
      url: "",
    },
    {
      title: "Analytics & Strategy",
      image: "/assest/homepage/categ1",
      url: "",
    },
    {
      title: "Operations & Business Consulting",
      image: "/assest/homepage/categ1",
      url: "",
    },
    {
      title: "Sales & Customer Care",
      image: "/assest/homepage/categ1",
      url: "",
    },
    {
      title: "Tech & Marketing Consulting",
      image: "/assest/homepage/categ1",
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
