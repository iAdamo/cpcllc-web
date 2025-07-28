import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Button, ButtonText } from "@/components/ui/button";
import Image from "next/image";

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
      <Heading className="text-text-tertiary">New Updates</Heading>
      <VStack className="gap-4">
        {newUpdates.map((update) => (
          <Card key={update.id} className="p-4 gap-2">
            <Heading size="md" className="text-typography-600">{update.title}</Heading>
            <Text size="sm" className="text-text-secondary line-clamp-3 ">{update.description}</Text>
            <Heading size="xs" className="w-fit py-2 px-4 rounded-full bg-gray-200 text-text-tertiary">
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
              Posted on: {new Date(update.date).toLocaleDateString()}
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
