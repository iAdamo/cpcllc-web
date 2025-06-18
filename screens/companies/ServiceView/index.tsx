"use client";

import { useEffect, useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import {
  Avatar,
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
  ArrowRightIcon,
  ArrowLeftIcon,
  GlobeIcon,
  FavouriteIcon,
} from "@/components/ui/icon";
import { setUserFavourites } from "@/axios/users";
import { getReviews } from "@/axios/reviews";
import { CompanyData, ReviewData } from "@/types";
import { getInitial } from "@/utils/GetInitials";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Pressable } from "@/components/ui/pressable";
import { ReviewModal } from "@/components/Overlays/ReviewModal";

const ServiceView = (companyData: CompanyData) => {
  const [isFavourite, setIsFavourite] = useState(false);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [showWriteReview, setWriteReview] = useState(false);

  const { userData } = useSession();
  const router = useRouter();

  useEffect(() => {
    const hasFavourited = companyData?.favoritedBy.includes(userData?.id ?? "");
    setIsFavourite(hasFavourited ?? false);

    const handleReview = async () => {
      try {
        const reviews = await getReviews(companyData?._id);
        console.log("Reviews", reviews);
        setReviews(reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    handleReview();
  }, [companyData?.favoritedBy, userData?.id, companyData?._id]);

  const handleFavourite = async () => {
    try {
      if (!companyData?._id) return console.error("Company ID is undefined");

      const updatedCompany = await setUserFavourites(companyData?._id);
      const hasFavourited = updatedCompany?.favoritedBy.includes(
        userData?.id ?? ""
      );
      console.log(hasFavourited);
      setIsFavourite(hasFavourited ?? false);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const portfolio = [
    { name: "Portfolio 1", image: "/assets/header10.jpg" },
    { name: "Portfolio 2", image: "/assets/header10.jpg" },
    { name: "Portfolio 3", image: "/assets/header10.jpg" },
  ];

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
      icon: FavouriteIcon,
      action: () => {
        setWriteReview(true);
      },
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

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const maxLength = 70;

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <VStack className="w-full gap-4 p-4">
      {ReviewModal({
        companyId: companyData?._id,
        companyName: companyData?.companyName,
        isOpen: showWriteReview,
        onClose: () => setWriteReview(false),
      })}
      <VStack className="bg-[#F6F6F6] gap-4">
        <Card className="h-96">
          <VStack className="">
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 4000 }}
              loop
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
          {/* LEFT SIDE */}
          <VStack className="w-2/3 gap-4 bg-white p-4">
            {/* Company Header */}

            <VStack space="xs" className="gap-4">
              <VStack>
                <Heading size="2xl" className="font-extrablack break-words">
                  {companyData?.companyName}
                </Heading>
                <Heading className="text-text-tertiary">
                  5.0 (226 reviews)
                </Heading>
                <Heading className="text-text-tertiary">
                  {companyData?.clients}
                </Heading>
              </VStack>
              <VStack className="flex-row w-2/3 justify-between items-start">
                {buttons.map((button, index) => (
                  <Button
                    key={index}
                    variant="link"
                    onPress={button.action}
                    className={`${
                      isFavourite && " companyData-[hover=true]:bg-[#FFFFF70]"
                    }`}
                  >
                    <ButtonIcon
                      className={`${
                        isFavourite &&
                        "fill-red-500 border-red-500 text-white font-extrabold"
                      }`}
                      as={button.icon}
                    />
                    <ButtonText className="companyData-[hover=true]:no-underline companyData-[active=true]:no-underline">
                      {button.name}
                    </ButtonText>
                  </Button>
                ))}
              </VStack>
            </VStack>

            {/* Content Sections */}
            <VStack space="4xl" className="py-6">
              {/* Service Updates */}
              <VStack space="2xl">
                <Heading>Update from this service provider</Heading>

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
                    slidesPerView={1.3}
                    navigation={{
                      nextEl: ".swiper-button-next",
                      prevEl: ".swiper-button-prev",
                    }}
                  >
                    {serviceUpdates.map((item, index) => {
                      const isLong = item.description.length > maxLength;
                      const isExpanded = expandedIndex === index;
                      const shortText =
                        item.description.slice(0, maxLength) + "...";

                      return (
                        <SwiperSlide key={index}>
                          <Card variant="outline" className="flex-row gap-2">
                            <Image
                              className="object-cover h-32 w-32"
                              src={item.image}
                              alt="portfolio-image"
                              width={1200}
                              height={1200}
                            />
                            <VStack className="gap-2 h-20">
                              <Heading size="md">{item.name}</Heading>
                              <Text size="md">
                                {isExpanded || !isLong
                                  ? item.description
                                  : shortText}
                              </Text>
                              {isLong && (
                                <Button
                                  size="xs"
                                  variant="link"
                                  onPress={() => toggleExpanded(index)}
                                >
                                  <ButtonText>
                                    {isExpanded ? "Show Less" : "Read More"}
                                  </ButtonText>
                                </Button>
                              )}
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

              {/* Portfolio */}
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
              <VStack className="gap-2">
                <Heading className="text-text-tertiary">Reviews</Heading>
                {reviews.map((review, index) => (
                  <Pressable key={index}>
                    <Card className="gap-2">
                      <HStack className="gap-4 items-center">
                        <Avatar className="w-10 h-10">
                          <AvatarFallbackText>
                            {getInitial(
                              review.user?.firstName || review.user?.email
                            )}
                          </AvatarFallbackText>
                          <AvatarImage
                            source={{ uri: review.user?.profilePicture || "" }}
                          />
                        </Avatar>
                        <Heading size="xs" className="font-bold">
                          {(review.user?.firstName && review.user?.lastName)
                            ? `${review.user?.firstName} ${review.user?.lastName}`
                            : "Anonymous User"}
                        </Heading>
                      </HStack>
                      <Text className="text-sm text-text-secondary">
                        {review.description.length > 80
                          ? `${review.description.substring(0, 80)}...`
                          : review.description}
                      </Text>
                      <HStack className="justify-between mt-2">
                        <Text className="text-yellow-500">
                          Rating: {review.rating} ⭐
                        </Text>
                      </HStack>
                    </Card>
                  </Pressable>
                ))}
              </VStack>
            </VStack>
          </VStack>

          {/* RIGHT SIDE */}
          <VStack className="w-1/3 sticky top-32 self-start h-fit gap-4 bg-[#F6F6F6]">
            <VStack className="hidden bg-white p-4 gap-4">
              <Heading className="text-xl font-extrablack">
                Request quote & availability
              </Heading>
              <div className="flex flex-row gap-10">
                <VStack>
                  <Heading className="text-xs text-text-secondary">
                    Response time
                  </Heading>
                  <Heading className="text-sm text-green-700">
                    10 minutes
                  </Heading>
                </VStack>
                <VStack>
                  <Heading className="text-xs text-text-secondary">
                    Response rate
                  </Heading>
                  <Heading className="text-sm text-green-700">100%</Heading>
                </VStack>
              </div>
              <Button
                onPress={() => router.push("/service/request-quote")}
                className="bg-blue-600 companyData-[hover=true]:bg-blue-500"
              >
                <ButtonText className="text-md">
                  Request quote & availability
                </ButtonText>
              </Button>
              <small className="text-center text-text-secondary">
                107 locals recently requested a quote
              </small>
            </VStack>

            {/* Contact Card */}
            <Card className="bg-white p-4 gap-4">
              <div className="flex flex-row justify-between">
                <Link
                  href={`mailto:${companyData?.companyEmail}`}
                  className="font-extrablack text-md text-cyan-700 w-11/12 break-words"
                >
                  {companyData?.companyEmail || "No email provided"}
                </Link>
                <Icon as={ExternalLinkIcon} />
              </div>
              <Divider />

              <div className="flex flex-row justify-between">
                <Link
                  href={`https://${companyData?.website || "google.com"}`}
                  className="font-extrablack text-md text-cyan-700 w-11/12 break-words"
                >
                  {companyData?.website || "google.com"}
                </Link>
                <Icon as={GlobeIcon} />
              </div>

              <Divider />

              <div className="flex flex-row justify-between">
                <Text className="font-extrablack text-md text-cyan-700 w-11/12 break-words">
                  {companyData?.companyPhoneNumber ||
                    "No phone number provided"}
                </Text>
                <Icon as={PhoneIcon} />
              </div>
              <Divider />

              <div className="flex flex-row justify-between">
                <div className="w-11/12">
                  <Link
                    href="#"
                    className="font-extrablack text-md text-cyan-700  break-words"
                  >
                    Get Directions
                  </Link>
                  <p className="font-semibold text- text-text-secondary break-words">
                    {companyData?.location?.primary?.address?.address}
                  </p>
                </div>
                <Icon as={GlobeIcon} className="" />
              </div>
            </Card>
          </VStack>
        </HStack>
      </VStack>
    </VStack>
  );
};

export default ServiceView;
