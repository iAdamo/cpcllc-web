import React, { useRef, useState } from "react";
import {
  HStack,
  VStack,
  Text,
  Card,
  Heading,
  Link,
  LinkText,
  Icon,
  ChevronRightIcon,
  ScrollView,
  Button,
  ButtonIcon,
  ChevronLeftIcon,
} from "@/components/ui";

const ProductSection = () => {
  const scrollRef = useRef<ScrollView>(null);
  const cardWidth = 256;
  const [scrollPosition, setScrollPosition] = useState(0);

  const products = [
    { title: "Product 1", description: "This is product 1" },
    { title: "Product 2", description: "This is product 2" },
    { title: "Product 3", description: "This is product 3" },
    { title: "Product 4", description: "This is product 4" },
    { title: "Product 1", description: "This is product 1" },
    { title: "Product 2", description: "This is product 2" },
    { title: "Product 3", description: "This is product 3" },
    { title: "Product 4", description: "This is product 4" },
  ];

  const scrollRight = () => {
    const maxScroll = (products.length - 1) * cardWidth;
    const newPosition = Math.min(scrollPosition + cardWidth, maxScroll);
    setScrollPosition(newPosition);
    scrollRef.current?.scrollTo({ x: newPosition, animated: true });
  };

  const scrollLeft = () => {
    const newPosition = Math.max(scrollPosition - cardWidth, 0);
    setScrollPosition(newPosition);
    scrollRef.current?.scrollTo({ x: newPosition, animated: true });
  };

  return (
    <VStack className="md:mx-14 mx-4 mb-14 md:mt-20 mt-8  gap-4">
      <Text className="md:text-3xl text-lg font-bold text-purple-950">
        LATEST SERVICES
      </Text>
      <HStack className="justify-between items-center">
        <Text className="hidden md:text-lg text-sm">
          Browse through our products and services
        </Text>
        <HStack className="md:ml-auto items-center">
          <Link className="text-cyan-950">
            <LinkText className="font-bold">See all</LinkText>
          </Link>
          <Icon as={ChevronRightIcon} className="ml-2" />
        </HStack>
      </HStack>

      {/* Scrollable Section */}
      <HStack className="items-center justify-between gap-8">
        <Button
          onPress={scrollLeft}
          className="hidden md:block bg-yellow-500 w-14 h-14 rounded-full"
        >
          <ButtonIcon as={ChevronLeftIcon} size="lg" />
        </Button>

        {/* ScrollView with Touch Dragging Enabled */}
        <ScrollView
          ref={scrollRef}
          horizontal
          scrollEnabled
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16 }}
          className="overflow-x-auto flex-nowrap py-4"
        >
          {products.map((product, index) => (
            <Card key={index} className="p-4 rounded-lg w-64 shadow-hard-5">
              <Heading>
                <Text className="text-lg font-bold">{product.title}</Text>
              </Heading>
              <Text className="text-gray-600">{product.description}</Text>
              <Heading>
                <Text className="text-lg font-bold">{product.title}</Text>
              </Heading>
              <Text className="text-gray-600">{product.description}</Text>
              <Heading>
                <Text className="text-lg font-bold">{product.title}</Text>
              </Heading>
              <Text className="text-gray-600">{product.description}</Text>
            </Card>
          ))}
        </ScrollView>

        <Button
          onPress={scrollRight}
          className="hidden md:block bg-yellow-500 w-14 h-14 rounded-full"
        >
          <ButtonIcon as={ChevronRightIcon} />
        </Button>
      </HStack>
    </VStack>
  );
};

export default ProductSection;
