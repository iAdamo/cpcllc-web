import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Icon, ArrowRightIcon } from "@/components/ui/icon";
import Link from "next/link";
import Image from "next/image";
import { HomeClient } from "@/public/assets/homepage";
import { useTranslation } from "@/context/TranslationContext";

const ForClient = () => {
  const { t } = useTranslation();

  const cards = [
    {
      title: t("for_client_card1_title"),
      description: t("for_client_card1_desc"),
      href: "#",
    },
    {
      title: t("for_client_card2_title"),
      description: t("for_client_card2_desc"),
      href: "#",
    },
    {
      title: t("for_client_card3_title"),
      description: t("for_client_card3_desc"),
      href: "#",
    },
  ];

  return (
    <VStack className="md:px-20 px-2 w-full relative rounded-lg">
      <Image
        className="md:object-cover object-fill w-full md:h-[36rem] h-80 top-0 left-0 rounded-lg"
        src={HomeClient}
        alt="home_client"
        width={3264}
        height={2448}
      />
      <HStack className="md:flex-col absolute inset-0 md:pt-4 md:p-0 p-4 md:px-28 w-full h-full md:gap-10 gap-2">
        <VStack className="md:flex-col w-2/5 md:gap-6 gap-2">
          <Heading size="xs" className="md:text-xl text-white md:pb-16">
            {t("for_clients")}
          </Heading>
          <Heading size="md" className="md:text-5xl text-white">
            {t("find_companies_your_way")}
          </Heading>
          <Text size="sm" className="md:text-xl text-white md:font-bold">
            {t("for_clients_paragraph")}
          </Text>
        </VStack>

        <VStack className="md:flex-row md:w-auto md:h-auto h-full w-3/5 justify-between md:gap-8 gap-2">
          {cards.map((card, index) => (
            <Link href={card.href} key={index} className="md:w-1/3">
              <Card className="p-2 h-full md:p-4 justify-between bg-brand-secondary group hover:bg-white md:gap-6 gap-3 transition-colors duration-300">
                <Heading
                  size="xs"
                  className="md:text-xl text-white group-hover:text-brand-secondary transition-colors duration-300"
                >
                  {card.title}
                </Heading>
                <Text className="md:text-lg text-xs text-white group-hover:text-brand-secondary font-semibold transition-colors duration-300">
                  {card.description}
                  <span className="hidden md:inline mr-2"></span>
                  <Icon as={ArrowRightIcon} className="hidden md:inline" />
                </Text>
              </Card>
            </Link>
          ))}
        </VStack>
      </HStack>
    </VStack>
  );
};

export default ForClient;
