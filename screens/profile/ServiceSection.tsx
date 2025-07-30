import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import Image from "next/image";
import { AddIcon } from "@/components/ui/icon";

const ServiceSection = ({ companyId }: { companyId: string }) => {
  const newUpdates = [
    {
      id: "1",
      title: "New Electrical Service Available",
      description:
        "We are now offering comprehensive electrical services including installation, repair, and maintenance.",
      category: "Electrical",
      image: "/assets/header10.jpg",
      date: "2024-01-15",
    },
    {
      id: "2",
      title: "Plumbing Service Expansion",
      description:
        "Our plumbing services have expanded to include emergency repairs and routine maintenance.",
      category: "Plumbing",
      image: "/assets/header10.jpg",
      date: "2024-01-20",
    },
    {
      id: "3",
      title: "New HVAC Solutions",
      description:
        "Introducing new HVAC solutions for both residential and commercial properties.",
      category: "HVAC",
      image: "/assets/header10.jpg",
      date: "2024-01-25",
    },
  ];
  return (
    <VStack>
      <Button className="mb-4 h-16 px-2 bg-brand-secondary data-[hover=true]:bg-brand-primary">
        <ButtonIcon as={AddIcon} />
        <ButtonText size="sm" className="">What&apos;s New In Your Service</ButtonText>
      </Button>
      <VStack className="gap-4 drop-shadow-2xl">
        {newUpdates.map((update) => (
          <Card key={update.id} className="p-4 gap-2">
            <Heading size="md" className="text-typography-600">
              {update.title}
            </Heading>
            <Text size="sm" className="text-text-secondary line-clamp-3 ">
              {update.description}
            </Text>
            <Heading
              size="xs"
              className="w-fit py-2 px-4 rounded-full bg-gray-200 text-text-tertiary"
            >
              {update.category}
            </Heading>
            <Image
              src={update.image}
              alt={update.title}
              width={1300}
              height={1000}
              className="object-cover h-40 rounded-md"
            />
            <Text className="text-text-tertiary mt-2">
              {new Date(update.date).toLocaleDateString()}
            </Text>
          </Card>
        ))}
        <Button className="mt-4">
          <ButtonText>View All Updates</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
};

export default ServiceSection;
