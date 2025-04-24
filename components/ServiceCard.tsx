import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { star } from "@/public/assets/icons";
import { ServiceData } from "@/types";




interface ServiceCardProps {

  service: ServiceData;

  index: number;

}



const ServiceCard = ({ service, index }: ServiceCardProps) => {

  // Component implementation


  return (
    <Link key={index} href={`/service/${service._id}`}>
      <Card variant="filled" className="gap-4 w-96">
        <Image
          className="h-64"
          src={service?.media?.image?.primary || "/assets/placeholder.jpg"}
          alt={service.title}
          width={1400}
          height={600}
        />
        <VStack className="gap-4">
          <Heading
            size="xl"
            className="font-semibold h-32  break-words whitespace-normal drop-shadow-xl"
          >
            {service.title}
          </Heading>
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
  );
};

export default ServiceCard;
