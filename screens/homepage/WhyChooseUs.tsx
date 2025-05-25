import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { categories, matching, quickly } from "@/public/assets/icons";
import Link from "next/link";
import Image from "next/image";

const WhyChooseUs = () => {
  return (
    <VStack className="mx-20 my-10 rounded-xl bg-text-primary">
        <Heading size="2xl" className="py-8 text-center">Why businesses turn to CompaniesCenterLLC</Heading>
      <HStack className="px-10 flex-wrap justify-between">
        <Card className="w-60 flex-row md:flex-col gap-4">
          <Image src={categories} alt="first" width={60} height={60} />
          <Heading>Extensive Network</Heading>
          <Text>
            Connect with top companies and professionals in various industries.
          </Text>
        </Card>
        <Card className="w-60 flex-row md:flex-col gap-4">
          <Image src={matching} alt="first" width={60} height={60} />
          <Heading>Job Opportunities</Heading>
          <Text>
            Find the best job opportunities that match your skills and
            interests.
          </Text>
        </Card>
        <Card className="w-60 flex-row md:flex-col gap-4">
          <Image src={quickly} alt="first" width={60} height={60} />
          <Heading>Trust and Reviews</Heading>
          <Text>
            Read reviews and ratings from other users to make informed
            decisions.
          </Text>
        </Card>
      </HStack>
      <HStack className="md:justify-center my-10">
        <Link href="#" className="py-3 px-6 rounded-3xl font-bold text-white bg-brand-secondary hover:bg-btn-primary active:bg-brand-secondary ">
          Join Now
        </Link>
      </HStack>
    </VStack>
  );
};

export default WhyChooseUs;
