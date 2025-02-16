import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Icon, ArrowRightIcon } from "@/components/ui/icon";
import Link from "next/link";
import Image from "next/image";

const ForClient = () => {
  return (
    <VStack className="p-20 w-full relative rounded-lg">
      <Image
        className="object-cover w-full h-[36rem] top-0 left-0 rounded-lg"
        src="/assets/homepages/home-client.jpg"
        alt="home_header"
        width={3264}
        height={2448}
      />
      <VStack className="absolute inset-0 pt-24 px-28 w-full gap-10">
        <VStack className="w-2/5 gap-6">
          <Heading size="xl" className="text-white pb-16">
            For Clients
          </Heading>
          <Heading size="5xl" className="text-white">
            Find companies your way
          </Heading>
          <Text size="xl" className="text-white font-bold">
            Work with the largest network of service providers and get things
            done—from quick turnarounds to big transformations.
          </Text>
        </VStack>

        <HStack className="justify-between gap-8 px-8">
          {[
            {
              title:
                "Search a service with our filters enabled engine",
              description: "Use Our Search Engine",
              href: "#",
            },
            {
              title: "Browse a service and hire a company",
              description: "Companies Marketplace™",
              href: "#",
            },
            {
              title: "Get advice from a service expert",
              description: "Consultations",
              href: "#",
            },
          ].map((card, index) => (
            <Link href={card.href} key={index} className="w-1/3">
              <Card className="bg-brand-secondary group hover:bg-white gap-6 transition-colors duration-300">
                <Heading
                  size="xl"
                  className="text-white group-hover:text-brand-secondary transition-colors duration-300"
                >
                  {card.title}
                </Heading>
                <Text className="text-white group-hover:text-brand-secondary text-lg font-semibold transition-colors duration-300">
                  {card.description}
                  <span className="mr-2"></span>

                  <Icon as={ArrowRightIcon} className="inline" />
                </Text>
              </Card>
            </Link>
          ))}
        </HStack>
      </VStack>
    </VStack>
  );
};

export default ForClient;
