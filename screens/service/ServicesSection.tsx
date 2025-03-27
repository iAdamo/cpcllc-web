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
    const fetchServices = async () => {
      const response = await getRandomServices(10);
      setServices(response);
    };
    fetchServices();
  }, []);

  return (
    <VStack className="my-10 p-10">
      <Heading>Services</Heading>
      <HStack></HStack>
      <VStack className="grid md:grid-cols-4 grid-cols-2 gap-4 p-4 h-auto">
        {services.map((service, index) => (
          <Link key={index} href={service.link || "/service"}>
            <Card variant="filled" className="gap-4">
              <VStack>
                <Image
                  className="h-40"
                  src={
                    service?.media?.image?.primary || "/assets/placeholder.jpg"
                  }
                  alt={service.title}
                  width={1400}
                  height={600}
                />
              </VStack>
              <VStack className="gap-4">
                <Text className="font-semibold">{service.title}</Text>
                <HStack className="w-full gap-4 items-center">
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
                      {service.location?.primary?.address ||
                        service.location?.primary?.city +
                          ", " +
                          service.location?.primary?.state +
                          ", " +
                          service.location?.primary?.country}
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
