import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { categories, matching, quickly } from "@/public/assets/icons";
import { useTranslation } from "@/context/TranslationContext";

const WhyChooseUs = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const whyChooseUsData = [
    {
      icon: categories,
      title: t("whychooseus_network_title"),
      description: t("whychooseus_network_description"),
    },
    {
      icon: matching,
      title: t("whychooseus_jobs_title"),
      description: t("whychooseus_jobs_description"),
    },
    {
      icon: quickly,
      title: t("whychooseus_trust_title"),
      description: t("whychooseus_trust_description"),
    },
  ];

  return (
    <VStack className="md:flex md:mx-20 px-4 my-10 md:rounded-xl bg-text-primary">
      <Heading size="md" className="md:text-2xl pr-20 py-8 md:text-center">
        {t("whychooseus_heading")}
      </Heading>
      <VStack className="md:flex-row md:px-10 flex-wrap justify-between gap-2">
        {whyChooseUsData.map((item, index) => (
          <Card
            key={index}
            className="md:w-60 h-28 md:h-auto flex-row md:flex-col gap-4"
          >
            <Image src={item.icon} alt={item.title} width={60} height={60} />
            <Heading size="sm" className="md:text-lg">
              {item.title}
            </Heading>
            <Text size="sm" className="md:text-md">
              {item.description}
            </Text>
          </Card>
        ))}
      </VStack>
      <HStack className="md:justify-center my-10">
        <Button
          onPress={() => router.push("/onboarding")}
          className="bg-brand-secondary hover:bg-btn-primary active:bg-brand-secondary rounded-3xl"
        >
          <ButtonText>{t("whychooseus_join_button")}</ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
};

export default WhyChooseUs;
