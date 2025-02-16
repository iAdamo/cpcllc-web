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

const FeaturedCompanies = () => {
  const scrollRef = useRef<ScrollView>(null);

  const companies = [
    { title: "Kajola Technologies", review: "4.6/5.0", color: "bg-blue-500" },
    { title: "Sanux Technologies", review: "4.6/5.0", color: "bg-green-500" },
    { title: "Product 3", review: "4.6/5.0", color: "bg-red-500" },
    { title: "Product 4", review: "4.6/5.0", color: "bg-yellow-500" },
    { title: "Product 1", review: "4.6/5.0", color: "bg-purple-500" },
    { title: "Product 2", review: "4.6/5.0", color: "bg-pink-500" },
    { title: "Product 3", review: "4.6/5.0", color: "bg-indigo-500" },
    { title: "Product 4", review: "4.6/5.0", color: "bg-teal-500" },
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
    <VStack className="md:mx-12 mx-4 mb-14 md:mt-10 mt-8 gap-4">
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
              <Card className={`rounded-lg w-52 shadow-hard-5 ${company.color}`}>
                <Image
                  className="object-cover w-full rounded-lg"
                  src="/assets/homepages/home-client.jpg"
                  alt="home_header"
                  width={500}
                  height={500}
                />
                <VStack className="h-24 justify-center">
                  <Heading size="lg" className="mb-4 text-white">
                    {company.title}
                  </Heading>
                  <Text className="font-semibold text-white">
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