import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import Image from "next/image";
import {
  facebook,
  instagram,
  linkedin,
  tiktok,
  twitter,
  youtube,
} from "@/public/assets/icons";
import { useTranslation } from "@/context/TranslationContext";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="flex flex-col md:mx-10 mx-6 mt-20 md:flex-row md:justify-between gap-2 border-t border-gray-300">
      <VStack className="md:flex-row justify-center items-center md:gap-6">
        <Text className="text-xl md:text-2xl font-extrabold">
          COMPANYCENTERLLC&trade;
        </Text>
        <Text className="text-xs">
          &copy; 2025 CPCLLC. {t("allRightsReserved")}
        </Text>
      </VStack>
      <VStack className="md:flex-row md:gap-12 gap-4">
        <HStack className="justify-center items-center gap-6">
          <Image src={facebook} alt="Facebook" className="w-6 h-6" />
          <Image src={instagram} alt="Instagram" className="w-6 h-6" />
          <Image src={linkedin} alt="Linkedin" className="w-6 h-6" />
          <Image src={tiktok} alt="Tiktok" className="w-6 h-6" />
          <Image src={twitter} alt="Twitter" className="w-6 h-6" />
          <Image src={youtube} alt="Youtube" className="w-6 h-6" />
        </HStack>
        <VStack className="justify-center md:items-start items-center md:pt-4 gap-1">
          <Text className="font-semibold text-sm md:text-sm">
            {t("customerSupport")}: +1 (813)897-1727
          </Text>

          <Text className="font-semibold text-sm md:text-sm">
            30190 US Highway 19N #1064 Clearwater,
          </Text>
          <Text className="font-semibold text-sm md:text-sm">
            Florida 33761 United States
          </Text>
        </VStack>
        <HStack className="md:flex-col justify-center items-center gap-2">
          <Text className="font-semibold text-sm md:text-sm">
            {t("privacyPolicy")}
          </Text>
          <Text className="font-semibold text-sm md:text-sm">
            {t("termsOfService")}
          </Text>
        </HStack>
      </VStack>
    </footer>
  );
};

export default Footer;
