import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import Link from "next/link";
import { star } from "@/public/assets/icons";
import Image from "next/image";

const BrowseCompanies = () => {

  const services = [
    {
      name: "Gardening & Horticulture",
      rating: "4.5",
      companies: "117",
      link: "#",
    },
    {
      name: "Gardening & Horticulture",
      rating: "4.5",
      companies: "117",
      link: "#",
    },
    {
      name: "Gardening & Horticulture",
      rating: "4.5",
      companies: "117",
      link: "#",
    },
    {
      name: "Gardening & Horticulture",
      rating: "4.5",
      companies: "117",
      link: "#",
    },
    {
      name: "Gardening & Horticulture",
      rating: "4.5",
      companies: "117",
      link: "#",
    },
    {
      name: "Gardening & Horticulture",
      rating: "4.5",
      companies: "117",
      link: "#",
    },
    {
      name: "Gardening & Horticulture",
      rating: "4.5",
      companies: "117",
      link: "#",
    },
    {
      name: "Gardening & Horticulture",
      rating: "4.5",
      companies: "117",
      link: "#",
    },
  ];

  return (
    <VStack className="p-20 gap-4">
      <VStack className="gap-2">
        <Heading size="3xl">Connect With Top Companies</Heading>
        <Text>
          Join companiescenterllc.com and connect with leading companies
          offering a wide range of services.
        </Text>
        <Link
          href="#"
          className="text-2xl text-btn-primary hover:text-brand-secondary font-semibold underline"
        >
          Browse companies
        </Link>
      </VStack>
      <HStack className="w-full flex flex-wrap justify-between gap-y-8">
        {services.map((service, index) => (
          <Link key={index} href={service.link || ""}>
            <Card className="bg-card-primary-1 hover:bg-card-primary-2 w-72 h-32 items-start">
              <VStack className="h-1/2">
                <Heading className="">{service.name}</Heading>
              </VStack>
              <HStack className="h-1/2 w-full justify-between items-center pr-8">
                <HStack className="gap-2 items-center">
                  <Image
                    className="font-semibold"
                    src={star}
                    alt="Star"
                    width={20}
                    height={20}
                  />

                  <Text className="font-semibold">{`${service.rating}/5.0`}</Text>
                </HStack>
                <VStack>
                  <Text className="font-semibold">{`${service.companies} companies`}</Text>
                </VStack>
              </HStack>
            </Card>
          </Link>
        ))}
      </HStack>
    </VStack>
  );
};

export default BrowseCompanies;
