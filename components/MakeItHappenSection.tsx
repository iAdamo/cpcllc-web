import {
  HStack,
  VStack,
  Card,
  Button,
  Heading,
  Text,
  ButtonText,
} from "@/components/ui";
import Image from "next/image";
import { categories, matching, quickly, happy } from "@/public/assets/icons";

const MakeItHappenSection = () => {
  return (
    <VStack className="mx-4 my-10">
      <HStack className="py-8">
        <Heading size="xl">
          Make it all happen with our marketing strategies
        </Heading>
      </HStack>
      <HStack className="flex-wrap justify-between">
        <Card className="w-60 flex-row md:flex-col gap-4">
          <Image src={categories} alt="first" width={60} height={60} />
          <Text>Access a pool of top talent across 700 categories</Text>
        </Card>
        <Card className="w-60 flex-row md:flex-col gap-4">
          <Image src={matching} alt="first" width={60} height={60} />
          <Text>Access our strategies</Text>
        </Card>
        <Card className="w-60 flex-row md:flex-col gap-4">
          <Image src={quickly} alt="first" width={60} height={60} />
          <Text>Access our strategies</Text>
        </Card>
        <Card className="w-60 flex-row md:flex-col gap-4">
          <Image src={happy} alt="first" width={60} height={60} />
          <Text>Access our strategies</Text>
        </Card>
      </HStack>
      <HStack className="md:justify-center my-10">
        <Button className="bg-yellow-500 data-[hover=true]:bg-yellow-400 data-[active=true]:bg-yellow-300 ">
          <ButtonText>Let&apos;s Make It Happen</ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
};

export default MakeItHappenSection;
