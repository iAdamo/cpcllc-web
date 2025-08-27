import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import Link from "next/link";
import { HomeCompany } from "@/public/assets/homepage";
import Image from "next/image";
import { useTranslation } from "@/context/TranslationContext";

const ForCompany = () => {
  const { t } = useTranslation();

  return (
    <VStack className="md:flex md:px-20 px-2">
      <HStack className="rounded-xl">
        <VStack className="hidden md:flex w-1/2">
          <Image
            className="object-cover md:h-[37rem] rounded-l-xl"
            src={HomeCompany}
            alt={t("home_company_alt")}
            width={3644}
            height={5466}
          />
        </VStack>
        <VStack className="md:w-1/2 md:gap-32 gap-4 bg-btn-primary rounded-xl md:rounded-r-xl">
          <VStack className="p-4 md:gap-10 gap-4">
            <Heading size="xs" className="md:text-xl text-white">
              {t("for_companies")}
            </Heading>
            <Heading size="lg" className="md:text-4xl text-white">
              {t("find_great_jobs")}
            </Heading>
            <Text size="md" className="md:text-xl text-white">
              {t("for_companies_paragraph")}
            </Text>
          </VStack>
          <VStack className="md:gap-10 gap-4 m-4">
            <HStack className="gap-4 border-t py-2">
              <Text className="md:text-base text-xs text-white font-semibold">
                {t("for_companies_point1")}
              </Text>
              <Text className="md:text-base text-xs text-white font-semibold">
                {t("for_companies_point2")}
              </Text>
              <Text className="md:text-base text-xs text-white font-semibold">
                {t("for_companies_point3")}
              </Text>
            </HStack>
            <Link
              href="#"
              className="text-center md:text-base text-xs md:w-60 w-40 font-bold rounded-lg bg-white hover:bg-text-primary text-btn-primary py-3 px-6"
            >
              {t("find_opportunities")}
            </Link>
          </VStack>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default ForCompany;
