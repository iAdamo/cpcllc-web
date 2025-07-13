"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { SettingsIcon, FavouriteIcon } from "@/components/ui/icon";
import { useSession } from "@/context/AuthContext";
import Image from "next/image";
import { userProfile } from "@/axios/users";
import { UserData } from "@/types";
import ReviewSection from "./ReviewSection";
import ServiceSection from "./ServiceSection";
import { getInitial } from "@/utils/GetInitials";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const ProfilePage = () => {
  const { userData: sessionUserData } = useSession();
  const { id } = useParams();
  const [data, setData] = useState<UserData | null>(null);
  const [isFavourite, setIsFavourite] = useState(false);
  const [showCompanyProfile, setShowCompanyProfile] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (typeof id !== "string") return;

      if (sessionUserData?.id === id) {
        setData(sessionUserData);
      } else {
        try {
          const res = await userProfile(id);
          setData(res);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUserData();
  }, [id, sessionUserData]);

  if (!data) return null;

  const date = new Date(data.createdAt);
  const companyDate = new Date(data.activeRoleId?.createdAt || 0);
  const formattedCompanyDate = companyDate.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedDate = date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <VStack className="mt-40">
      <Image
        src="/assets/header10.jpg"
        alt="cover-image"
        width={1200}
        height={600}
        className="hidden md:flex w-full"
      />
      <VStack className="mb-40 md:mb-0 h-full md:px-20 gap-8 md:-mt-4">
        <Card variant="outline" className="flex flex-row p-0 bg-white">
          <VStack className="md:w-3/4 border-r">
            {data?.activeRoleId?._id && showCompanyProfile ? (
              <>
                <VStack>
                  <VStack className="md:flex-row h-full justify-between md:p-4">
                    <VStack className="md:flex-row md:gap-10">
                      <Card className="md:border md:p-4 p-0 md:-mt-8 bg-white">
                        <Swiper
                          modules={[Autoplay, Pagination]}
                          autoplay={{ delay: 4000 }}
                          loop
                          pagination={{ clickable: true }}
                          className="md:hidden h-56 w-full rounded-lg"
                        >
                          {data?.activeRoleId?.companyImages.map(
                            (src, index) => (
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
                            )
                          )}
                        </Swiper>
                        <Image
                          className="hidden md:flex object-cover h-56 w-56"
                          src={
                            data?.activeRoleId?.companyImages[0] ||
                            "/assets/default-profile.jpg"
                          }
                          alt={data?.activeRoleId?.companyName}
                          width={1200}
                          height={1200}
                        />
                      </Card>
                      <VStack className="hidden md:flex">
                        <Text>No user information to display.</Text>
                      </VStack>
                      {/**Mobile */}
                      <HStack className="md:hidden p-4 justify-between w-full">
                        <VStack className="gap-1 w-3/4">
                          <Heading className="mb-2" size="md">
                            {data?.activeRoleId?.companyName}
                          </Heading>
                          <Text size="sm">
                            {
                              data?.activeRoleId?.location?.primary?.address
                                ?.country
                            }
                          </Text>
                          <Text size="sm">
                            Registered on the {formattedCompanyDate}
                          </Text>
                          <Text size="sm">Online</Text>
                        </VStack>
                        <Button
                          size="xs"
                          variant="link"
                          onPress={() => setShowCompanyProfile(false)}
                        >
                          <ButtonText className="text-xs text-btn-primary data-[hover=true]:no-underline data-[active=true]:no-underline">
                            View User Profile
                          </ButtonText>
                        </Button>
                      </HStack>
                    </VStack>
                    <Button
                      variant="link"
                      size="xl"
                      // Change color based on state
                      onPress={() => setIsFavourite((prev) => !prev)}
                      className="hidden md:flex"
                    >
                      <ButtonIcon
                        className={`w-8 h-8 ${
                          isFavourite && "text-red-500 fill-red-500"
                        }`}
                        as={FavouriteIcon}
                      />
                    </Button>
                  </VStack>
                </VStack>

                <HStack className="hidden md:flex justify-between px-4 items-end">
                  <VStack className="gap-1">
                    <Heading className="mb-2" size="sm">
                      {data?.activeRoleId?.companyName}
                    </Heading>
                    <Text size="sm">
                      {data?.activeRoleId?.location?.primary?.address?.country}
                    </Text>
                    <Text size="sm">
                      Registered on the {formattedCompanyDate}
                    </Text>
                    <Text size="sm">Online</Text>
                  </VStack>
                  <Button
                    size="xs"
                    variant="link"
                    onPress={() => setShowCompanyProfile(false)}
                  >
                    <ButtonText className="text-btn-primary data-[hover=true]:no-underline data-[active=true]:no-underline">
                      VIEW USER PROFILE
                    </ButtonText>
                  </Button>
                </HStack>
              </>
            ) : (
              <VStack className="border">
                <VStack>
                  <HStack className="h-full justify-between p-4">
                    <HStack className="gap-10">
                                            <Card className="md:p-4 p-0 -mt-8 bg-white">
                        {/* Profile Picture */}
                        <div className="relative">
                          <Image
                            className="hidden md:flex object-cover h-56 w-56"
                            src={data.profilePicture || "/assets/default-profile.jpg"}
                            alt="cover-image"
                            width={4000}
                            height={4000}
                          />
                          <Avatar size="2xl" className="md:hidden">
                            <AvatarFallbackText>
                              {getInitial(data?.email || data?.firstName || "")}
                            </AvatarFallbackText>
                            <AvatarImage source={{ uri: data?.profilePicture }} />
                          </Avatar>

                          {/* Upload Button */}
                          <label
                            htmlFor="profile-picture-upload"
                            className="absolute bottom-2 right-2 bg-gray-200 p-2 rounded-full cursor-pointer hover:bg-gray-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 text-gray-700"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.5 10.5L12 15m0 0l-4.5-4.5M12 15V3m9 9a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </label>
                          <input
                            id="profile-picture-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            // onChange={handleFileChange}
                          />
                        </div>
                      </Card>
                      <VStack>
                        <Text>No user information to display.</Text>
                      </VStack>
                    </HStack>
                    <Button
                      variant="link"
                      size="xl"
                      // Change color based on state
                      onPress={() => setIsFavourite((prev) => !prev)}
                    >
                      <ButtonIcon
                        className={`w-8 h-8 ${
                          isFavourite && "text-red-500 fill-red-500"
                        }`}
                        as={FavouriteIcon}
                      />
                    </Button>
                  </HStack>
                </VStack>
                <HStack className="justify-between px-4 items-end">
                  <VStack className="gap-1">
                    <Heading className="mb-2" size="sm">
                      {data?.firstName} {data?.lastName}
                    </Heading>
                    <Text size="sm">
                      {data?.activeRoleId?.location?.primary?.address?.country}
                    </Text>
                    <Text size="sm">Joined {formattedDate}</Text>
                    <Text size="sm">Online</Text>
                  </VStack>
                  {data.activeRoleId && (
                    <Button
                      size="xs"
                      variant="link"
                      onPress={() => setShowCompanyProfile(true)}
                    >
                      <ButtonText className="text-btn-primary data-[hover=true]:no-underline data-[active=true]:no-underline">
                        VIEW COMPANY PROFILE
                      </ButtonText>
                    </Button>
                  )}
                </HStack>
              </VStack>
            )}
          </VStack>
          <VStack className="hidden w-1/4 items-center p-4 bg-[#F6F6F6]">
            <Button className="bg-brand-primary">
              <ButtonIcon as={SettingsIcon} />
              <ButtonText>Account Settings</ButtonText>
            </Button>
          </VStack>
        </Card>
        {data?.activeRoleId?._id && showCompanyProfile && (
          <VStack className="w-full gap-4">
            <ServiceSection companyId={data.activeRoleId._id} />
            <ReviewSection companyId={data.activeRoleId._id} />
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};

export default ProfilePage;
