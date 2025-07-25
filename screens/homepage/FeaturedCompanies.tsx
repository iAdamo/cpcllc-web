import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icon";
import { ScrollView } from "@/components/ui/scroll-view";
import { Button, ButtonIcon } from "@/components/ui/button";
import { HomeClient } from "@/public/assets/homepage";

const FeaturedCompanies = () => {
  const scrollRef = useRef<ScrollView>(null);

  const companies = [
    { title: "Kajola Technologies", review: "4.6/5.0" },
    { title: "Sanux Technologies", review: "4.6/5.0" },
    { title: "Product 3", review: "4.6/5.0" },
    { title: "Product 4", review: "4.6/5.0" },
    { title: "Product 1", review: "4.6/5.0" },
    { title: "Product 2", review: "4.6/5.0" },
    { title: "Product 3", review: "4.6/5.0" },
    { title: "Product 4", review: "4.6/5.0" },
  ];

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: 0, animated: true });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <VStack className="md:mx-12 mx-4 md:mt-0 mt-8 gap-4">
      <Heading className="md:text-4xl text-lg">Featured Companies</Heading>
      <HStack className="items-center justify-between gap-8">
        <Button
          onPress={scrollLeft}
          className="hidden md:flex bg-yellow-500 w-14 h-14 z-10 right-10 rounded-full"
        >
          <ButtonIcon as={ChevronLeftIcon} size="lg" />
        </Button>

        <ScrollView
          ref={scrollRef}
          horizontal
          scrollEnabled
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16 }}
          className="overflow-x-auto md:-mx-24 py-4"
        >
          {companies.map((company, index) => (
            <Link href="#" key={index}>
              <Card variant="filled" className="rounded-lg w-52 shadow-hard-5">
                <Image
                  className="object-cover w-full rounded-lg"
                  src={HomeClient}
                  alt="home_client"
                  width={500}
                  height={500}
                />
                <VStack className="h-24 justify-center">
                  <Heading size="md" className="mb-4">
                    {company.title}
                  </Heading>
                  <Text className="font-semibold">
                    {company.review}
                  </Text>
                </VStack>
              </Card>
            </Link>
          ))}
        </ScrollView>

        <Button
          onPress={scrollRight}
          className="hidden md:block bg-yellow-500 w-14 h-14 left-10 rounded-full"
        >
          <ButtonIcon as={ChevronRightIcon} />
        </Button>
      </HStack>
    </VStack>
  );
};

export default FeaturedCompanies;
