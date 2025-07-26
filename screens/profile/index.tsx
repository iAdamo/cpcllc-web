"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { FavouriteIcon } from "@/components/ui/icon";
import { useSession } from "@/context/AuthContext";
import Image from "next/image";
import { userProfile, updateCompanyProfile } from "@/axios/users";
import { UserData } from "@/types";
import ReviewSection from "./ReviewSection";
import ServiceSection from "./ServiceSection";
import { getInitial } from "@/utils/GetInitials";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Toast, useToast, ToastTitle } from "@/components/ui/toast";
import { format } from "date-fns";
import ProfileDetails from "@/components/profile/ProfileDetails";
import { ProfileUploadButton } from "@/components/profile/ProfileUpload";
import RatingSection from "@/components/profile/RatingSection";

const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ProfilePage = () => {
  const { userData, fetchUserProfile } = useSession();
  const { id } = useParams();
  const [data, setData] = useState<UserData | null>(null);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const fetchUserData = useCallback(async () => {
    if (typeof id !== "string") return;

    if (userData?.id === id) {
      setData(userData);
      setIsEditable(true);
    } else {
      try {
        const res = await userProfile(id);
        setData(res);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    }
  }, [id, userData]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const showToast = useCallback(
    (message: string, type: "error" | "success") => {
      toast.show({
        placement: "top",
        duration: 3000,
        render: ({ id }) => (
          <Toast nativeID={id} variant="outline" action={type}>
            <ToastTitle>{message}</ToastTitle>
          </Toast>
        ),
      });
    },
    [toast]
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];

    if (!validImageTypes.includes(file.type)) {
      showToast(
        "Please upload a valid image file (JPEG, PNG, GIF, WEBP)",
        "error"
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      showToast("Image size should be less than 5MB", "error");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("profilePicture", file);

      const updatedUser = await updateCompanyProfile(formData);
      if (updatedUser) {
        showToast("Profile picture updated successfully!", "success");
        if (userData?.id === id) {
          await fetchUserProfile();
        }
      }
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!isUploading) fileInputRef.current?.click();
  };

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Text>Loading profile...</Text>
      </div>
    );
  }

  const { activeRoleId } = data;
  const isCurrentUser = userData?.id === id;

  return (
    <VStack className="md:mt-28 mt-32">
      {(activeRoleId?.companyImages ?? []).length > 0 && (
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000 }}
          loop
          pagination={{ clickable: true }}
          className="h-72 -z-50 w-full"
        >
          {activeRoleId?.companyImages?.map((src, index) => (
            <SwiperSlide key={index}>
              <Image
                className="object-cover w-full h-full"
                src={src}
                alt={`slide-${index}`}
                width={1920}
                height={1080}
                priority
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <VStack className="mb-40 md:mb-0 h-full md:px-20 gap-8 md:-mt-4">
        <VStack className="md:flex-row w-full gap-8">
          <VStack className="md:w-3/4 gap-8">
            {activeRoleId?._id && (
              <Card variant="outline" className="p-0 bg-white">
                <HStack className="justify-between p-4">
                  <HStack className="gap-10">
                    <Card className="md:p-4 p-0 -mt-8 gap-4 md:bg-white bg-transparent">
                      <div className="relative bg-blue-700">
                        <div className="hidden md:block relative h-56 w-56">
                          <Image
                            className="object-cover h-full w-full"
                            src={
                              data.profilePicture ||
                              "/assets/default-profile.jpg"
                            }
                            alt="profile-image"
                            width={400}
                            height={400}
                            priority
                          />
                          {isCurrentUser && (
                            <ProfileUploadButton
                              isUploading={isUploading}
                              triggerFileInput={triggerFileInput}
                              fileInputRef={fileInputRef}
                              handleFileChange={handleFileChange}
                            />
                          )}
                        </div>

                        <div className="md:hidden">
                          <Avatar size="2xl" className="relative">
                            <AvatarFallbackText>
                              {getInitial(data.email || data.firstName || "")}
                            </AvatarFallbackText>
                            <AvatarImage
                              source={{ uri: data.profilePicture }}
                            />
                            {isCurrentUser && (
                              <ProfileUploadButton
                                isUploading={isUploading}
                                triggerFileInput={triggerFileInput}
                                fileInputRef={fileInputRef}
                                handleFileChange={handleFileChange}
                                isMobile
                              />
                            )}
                          </Avatar>
                        </div>
                      </div>
                      <VStack className="gap-4">
                        <VStack className="gap-1">
                          <Heading size="md">
                            {activeRoleId.companyName}
                          </Heading>
                          <RatingSection
                            rating={activeRoleId.averageRating}
                            reviewCount={activeRoleId.reviewCount}
                          />
                          <Text size="sm">
                            {activeRoleId.location?.primary?.address?.country}
                          </Text>
                          <Text size="sm">
                            Registered on the{" "}
                            {format(new Date(data.createdAt), "MMM d, yyyy")}
                          </Text>
                          <Text size="sm">Online</Text>
                        </VStack>
                      </VStack>
                    </Card>

                    <ProfileDetails
                      activeRoleId={activeRoleId}
                      isEditable={isEditable}
                      fetchUserProfile={fetchUserProfile}
                    />
                  </HStack>

                  <Button
                    variant="link"
                    size="xl"
                    onPress={() => setIsFavourite((prev) => !prev)}
                    isDisabled={isUploading}
                  >
                    <ButtonIcon
                      className={`hidden w-8 h-8 ${
                        isFavourite && "text-red-500 fill-red-500"
                      }`}
                      as={FavouriteIcon}
                    />
                  </Button>
                </HStack>
              </Card>
            )}

            {activeRoleId?._id && (
              <VStack className="w-full gap-4">
                <ReviewSection companyId={activeRoleId._id} />
              </VStack>
            )}
          </VStack>

          <VStack className="hidden md:flex w-1/4 items-center p-4 bg-[#F6F6F6]">
            {activeRoleId?._id && (
              <VStack className="w-full gap-4">
                <ServiceSection companyId={activeRoleId._id} />
              </VStack>
            )}
          </VStack>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default ProfilePage;
