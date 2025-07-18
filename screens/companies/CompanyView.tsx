"use client";

import { useEffect, useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Text } from "@/components/ui/text";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  FavouriteIcon,
  ShareIcon,
} from "@/components/ui/icon";
import { setUserFavourites } from "@/axios/users";
import { CompanyData, ReviewData } from "@/types";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { ReviewModal } from "@/components/Overlays/ReviewModal";
import { usePathname } from "next/navigation";
import ReviewSection from "../profile/ReviewSection";
import { ReviewIcon } from "@/public/assets/icons/reviewIcon";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { getInitial } from "@/utils/GetInitials";
import { Pressable } from "@/components/ui/pressable";
import ContactInfo from "./ContactInfo";

const CompanyView = (companyData: CompanyData) => {
  const [isFavourite, setIsFavourite] = useState(false);
  const [showWriteReview, setWriteReview] = useState(false);
  const [newReviews, setNewReviews] = useState<ReviewData[]>([]);

  const { userData } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isCompanyPage = /^\/companies\/[^/]+$/.test(pathname);

  useEffect(() => {
    const hasFavourited = companyData?.favoritedBy.includes(userData?.id ?? "");
    setIsFavourite(hasFavourited ?? false);
  }, [companyData?.favoritedBy, userData?.id]);

  const handleFavourite = async () => {
    try {
      if (!companyData?._id) return console.error("Company ID is undefined");

      const updatedCompany = await setUserFavourites(companyData?._id);
      const hasFavourited = updatedCompany?.favoritedBy.includes(
        userData?.id ?? ""
      );
      setIsFavourite(hasFavourited ?? false);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const serviceUpdates = [
    {
      name: "Modern white kitchen with a clean touch",
      description:
        "This kitchen is designed with a modern touch, featuring white cabinets and a clean layout. The open space allows for easy movement and functionality.",
      image: "/assets/header10.jpg",
    },
    {
      name: "Cozy living room with a warm ambiance",
      description:
        "This living room is designed to be cozy and inviting, with warm colors and comfortable furniture. The layout encourages relaxation and socializing.",
      image: "/assets/header10.jpg",
    },
    {
      name: "Elegant bedroom with a serene atmosphere",
      description:
        "This bedroom is designed to be elegant and serene, with soft colors and luxurious bedding. The layout promotes restful sleep and tranquility.",
      image: "/assets/header10.jpg",
    },
  ];

  const buttons = [
    {
      name: "Write a Review",
      icon: ReviewIcon,
      action: () => {
        setWriteReview(true);
      },
    },
    {
      name: "Share",
      icon: ShareIcon,
      action: () => router.forward(),
    },
    {
      name: "Favorite",

      icon: FavouriteIcon,
      action: handleFavourite,
    },
  ];

  return (
    <VStack className={`w-full gap-4 ${isCompanyPage ? "p-10" : "p-4"}`}>
      {ReviewModal({
        companyId: companyData?._id,
        companyName: companyData?.companyName,
        isOpen: showWriteReview,
        onClose: () => setWriteReview(false),
        setNewReviews(reviews: ReviewData[]) {
          setNewReviews(reviews);
        },
      })}
      <VStack className="bg-[#F6F6F6] gap-4">
        <Card className="h-96">
          <VStack className="">
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 4000 }}
              loop={companyData?.companyImages.length > 1} // Enable loop only if there are more than 1 slide
              pagination={{ clickable: true }}
              className="w-full h-full"
            >
              {companyData?.companyImages.map((src, index) => (
                <SwiperSlide key={index}>
                  <Image
                    className="object-cover w-full h-full rounded-lg"
                    src={src}
                    alt={`slide-${index}`}
                    width={1920}
                    height={1080}
                    priority
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </VStack>
        </Card>
        <HStack space="xl" className="gap-4 bg-[#F6F6F6]">
          <VStack
            className={`${
              isCompanyPage ? "w-2/3" : "w-full"
            } gap-4 rounded-md bg-white p-4`}
          >
            <VStack className={`${!isCompanyPage && "flex-row"} gap-4`}>
              <VStack
                className={`${
                  !isCompanyPage && "w-2/3"
                } gap-2 hover:drop-shadow-xl transition-shadow duration-300`}
              >
                <Pressable
                  onPress={() => {
                    router.push("cpc/" + companyData?._id);
                  }}
                  className="flex flex-row items-end gap-2"
                >
                  <Avatar size="md" className="">
                    <AvatarFallbackText>
                      {getInitial(
                        companyData?.companyEmail ||
                          companyData?.companyName ||
                          ""
                      )}
                    </AvatarFallbackText>
                    <AvatarImage
                      source={{ uri: companyData?.companyImages[0] }}
                    />
                  </Avatar>
                  <Heading
                    className={`font-extrablack ${
                      isCompanyPage ? "text-5xl" : "text-3xl"
                    } break-words`}
                  >
                    {companyData?.companyName}
                  </Heading>
                </Pressable>
                <Text
                  size="sm"
                  className={`${
                    isCompanyPage ? "md:text-md" : "md:text-sm"
                  } font-semibold text-typography-600 break-words`}
                >
                  {companyData?.companyDescription}
                </Text>
                <Heading className="text-text-tertiary">
                  5.0 (226 reviews)
                </Heading>
                <Heading className="text-text-tertiary">
                  {companyData?.clients}
                </Heading>
                <VStack className="flex-row mt-4 gap-4 w-full">
                  {buttons.map((button, index) => (
                    <Button
                      key={index}
                      onPress={button.action}
                      className="justify-between"
                    >
                      <ButtonIcon
                        className={`${
                          isFavourite &&
                          "fill-red-500 border-red-500 text-red-500 font-extrabold"
                        }`}
                        as={button.icon}
                      />
                      <ButtonText
                        className={`${
                          !isCompanyPage && "text-xs"
                        } data-[hover=true]:no-underline data-[active=true]:no-underline`}
                      >
                        {button.name}
                      </ButtonText>
                    </Button>
                  ))}
                </VStack>
              </VStack>
              {!isCompanyPage && (
                <ContactInfo
                  companyData={companyData}
                  isCompanyPage={isCompanyPage}
                />
              )}
            </VStack>

            {/* Content Sections */}
            <VStack space="4xl" className="py-6">
              {/* Service Updates */}
              <VStack space="2xl" className="mr-40">
                <Heading size={isCompanyPage ? "lg" : "sm"}>
                  Update from this service provider
                </Heading>

                <div className="relative w-full">
                  {/* Left button */}
                  <Button
                    size="sm"
                    className="swiper-button-prev absolute top-1/2 left-0 z-10 -translate-y-1/2 bg-white/70 hover:bg-white"
                  >
                    <ButtonIcon as={ArrowLeftIcon} />
                  </Button>

                  {/* Swiper */}
                  <Swiper
                    modules={[Navigation, Pagination]}
                    className="w-full"
                    spaceBetween={10}
                    slidesPerView={isCompanyPage ? 1.3 : 1.3}
                    navigation={{
                      nextEl: ".swiper-button-next",
                      prevEl: ".swiper-button-prev",
                    }}
                  >
                    {serviceUpdates.map((item, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <Card variant="outline" className="flex-row gap-2">
                            <Image
                              className={`object-cover ${
                                isCompanyPage ? "h-32 w-32" : "h-28 w-28"
                              }`}
                              src={item.image}
                              alt="portfolio-image"
                              width={1200}
                              height={1200}
                            />
                            <VStack className="h-auto gap-2">
                              <Heading size={isCompanyPage ? "sm" : "xs"}>
                                {item.name}
                              </Heading>
                              <Text
                                size={isCompanyPage ? "sm" : "xs"}
                                className={`${
                                  item.description.length > 80 && "line-clamp-3"
                                }`}
                              >
                                {item.description}
                              </Text>
                            </VStack>
                          </Card>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>

                  {/* Right button */}
                  <Button
                    size="sm"
                    className="swiper-button-next absolute top-1/2 right-0 z-10 -translate-y-1/2 bg-white/70 hover:bg-white"
                  >
                    <ButtonIcon as={ArrowRightIcon} />
                  </Button>
                </div>
              </VStack>

              {/* Portfolio
              <VStack>
                <Heading className="text-text-tertiary">Portfolio</Heading>
                <VStack className="grid grid-cols-3">
                  {portfolio.map((item, index) => (
                    <Card key={index} className="p-2 aspect-square">
                      <Image
                        className={`object-cover ${
                        isCompanyPage ? "h-40" : "h-24"
                      }`}
                        src={item.image}
                        alt="portfolio-image"
                        width={1200}
                        height={1200}
                      />
                      <Text>{item.name}</Text>
                    </Card>
                  ))}
                </VStack>
              </VStack>
              */}

              {/* Placeholder sections */}
              <VStack>
                <Heading className="text-text-tertiary">
                  Other companyData by this company
                </Heading>
              </VStack>
              <VStack>
                <Heading className="text-text-tertiary">
                  Photos and Videos
                </Heading>
              </VStack>
              <VStack className="">
                <ReviewSection
                  companyId={companyData?._id}
                  newReviews={newReviews}
                />
              </VStack>
            </VStack>
          </VStack>
          {/** Contact Info */}
          {isCompanyPage && (
            <ContactInfo
              companyData={companyData}
              isCompanyPage={isCompanyPage}
            />
          )}
        </HStack>
      </VStack>
    </VStack>
  );
};

export default CompanyView;
