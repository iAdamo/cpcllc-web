import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { star } from "@/public/assets/icons";
import { getInitial } from "@/utils/GetInitials";
import { ServiceData } from "@/types";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Icon, FavouriteIcon } from "@/components/ui/icon";
import { setUserFavourites } from "@/axios/services";
import { useSession } from "@/context/AuthContext";

interface ServiceCardProps {
  service: ServiceData;
  index: number;
}

const ServiceCard = ({ service, index }: ServiceCardProps) => {
  const { userData } = useSession();
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    if (userData && service?.favoritedBy?.includes(userData.id)) {
      setIsFavourite(true);
    }
  }, [userData, service]);

  if (!userData) return null;

  const handleFavourite = async () => {
    try {
      if (!service?._id) return console.error("Service ID is undefined");

      const updatedService = await setUserFavourites(service._id);
      const hasFavourited = updatedService.favoritedBy.includes(userData.id);
      setIsFavourite(hasFavourited);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <Card key={index} className="w-72 gap-2 p-0 drop-shadow-xl">
      <Link href={`/service/${service._id}`}>
        <Image
          className="h-60 rounded-t-md object-cover"
          src={service?.media?.image?.primary || "/assets/placeholder.jpg"}
          alt={service.title}
          width={1400}
          height={600}
        />
      </Link>
      <VStack className="gap-4 p-2">
        <HStack className="justify-between items-center px-2">
            <Link
              href={`/cpc/${service?.company?.owner?._id || service?.company?.owner}`}
              className="flex flex-row gap-2 items-center text-btn-primary text-sm font-extrablack"
            >
            <Avatar size="sm">
              <AvatarFallbackText>
                {getInitial(
                  service?.title ||
                    service?.company?.companyEmail ||
                    ""
                )}
              </AvatarFallbackText>
              <AvatarImage source={{ uri: service?.company?.companyLogo }} />
              <AvatarBadge />
            </Avatar>

              {service?.company?.companyName}
            </Link>
          <button onClick={handleFavourite} className="focus:outline-none">
            <Icon
              size="xl"
              className={`transition-colors ${
                isFavourite ? "fill-red-500 text-red-500" : ""
              }`}
              as={FavouriteIcon}
            />
          </button>
        </HStack>

        <Link href={`/service/${service._id}`}>
          <Heading
            size="sm"
            className="h-20 break-words whitespace-normal drop-shadow-xl"
          >
            {service.title}
          </Heading>
          <HStack className="w-full justify-between items-center mt-1">
            <HStack className="gap-2 items-center">
              <Image src={star} alt="Star" width={20} height={20} />
              <Text className="text-md font-semibold">
                {`${service.ratings}/5.0`}
              </Text>
            </HStack>
            <Text className="text-md font-semibold">{service.location}</Text>
          </HStack>
        </Link>
      </VStack>
    </Card>
  );
};

export default ServiceCard;
