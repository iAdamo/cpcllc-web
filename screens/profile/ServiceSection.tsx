import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Button, ButtonText } from "@/components/ui/button";

const ServiceSection = ({ companyId }: { companyId: string }) => {
  return (
    <VStack>
      <Heading className="text-text-tertiary">Services</Heading>
    </VStack>
  );
};

export default ServiceSection;
