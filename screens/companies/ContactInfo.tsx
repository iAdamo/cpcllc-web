import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
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
    <VStack className="w-1/3 sticky top-32 self-start h-fit gap-4 bg-[#F6F6F6]">
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
              isCompanyPage ? "text-md" : "text-sm"
            } text-cyan-700 w-11/12 break-words`}
          >
            {companyData?.companyEmail || "No email provided"}
          </Link>
          <Icon as={ExternalLinkIcon} />
        </div>
        <Divider />

        <div className="flex flex-row justify-between">
          <Link
            href={`https://${companyData?.website || "google.com"}`}
            className={`font-extrablack ${
              isCompanyPage ? "text-md" : "text-sm"
            } text-cyan-700 w-11/12 break-words`}
          >
            {companyData?.website || "google.com"}
          </Link>
          <Icon as={GlobeIcon} />
        </div>

        <Divider />

        <div className="flex flex-row justify-between">
          <Text
            className={`font-extrablack ${
              isCompanyPage ? "text-md" : "text-sm"
            } text-cyan-700 w-11/12 break-words`}
          >
            {companyData?.companyPhoneNumber || "No phone number provided"}
          </Text>
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
              className="font-extrablack text-md text-cyan-700  break-words"
            >
              Get Directions
            </Link>
            <p className="font-semibold text- text-text-secondary break-words">
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
