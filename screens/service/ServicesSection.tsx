import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import Link from "next/link";
import Image from "next/image";
import { star } from "@/public/assets/icons";
import { Card } from "@/components/ui/card";
import { getRandomServices } from "@/axios/services";
import { useEffect, useState } from "react";
import { ServiceData } from "@/types";


const ServicesSection = () => {
  const [services, setServices] = useState<ServiceData[]>([]);

  useEffect(() => {
    getRandomServices().then((data) => setServices(data));
  }, []);

  return (
    <VStack className="my-10 p-10">
      <Heading>Services</Heading>
      <HStack></HStack>
      <VStack className="grid md:grid-cols-4 grid-cols-2 gap-4 p-4 h-auto">
        {services.map((service, index) => (
          <Link key={index} href={service.link}>
            <Card variant="filled" className="gap-4">
              <VStack>
                <Image
                  className="h-40"
                  src={service.media.image.primary}
                  alt={service.title}
                  width={1400}
                  height={600}
                />
              </VStack>
              <VStack className="gap-4">
                <Text className="font-semibold">{service.title}</Text>
                <HStack className="w-full justify-between items-center pr-8">
                  <HStack className="gap-2 items-center">
                    <Image
                      className="font-semibold"
                      src={star}
                      alt="Star"
                      width={20}
                      height={20}
                    />

                    <Text className="font-semibold">{`${service.ratings}/5.0`}</Text>
                  </HStack>
                  <VStack>
                    <Text className="font-semibold">
                      {service.location.first.country}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </Card>
          </Link>
        ))}
      </VStack>
    </VStack>
  );
};

export default ServicesSection;
