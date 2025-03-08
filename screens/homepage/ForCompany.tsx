import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import Link from "next/link";
import { HomeCompany } from "@/public/assets/homepage";
import Image from "next/image";

const ForCompany = () => {
  return (
    <VStack className="px-20">
      <HStack className="rounded-xl">
        <VStack className="w-1/2">
          <Image
            className="object-cover h-[37rem] rounded-l-xl"
            src={HomeCompany}
            alt="home_company"
            width={3644}
            height={5466}
          />
        </VStack>
        <VStack className="w-1/2 gap-32 bg-btn-primary rounded-r-xl">
          <VStack className="p-4 gap-10">
            <Heading size="xl" className="text-white">
              For Companies
            </Heading>
            <Heading size="4xl" className="text-white">
              Find great jobs
            </Heading>
            <Text size="xl" className="text-white">
              Meet clients you&apos;re excited to work with and take your career
              or business to new heights.
            </Text>
          </VStack>
          <VStack className="gap-10 m-4">
            <HStack className="gap-4 border-t py-2">
              <Text className="text-white font-semibold">
                Discover opportunities for every phase of your business growth
              </Text>
              <Text className="text-white font-semibold">
                Maintain control over budgets and timelines
              </Text>
              <Text className="text-white font-semibold">
                Explore different engagement models to suit your needs
              </Text>
            </HStack>
            <Link
              href="#"
              className="text-center w-60 font-bold rounded-lg bg-white hover:bg-text-primary text-btn-primary py-3 px-6"
            >
              Find opportunities
            </Link>
          </VStack>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default ForCompany;
