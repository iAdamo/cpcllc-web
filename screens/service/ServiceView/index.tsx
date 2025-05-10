"use client";

import { useEffect, useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import Link from "next/link";
import {
  Icon,
  ExternalLinkIcon,
  PhoneIcon,
  GlobeIcon,
  FavouriteIcon,
} from "@/components/ui/icon";
import { getServiceById } from "@/axios/services";
import { ServiceData } from "@/types";
// import ServiceCard from "@/components/ServiceCard";
import { useParams } from "next/navigation";
import { getInitial } from "@/utils/GetInitials";
import { useRouter } from "next/navigation";
import { setUserFavourites } from "@/axios/services";
import { useSession } from "@/context/AuthContext";
// qDMOY925z0RNAKzH
const ServiceView = () => {
  const [isFavourite, setIsFavourite] = useState(false);
  const [services, setServices] = useState<ServiceData | null>(null);
  const { id } = useParams();
  const router = useRouter();
  const { userData } = useSession();

  const portfolio = [
    {
      name: "Portfolio 1",
      image: "/assets/header10.jpg",
    },
    {
      name: "Portfolio 2",
      image: "/assets/header10.jpg",
    },
    {
      name: "Portfolio 3",
      image: "/assets/header10.jpg",
    },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      if (!userData || typeof id !== "string") return;

      const service = await getServiceById(id);
      setServices(service);

      // Check if current user has already favorited
      const alreadyFavourited = service?.favoritedBy?.includes(userData?.id ?? "");
      setIsFavourite(alreadyFavourited);
    };

    fetchServices();
  }, [id, userData]);

  const handleFavourite = async () => {
    try {
      if (!services?._id) return console.error("Service ID is undefined");

      const updatedService = await setUserFavourites(services._id);
      const hasFavourited = updatedService.favoritedBy.includes(userData?.id ?? "");
      setIsFavourite(hasFavourited);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const buttons = [
    {
      name: "Write a Review",
      icon: FavouriteIcon,
      action: () => router.forward(),
    },
    {
      name: "Share",
      icon: FavouriteIcon,
      action: () => router.forward(),
    },
    {
      name: "Save",
      icon: FavouriteIcon,
      action: () => router.forward(),
    },
    {
      name: "Favorite",

      icon: FavouriteIcon,
      action: handleFavourite,
    },
  ];

  return (
    <VStack className=" bg-[#F6F6F6]">
      <HStack space="xl" className="p-20 gap-8 bg-[#F6F6F6] pt-40">
        <VStack className="w-2/3 gap-4 bg-white p-4">
          <HStack className="gap-6">
            <Avatar size="xl">
              <AvatarFallbackText>
                {getInitial(
                  services?.company?.companyEmail ||
                    services?.company?.companyName ||
                    ""
                )}
              </AvatarFallbackText>
              <AvatarImage source={{ uri: services?.company?.companyLogo }} />
            </Avatar>
            <VStack space="xs">
              <Link href={`/cpc/${services?.company?.owner?._id}`} className="">
                <Heading
                  size="4xl"
                  className="font-extrablack break-words whitespace-normal"
                >
                  {services?.company?.companyName}
                </Heading>
              </Link>
              <HStack>
                <Heading className="text-text-tertiary">
                  5.0 (226 reviews)
                </Heading>
              </HStack>
              <Heading className="text-text-tertiary">
                {services?.company?.clients}
              </Heading>

              <HStack className="justify-between gap-4 flex-wrap">
                {buttons.map((button, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="md"
                    onPress={button.action}
                    className={`${
                      isFavourite &&
                      "bg-red-500 border-red-500 data-[hover=true]:bg-red-500"
                    }`}
                  >
                    <ButtonIcon
                      size="xl"
                      className={`${
                        isFavourite && "fill-red-500 text-white font-extrabold"
                      }`}
                      as={button.icon}
                    />
                    <ButtonText
                      className={`${
                        isFavourite && "text-white data-[hover=true]:text-white"
                      }`}
                    >
                      {button.name}
                    </ButtonText>
                  </Button>
                ))}
              </HStack>
            </VStack>
          </HStack>
          <VStack className="p-4">
            <Heading
              size="2xl"
              className="font-extrablack break-words whitespace-normal"
            >
              {services?.title}
            </Heading>
            <Link
              href={`/cpc/${services?.company?.owner?._id}`}
              className="flex flex-row gap-4 items-center"
            >
              <Avatar size="sm">
                <AvatarFallbackText>
                  {getInitial(
                    services?.company?.owner?.email ||
                      services?.company?.owner?.firstName ||
                      ""
                  )}
                </AvatarFallbackText>
                <AvatarImage
                  source={{ uri: services?.company?.owner?.profilePicture }}
                />
                <AvatarBadge />
              </Avatar>
              <Text className="text-sm font-semibold">
                {services?.company?.owner?.firstName}{" "}
                {services?.company?.owner?.lastName}
              </Text>
            </Link>
          </VStack>
          <VStack>
            <Image
              className="object-cover h-96"
              src={
                services?.media.image.primary || "/assets/default-profile.jpg"
              }
              alt="service-image"
              width={1200}
              height={1200}
              priority
            />
          </VStack>
          <VStack space="4xl" className="py-6">
            <VStack space="xs">
              <Heading className="text-text-tertiary">Service Overview</Heading>
              <Text className="break-words whitespace-normal">
                {services?.description}
              </Text>
            </VStack>
            <VStack>
              <Heading className="text-text-tertiary">Portfolio</Heading>
              <HStack className="flex-wrap justify-between">
                {portfolio.map((item, index) => (
                  <Card key={index}>
                    <Image
                      className="object-cover h-52 w-52"
                      src={item.image}
                      alt="portfolio-image"
                      width={1200}
                      height={1200}
                    />
                    <Text>{item.name}</Text>
                  </Card>
                ))}
              </HStack>
            </VStack>
            <VStack>
              <Heading className="text-text-tertiary">
                Other services by this company
              </Heading>
              <HStack></HStack>
            </VStack>
            <VStack>
              <Heading className="text-text-tertiary">
                Photos and Videos
              </Heading>
            </VStack>
            <VStack>
              <Heading className="text-text-tertiary">Reviews</Heading>
            </VStack>
          </VStack>
        </VStack>
        <VStack className="w-1/3 sticky top-32 self-start h-fit gap-4 bg-[#F6F6F6]">
          <VStack className="bg-white p-4 gap-4">
            <Heading className="text-3xl font-extrablack">
              Request quote & availability
            </Heading>
            <div className="flex flex-row gap-10">
              <VStack>
                <Heading className="text-xs text-text-secondary">
                  Response time
                </Heading>
                <Heading className="text-sm text-green-700">10 minutes</Heading>
              </VStack>
              <VStack>
                <Heading className="text-xs text-text-secondary">
                  Response rate
                </Heading>
                <Heading className="text-sm text-green-700">100%</Heading>
              </VStack>
            </div>
            <Button className="bg-blue-600 data-[hover=true]:bg-blue-500">
              <ButtonText>Request quote & availability</ButtonText>
            </Button>
            <small className="text-center text-text-secondary">
              107 locals recently requested a quote
            </small>
          </VStack>
          <Card className="bg-white p-4 gap-4">
            <div className="flex flex-row justify-between">
              <Link href="#" className="font-extrablack text-lg text-cyan-700">
                kajola.org
              </Link>
              <Icon as={ExternalLinkIcon} />
            </div>
            <Divider />

            <div className="flex flex-row justify-between">
              <Text className="font-extrablack text-lg text-cyan-700">
                (415) 123-4567
              </Text>
              <Icon as={PhoneIcon} />
            </div>
            <Divider />

            <div className="flex flex-row justify-between">
              <div>
                <Link
                  href="#"
                  className="font-extrablack text-md text-cyan-700"
                >
                  Get Directions
                </Link>
                <p className="font-bold textt-lg text-text-secondary">
                  {services?.company?.location?.primary?.address?.address}
                </p>
              </div>

              <Icon as={GlobeIcon} />
            </div>
          </Card>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default ServiceView;
