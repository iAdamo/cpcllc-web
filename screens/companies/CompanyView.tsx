"use client";

import { useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Text } from "@/components/ui/text";
import { CompanyData, ReviewData } from "@/types";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { usePathname } from "next/navigation";
import ReviewSection from "../profile/ReviewSection";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { getInitial } from "@/utils/GetInitials";
import { Pressable } from "@/components/ui/pressable";
import ContactInfo from "./ContactInfo";
import ActionButtons from "@/components/ActionTab";
import RatingSection from "../../components/RatingSection";
import ServiceSection from "../profile/ServiceSection";
import { useMediaQuery } from "@/components/ui/utils/use-media-query";

const CompanyView = (companyData: CompanyData) => {
  const [newReviews, setNewReviews] = useState<ReviewData[]>([]);

  const { userData } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isCompanyPage = /^\/companies\/[^/]+$/.test(pathname);
  const isProfilePage = /^\/cpc\/[^/]+$/.test(pathname);
  const [isMobile] = useMediaQuery([{ maxWidth: 768}]);

  return (
    <VStack
      className={`w-full bg-[#F6F6F6] gap-4 ${
        isCompanyPage ? "md:p-10 p-2" : "p-4"
      }`}
    >
      {!isMobile && (
        <Card className="h-96">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4000 }}
            loop={companyData?.companyImages?.length > 1} // Enable loop only if there are more than 1 slide
            pagination={{ clickable: true }}
            className="w-full h-full"
          >
            {companyData?.companyImages?.map((src, index) => (
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
        </Card>
      )}
      <VStack space="xl" className="md:flex-row gap-4 bg-[#F6F6F6]">
        <VStack
          className={`${
            isCompanyPage ? "md:w-2/3 w-full" : "w-full"
          } gap-4 rounded-md bg-white pt-4`}
        >
          <VStack className={`${!isCompanyPage && "flex-row"} gap-4`}>
            <VStack
              className={`${
                !isCompanyPage && "w-full"
              } px-4 gap-2 hover:drop-shadow-xl transition-shadow duration-300`}
            >
              <Pressable
                onPress={() => {
                  router.push(`/cpc/${companyData.owner}`);
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
                    source={{ uri: companyData?.companyImages?.[0] }}
                  />
                </Avatar>
                <Heading
                  size="xl"
                  className={`font-extrablack ${
                    isCompanyPage ? "md:text-4xl" : "md:text-3xl"
                  } break-words`}
                >
                  {companyData?.companyName}
                </Heading>
              </Pressable>
              <Text
                className={`${
                  isCompanyPage ? "md:text-md text-sm" : "md:text-sm"
                } font-medium text-typography-600 break-words`}
              >
                {companyData?.companyDescription}
              </Text>
              <RatingSection
                rating={companyData?.averageRating || 0}
                reviewCount={companyData?.reviewCount || 0}
              />
              <Heading className="text-text-tertiary">
                {companyData?.clients}
              </Heading>
              <VStack className="mt-4">
                <ActionButtons
                  companyData={companyData}
                  userData={userData}
                  isCompanyPage={isCompanyPage}
                  // setWriteReview={setWriteReview}
                  setNewReviews={setNewReviews}
                  // isFavourite={isFavourite}
                  //  setIsFavourite={setIsFavourite}
                />
              </VStack>
            </VStack>
            {isMobile && (
              <ContactInfo
                companyData={companyData}
                isCompanyPage={isCompanyPage}
              />
            )}
          </VStack>

          {/* Content Sections */}
          <VStack space="4xl" className="my-6">
            {/* Service Updates */}
            <ServiceSection
              company={companyData}
              isProfilePage={isProfilePage}
              isMobile={isMobile}
            />
            {/* Company Details */}
            <Card className="gap-3">
              <Heading
                size="sm"
                className="md:text-lg font-bold text-brand-primary"
              >
                Brand Showcase
              </Heading>
              <VStack className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companyData?.companyImages?.map((src, index) => (
                  <Image
                    key={index}
                    className="object-cover w-full md:h-56 h-52"
                    src={src}
                    alt={`company-image-${index}`}
                    width={1920}
                    height={1080}
                    priority
                  />
                ))}
              </VStack>
            </Card>
            <VStack className="">
              <ReviewSection
                companyId={companyData?._id}
                newReviews={newReviews}
              />
            </VStack>
          </VStack>
        </VStack>
        {/** Contact Info */}
        {!isMobile && (
          <ContactInfo
            companyData={companyData}
            isCompanyPage={isCompanyPage}
          />
        )}
      </VStack>
    </VStack>
  );
};

export default CompanyView;
