import Image from "next/image";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import Link from "next/link"
import { HomeHeada } from "@/public/assets/homepage";

const HomeHeader = () => {
  return (
    <VStack className="p-20 my-10">
      <HStack className="justify-between flex-col-reverse lg:flex-row items-start h-full gap-4">
        <VStack className="w-full pl-6 lg:pl-0 pb-6 gap-6 h-full">
            <Heading className="md:text-5xl text-4xl font-extrabold text-brand-secondary">
              Welcome to companiescenterllc.com
            </Heading>
            <Text size="lg" className="font-semibold leading-6 text-text-secondary">
              Your Trusted Platform for Connecting with Leading Companies.
              Whether you&apos;re looking to hire or get hired, we provide a
              comprehensive marketplace for businesses and job seekers. Explore
              job opportunities, read reviews, and connect with companies that
              meet your needs.
            </Text>
            <Link href="#" className="w-44 rounded-full text-center py-2 text-text-primary text-xl font-semibold bg-btn-primary hover:bg-btn-secondary active:bg-btn-primary">
              Join us today
            </Link>

        </VStack>
        <VStack className="items-center h-full w-full">
          <Image
            className="object-cover rounded-lg"
            src={HomeHeada}
            alt="home_header"
            width={1920}
            height={1080}
          />
        </VStack>
      </HStack>
    </VStack>
  );
};

export default HomeHeader;
