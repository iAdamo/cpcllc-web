import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { star } from "@/public/assets/icons";
import { ServiceData } from "@/types";


const ServiceCard = (service: ServiceData, index: number) => {
  return (
    <Link key={index} href={`/service/${service._id}`}>
      <Card variant="filled" className="gap-2 h-80">
        <VStack className="">
          <Image
            className="h-40"
            src={service?.media?.image?.primary || "/assets/placeholder.jpg"}
            alt={service.title}
            width={1400}
            height={600}
          />
        </VStack>
        <VStack className="gap-4">
          <Text className="font-semibold h-28 drop-shadow-xl">
            {service.title.match(/.{1,28}/g)?.map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </Text>
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
