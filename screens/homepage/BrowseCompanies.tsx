import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import Link from "next/link";
import Image from "next/image";
import { getCompanies } from "@/axios/users";
import { CompanyData } from "@/types";
import renderStars from "@/components/RenderStars";

const BrowseCompanies = () => {
  const [companies, setUsers] = useState<CompanyData[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCompanies = async () => {
      const { companies: response } = await getCompanies(1, 10);
      setUsers(response);
    };
    fetchCompanies();
  }, []);

  return (
    <VStack className="md:px-20 px-4 gap-4">
      <VStack className="gap-2">
        <Heading size="md" className="md:text-4xl">
          Connect With Top Companies
        </Heading>
        <Text size="sm" className="md:text-lg">
          Join companiescenterllc.com and connect with leading companies
          offering a wide range of services.
        </Text>
        <Link
          href="/companies"
          className="hidden md:inline text-2xl text-btn-primary hover:text-brand-secondary font-semibold underline"
        >
          Browse companies
        </Link>
      </VStack>
      <VStack className="md:flex-row w-full flex flex-wrap gap-x-4 gap-y-8">
        {companies.map((company, index) => (
          <Link key={index} href={`companies/${company?._id || ""}`}>
            <Card
              variant="outline"
              className="flex-row h-32 md:w-[22rem] p-0 gap-4 bg-white"
            >
              <Image
                className="h-full w-32 rounded-l-md object-cover"
                src={company?.companyImages[0] || "/assets/placeholder.jpg"}
                alt={company?.companyName || "Company Logo"}
                width={1400}
                height={600}
              />
              <VStack className="justify-between p-2">
                <Heading size="sm" className="md:text-lg">
                  {company?.companyName}
                </Heading>
                <HStack className="gap-2 items-center">
                  <HStack className="gap-1 items-center">
                    {renderStars(company?.averageRating)}
                    <Text className="text-xs text-gray-500">
                      {company?.averageRating?.toFixed(1)}
                    </Text>
                  </HStack>
                  <Text className="text-xs text-gray-500">
                    ({company?.reviewCount} reviews)
                  </Text>
                </HStack>
                <Text size="sm" className="md:text-md md:font-semibold">
                  {company?.location?.primary?.address?.address}
                </Text>
              </VStack>
            </Card>
          </Link>
        ))}
      </VStack>
      <Button
        variant="outline"
        onPress={() => router.push("/companies")}
        className="md:hidden "
      >
        <ButtonText> Browse companies</ButtonText>
      </Button>
    </VStack>
  );
};

export default BrowseCompanies;
