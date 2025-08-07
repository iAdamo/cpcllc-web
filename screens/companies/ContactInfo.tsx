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

const ContactInfo = ({
  companyData,
  isCompanyPage,
}: {
  companyData: CompanyData;
  isCompanyPage: boolean;
}) => {
  const router = useRouter();
  return (
    <VStack className="md:w-1/3 w-full md:sticky md:top-32 self-start h-fit gap-4 bg-[#F6F6F6]">
      <VStack className="hidden bg-white p-4 gap-4">
        <Heading className="text-xl font-extrablack">
          Request quote & availability
        </Heading>
        <div className="flex flex-row gap-10">
          <VStack>
            <Heading className="text-xs text-text-secondary">
              Response time
            </Heading>
            <Heading className="text-sm text-green-700">10 minutes</Heading>
          </VStack>
          <VStack>
            <Heading className="text-xs text-text-secondary">
              Response rate
            </Heading>
            <Heading className="text-sm text-green-700">100%</Heading>
          </VStack>
        </div>
        <Button
          onPress={() => router.push("/service/request-quote")}
          className="bg-blue-600 companyData-[hover=true]:bg-blue-500"
        >
          <ButtonText className="text-md">
            Request quote & availability
          </ButtonText>
        </Button>
        <small className="text-center text-text-secondary">
          107 locals recently requested a quote
        </small>
      </VStack>

      {/* Contact Card */}
      <Card className={`${!isCompanyPage && "p-0"} gap-4`}>
        <div className="flex flex-row justify-between">
          <Link
            href={`mailto:${companyData?.companyEmail}`}
            className={`font-extrablack ${
              isCompanyPage ? "md:text-md text-xs" : "text-sm"
            } text-cyan-700 md:w-11/12 w-full break-words`}
          >
            {companyData?.companyEmail || "No email provided"}
          </Link>
          <Icon as={ExternalLinkIcon} />
        </div>
        <Divider />

        <div className="flex flex-row justify-between">
          <Link
            href={`https://${
              companyData?.companySocialMedia?.other || "google.com"
            }`}
            className={`font-extrablack ${
              isCompanyPage ? "md:text-md text-xs" : "text-sm"
            } text-cyan-700 md:w-11/12 w-full break-words`}
          >
            {companyData?.companySocialMedia?.other || "google.com"}
          </Link>
          <Icon as={GlobeIcon} />
        </div>

        <Divider />

        <div className="flex flex-row justify-between">
          <Link
            href={`tel:${companyData?.companyPhoneNumber}` || "google.com"}
            className={`font-extrablack ${
              isCompanyPage ? "md:text-md text-xs" : "text-sm"
            } text-cyan-700 md:w-11/12 w-full break-words`}
          >
            {companyData?.companyPhoneNumber || "google.com"}
          </Link>
          <Icon as={PhoneIcon} />
        </div>
        <Divider className={`${isCompanyPage ? "flex" : "hidden"}`} />

        <div
          className={`${
            isCompanyPage ? "flex" : "hidden"
          } flex-row justify-between`}
        >
          <div className="w-11/12">
            <Link
              href="#"
              className="font-extrablack md:text-md text-xs text-cyan-700  break-words"
            >
              Get Directions
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
