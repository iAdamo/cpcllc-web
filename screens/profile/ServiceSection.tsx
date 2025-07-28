import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Button, ButtonText } from "@/components/ui/button";

const ServiceSection = ({ companyId }: { companyId: string }) => {
  const newUpdates = [
    {
      title: "New Feature Release",
      description: "We have launched a new feature that enhances user experience.",
      image: "https://example.com/image1.jpg",
      date: "2024-01-15",
    }
  ]
  return (
    <VStack>
      <Heading className="text-text-tertiary">New Updates</Heading>

    </VStack>
  );
};

export default ServiceSection;
