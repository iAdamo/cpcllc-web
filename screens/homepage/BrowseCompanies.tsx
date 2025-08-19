import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import Link from "next/link";
import Image from "next/image";
import { getCompanies } from "@/axios/users";
import { CompanyData } from "@/types";
import RatingSection from "../../components/RatingSection";

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
    <VStack className="md:px-20 px-2 gap-4">
      <VStack className="gap-2">
        <Heading size="md" className="md:text-3xl">
          Connect With Top Companies
        </Heading>
        <Text size="sm" className="md:text-lg">
          Join companiescenter and connect with leading companies offering a
          wide range of services.
        </Text>
        <Link
          href="/companies"
          className="hidden md:inline text-2xl text-btn-primary hover:text-brand-secondary font-semibold underline"
        >
          Browse companies
        </Link>
      </VStack>
      <VStack className="md:flex-row h-full w-full md:bg-transparent rounded-xl md:p-4 p-2 bg-[#F1F0FF] flex flex-wrap gap-x-4 gap-y-8">
        {companies.map((company, index) => (
          <Link key={index} href={`companies/${company?._id || ""}`}>
            <Card
              variant="ghost"
              className="md:flex-col flex-row md:h-80 h-fit w-full p-0 md:bg-[#F1F0FF] rounded-lg"
            >
              <Image
                className="md:h-[55%] md:w-full w-2/5 md:rounded-t-md rounded-l-md object-cover"
                src={company?.companyImages[0] || "/assets/placeholder.jpg"}
                alt={company?.companyName || "Company Logo"}
                width={1400}
                height={600}
              />
              <VStack className="md:h-[45%] gap-2 md:p-4 p-2 backdrop:p-2">
                <Heading size="sm" className="md:text-lg">
                  {company?.companyName}
                </Heading>
                <RatingSection
                  rating={company?.averageRating || 0}
                  reviewCount={company?.reviewCount || 0}
                />
                <Text
                  size="xs"
                  className="md:text-md md:font-medium line-clamp-3"
                >
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
