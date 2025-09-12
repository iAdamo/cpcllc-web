import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import Link from "next/link";
import Image from "next/image";
import { globalSearch } from "@/axios/search";
import { CompanyData } from "@/types";
import RatingSection from "@/components/RatingSection";
import { useTranslation } from "@/context/TranslationContext";

const BrowseCompanies = () => {
  const [providers, setUsers] = useState<CompanyData[]>([]);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCompanies = async () => {
      const { providers: response } = await globalSearch(
        1,
        10,
        false,
        undefined,
        undefined,
        undefined,
        undefined
      );
      setUsers(response);
    };
    fetchCompanies();
  }, []);

  return (
    <VStack className="md:px-20 px-2 gap-4">
      <VStack className="gap-2">
        <Heading size="md" className="md:text-3xl">
          {t("connectWithTopCompanies")}
        </Heading>
        <Text size="sm" className="md:text-lg">
          {t("joinCompaniesCenter")}
        </Text>
        <Link
          href="/providers"
          className="hidden md:inline text-2xl text-btn-primary hover:text-brand-secondary font-semibold underline"
        >
          {t("browseCompanies")}
        </Link>
      </VStack>
      <VStack className="md:flex-row md:grid grid-cols-3 h-full w-full md:bg-transparent rounded-xl p-2 bg-[#F1F0FF] gap-8">
        {providers.map((provider, index) => (
          <Link
            key={index}
            href={`providers/${provider?._id || ""}`}
            className="md:aspect-square"
          >
            <Card
              variant="ghost"
              className="md:flex-col flex-row md:h-80 h-fit w-full p-0 md:bg-[#F1F0FF] rounded-lg"
            >
              <Image
                className="md:h-[55%] md:w-full w-2/5 md:rounded-t-md md:rounded-l-none rounded-l-md object-cover"
                src={provider?.providerImages?.[0] || "/assets/placeholder.jpg"}
                alt={provider?.providerName || "Company Logo"}
                width={1400}
                height={600}
              />
              <VStack className="md:h-[45%] gap-2 md:p-4 p-2 backdrop:p-2">
                <Heading size="sm" className="md:text-lg">
                  {provider?.providerName}
                </Heading>
                <RatingSection
                  rating={provider?.averageRating || 0}
                  reviewCount={provider?.reviewCount || 0}
                />
                <Text
                  size="xs"
                  className="md:text-md md:font-medium line-clamp-3"
                >
                  {provider?.location?.primary?.address?.address}
                </Text>
              </VStack>
            </Card>
          </Link>
        ))}
      </VStack>
      <Button
        variant="outline"
        onPress={() => router.push("/providers")}
        className="md:hidden "
      >
        <ButtonText>{t("browseCompanies")}</ButtonText>
      </Button>
    </VStack>
  );
};

export default BrowseCompanies;
