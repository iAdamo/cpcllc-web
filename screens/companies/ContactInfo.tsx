import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import Link from "next/link";
import {
  Icon,
  ExternalLinkIcon,
  PhoneIcon,
  GlobeIcon,
} from "@/components/ui/icon";
import { useRouter } from "next/navigation";
import { CompanyData } from "@/types";
import { useTranslation } from "@/context/TranslationContext";

const ContactInfo = ({
  companyData,
  isCompanyPage,
}: {
  companyData: CompanyData;
  isCompanyPage: boolean;
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <VStack className="md:w-1/3 w-full md:sticky md:top-32 self-start h-fit gap-4 bg-[#F6F6F6]">
      <VStack className="hidden bg-white p-4 gap-4">
        <Heading className="text-xl font-extrablack">
          {t("request_quote_availability")}
        </Heading>
        <div className="flex flex-row gap-10">
          <VStack>
            <Heading className="text-xs text-text-secondary">
              {t("response_time")}
            </Heading>
            <Heading className="text-sm text-green-700">
              {t("response_time_value")}
            </Heading>
          </VStack>
          <VStack>
            <Heading className="text-xs text-text-secondary">
              {t("response_rate")}
            </Heading>
            <Heading className="text-sm text-green-700">
              {t("response_rate_value")}
            </Heading>
          </VStack>
        </div>
        <Button
          onPress={() => router.push("/service/request-quote")}
          className="bg-blue-600 companyData-[hover=true]:bg-blue-500"
        >
          <ButtonText className="text-md">
            {t("request_quote_availability")}
          </ButtonText>
        </Button>
        <small className="text-center text-text-secondary">
          {t("locals_requested_quote")}
        </small>
      </VStack>

      {/* Contact Card */}
      <Card
        className={`${
          !isCompanyPage && "p-2"
        } gap-4 md:rounded-md rounded-none`}
      >
        <div className="flex flex-row justify-between gap-2">
          <Link
            href={`mailto:${companyData?.companyEmail}`}
            className={`font-extrablack ${
              isCompanyPage ? "md:text-[16px] text-xs" : "text-sm"
            } text-cyan-700 md:w-9/12 w-full break-words flex-grow`}
          >
            {companyData?.companyEmail || t("no_email")}
          </Link>
          <Icon as={ExternalLinkIcon} className="" />
        </div>
        <Divider />

        <div className="flex flex-row justify-between gap-2">
          <Link
            href={`https://${companyData?.companySocialMedia?.other || ""}`}
            className={`font-extrablack ${
              isCompanyPage ? "md:text-[16px] text-xs" : "text-sm"
            } text-cyan-700 md:w-9/12 w-full break-words flex-grow`}
          >
            {t("website")}
          </Link>
          <Icon as={GlobeIcon} />
        </div>

        <Divider />

        <div className="flex flex-row justify-between gap-2">
          <Link
            href={`tel:+${companyData?.companyPhoneNumber}` || "google.com"}
            className={`font-extrablack ${
              isCompanyPage ? "md:text-[16px] text-xs" : "text-sm"
            } text-cyan-700 md:w-9/12 w-full break-words flex-grow`}
          >
            {companyData?.companyPhoneNumber
              ? `+${companyData?.companyPhoneNumber}`
              : t("no_phone")}
          </Link>
          <Icon as={PhoneIcon} />
        </div>
        <Divider className={`${isCompanyPage ? "flex" : "hidden"}`} />

        <div
          className={`${
            isCompanyPage ? "flex" : "hidden"
          } flex-row justify-between gap-2`}
        >
          <div className="w-9/12">
            <Link
              href="#"
              className="font-extrablack md:text-[16px] text-xs text-cyan-700  break-words"
            >
              {t("get_directions")}
            </Link>
            <p className="font-semibold md:text-md text-xs text-text-secondary break-words">
              {companyData?.location?.primary?.address?.address}
            </p>
          </div>
          <Icon as={GlobeIcon} className="" />
        </div>
      </Card>
    </VStack>
  );
};

export default ContactInfo;
