import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import Link from "next/link";
import { HomeCompany } from "@/public/assets/homepage";
import Image from "next/image";

const ForCompany = () => {
  return (
    <VStack className="md:flex md:px-20 px-2">
      <HStack className="rounded-xl">
        <VStack className="hidden md:flex w-1/2">
          <Image
            className="object-cover md:h-[37rem] rounded-l-xl"
            src={HomeCompany}
            alt="home_company"
            width={3644}
            height={5466}
          />
        </VStack>
        <VStack className="md:w-1/2 md:gap-32 gap-4 bg-btn-primary rounded-xl md:rounded-r-xl">
          <VStack className="p-4 md:gap-10 gap-4">
            <Heading size="xs" className="md:text-xl text-white">
              For Companies
            </Heading>
            <Heading size="lg" className="md:text-4xl text-white">
              Find great jobs
            </Heading>
            <Text size="md" className="md:text-xl text-white">
              Meet clients you&apos;re excited to work with and take your career
              or business to new heights.
            </Text>
          </VStack>
          <VStack className="md:gap-10 gap-4 m-4">
            <HStack className="gap-4 border-t py-2">
              <Text className="md:text-base text-xs text-white font-semibold">
                Discover opportunities for every phase of your business growth
              </Text>
              <Text className="md:text-base text-xs text-white font-semibold">
                Maintain control over budgets and timelines
              </Text>
              <Text className="md:text-base text-xs text-white font-semibold">
                Explore different engagement models to suit your needs
              </Text>
            </HStack>
            <Link
              href="#"
              className="text-center md:text-base text-xs md:w-60 w-40 font-bold rounded-lg bg-white hover:bg-text-primary text-btn-primary py-3 px-6"
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
