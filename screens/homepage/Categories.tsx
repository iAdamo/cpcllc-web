import { HStack, VStack, Card, Text, Pressable } from "@/components/ui";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Categories = () => {
  const router = useRouter();

  const handleCategoryClick = (category: string) => {
    category = category.toLowerCase().replace(" ", "-");
    router.push(`/categories/${category}`);
  };
{

}
 const categories = [
   {
     title: "Search Marketing",
     image: "/assets/homepage/icon-deal.png",
     url: "",
   },
   {
     title: "Social Media Marketing",
     image: "/assets/homepage/icon-deal.png",
     url: "",
   },
   {
     title: "Channel-Specific Marketing",
     image: "/assets/homepage/icon-deal.png",
     url: "",
   },
   {
     title: "Industry & Purpose-Specific Marketing",
     image: "/assets/homepage/icon-deal.png",
     url: "",
   },
   {
     title: "E-Commerce Marketing & Management",
     image: "/assets/homepage/icon-deal.png",
     url: "",
   },
   {
     title: "Content Marketing & Copywriting",
     image: "/assets/homepage/icon-deal.png",
     url: "",
   },
   {
     title: "Video & Multimedia Marketing",
     image: "/assets/homepage/icon-deal.png",
     url: "",
   },
   {
     title: "Web Design & Development",
     image: "/assets/homepage/icon-deal.png",
     url: "",
   },
   {
     title: "Marketing Design & Branding",
     image: "/assets/homepage/icon-deal.png",
     url: "",
   },
   {
     title: "Analytics & Strategy",
     image: "/assets/homepage/icon-deal.png",
     url: "",
   },
   {
     title: "Operations & Business Consulting",
     image: "/assets/homepage/icon-deal.png",
     url: "",
   },
   {
     title: "Sales & Customer Care",
     image: "/assets/homepage/icon-deal.png",
     url: "",
   },
   {
     title: "Tech & Marketing Consulting",
     image: "/assets/homepage/icon-deal.png",
     url: "",
   },
 ];
  return (
    <VStack className="md:p-10 md:mt-4 p-4 md:mx-14 gap-4 rounded-3xl">
      <HStack className="flex-wrap justify-center md:gap-4 gap-2 rounded-lg">
        {categories.map((category, index) => (
          <Pressable
            key={index}
            onPress={() => handleCategoryClick(category.title)}
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
          </Pressable>
        ))}
      </HStack>
    </VStack>
  );
};

export default Categories;
