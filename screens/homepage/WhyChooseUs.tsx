import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { categories, matching, quickly } from "@/public/assets/icons";

const whyChooseUsData = [
  {
    icon: categories,
    title: "Extensive Network",
    description:
      "Connect with top companies and professionals in various industries.",
  },
  {
    icon: matching,
    title: "Job Opportunities",
    description:
      "Find the best job opportunities that match your skills and interests.",
  },
  {
    icon: quickly,
    title: "Trust and Reviews",
    description:
      "Read reviews and ratings from other users to make informed decisions.",
  },
];

const WhyChooseUs = () => {
  const router = useRouter();

  return (
    <VStack className="md:flex md:mx-20 px-4 my-10 md:rounded-xl bg-text-primary">
      <Heading size="md" className="md:text-2xl pr-20 py-8 md:text-center">
        Why businesses turn to CompaniesCenterLLC
      </Heading>
      <VStack className="md:flex-row md:px-10 flex-wrap justify-between gap-2">
        {whyChooseUsData.map((item, index) => (
          <Card
            key={index}
            className="md:w-60 h-24 md:h-auto flex-row md:flex-col gap-4"
          >
            <Image src={item.icon} alt={item.title} width={60} height={60} />
            <Heading size="sm" className="md:text-lg">
              {item.title}
            </Heading>
            <Text size="sm" className="md:text-md">
              {item.description}
            </Text>
          </Card>
        ))}
      </VStack>
      <HStack className="md:justify-center my-10">
        <Button
          onPress={() => router.push("/onboarding")}
          className="bg-brand-secondary hover:bg-btn-primary active:bg-brand-secondary rounded-3xl"
        >
          <ButtonText> Join Now</ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
};

export default WhyChooseUs;
