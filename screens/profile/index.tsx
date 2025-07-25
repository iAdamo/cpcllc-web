"use client";

import { useState, useEffect, useRef } from "react";
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
import { userProfile, updateProfile } from "@/axios/users";
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

interface RenderProps {
  id: string;
}

const ProfilePage = () => {
  const { userData, fetchUserProfile } = useSession();
  const { id } = useParams();
  const [data, setData] = useState<UserData | null>(null);
  const [isFavourite, setIsFavourite] = useState(false);
  const [showCompanyProfile, setShowCompanyProfile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toast = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      if (typeof id !== "string") return;

      if (userData?.id === id) {
        setData(userData);
      } else {
        try {
          const res = await userProfile(id);
          setData(res);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          //toast.error("Failed to load profile data");
        }
      }
    };

    fetchUserData();
  }, [id, userData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input changed:", e.target.files);
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    // Validate file type
    if (!validImageTypes.includes(file.type)) {
      toast.show({
        placement: "top",
        duration: 3000,
        render: ({ id }: RenderProps) => {
          return (
            <Toast nativeID={id} variant="outline" action="error" className="">
              <ToastTitle>
                Please upload a valid image file (JPEG, PNG, GIF, WEBP)
              </ToastTitle>
            </Toast>
          );
        },
      });
      return;
    }

    // Validate file size (e.g., 5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.show({
        placement: "top",
        duration: 3000,
        render: ({ id }: RenderProps) => {
          return (
            <Toast nativeID={id} variant="outline" action="error" className="">
              <ToastTitle> </ToastTitle>
            </Toast>
          );
        },
      });
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("profilePicture", file);

      // Call your API endpoint to upload the image
      const updatedUser = await updateProfile(formData);
      if (updatedUser) {
        toast.show({
          placement: "top",
          duration: 3000,
          render: ({ id }: RenderProps) => {
            return (
              <Toast nativeID={id} variant="outline" action="success">
                <ToastTitle>Profile picture updated successfully!</ToastTitle>
              </Toast>
            );
          },
        });
      }

      // Update local state
      setData((prev) =>
        prev ? { ...prev, profilePicture: updatedUser.profilePicture } : null
      );

      // Update session if it's the current user's profile
      if (userData?.id === id) {
        await fetchUserProfile();
      }
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      // toast.error("Failed to update profile picture");
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!isUploading) fileInputRef.current?.click();
  };

  if (!data)
    return (
      <div className="flex justify-center items-center h-screen">
        <Text>Loading profile...</Text>
      </div>
    );

  return (
    <VStack className="md:mt-28 mt-40">
      <Image
        src="/assets/header10.jpg"
        alt="cover-image"
        width={1200}
        height={600}
        className="hidden md:flex w-full"
        priority
      />
      <VStack className="mb-40 md:mb-0 h-full md:px-20 gap-8 md:-mt-4">
        <VStack className="md:flex-row w-full gap-8">
          <VStack className="md:w-3/4 gap-8">
            <Card variant="outline" className="flex-row p-0 bg-white">
              {data?.activeRoleId?._id && showCompanyProfile ? (
                <VStack className="w-full">
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
                              Registered on the{" "}
                              {format(new Date(data?.createdAt), "MMM d, yyyy")}
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
                        onPress={() => setIsFavourite((prev) => !prev)}
                        className="hidden md:flex"
                        isDisabled={isUploading}
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
                        {
                          data?.activeRoleId?.location?.primary?.address
                            ?.country
                        }
                      </Text>
                      <Text size="sm">
                        Registered on the{" "}
                        {format(new Date(data?.createdAt), "MMM d, yyyy")}
                      </Text>
                      <Text size="sm">Online</Text>
                    </VStack>
                    <Button
                      size="xs"
                      variant="link"
                      onPress={() => setShowCompanyProfile(false)}
                      isDisabled={isUploading}
                    >
                      <ButtonText className="text-btn-primary data-[hover=true]:no-underline data-[active=true]:no-underline">
                        VIEW USER PROFILE
                      </ButtonText>
                    </Button>
                  </HStack>
                </VStack>
              ) : (
                <VStack className="w-full">
                  <HStack className="h-full justify-between p-4">
                    <HStack className="gap-10">
                      <Card className="md:p-4 p-0 -mt-8 bg-white">
                        {/* Profile Picture */}
                        <div className="relative">
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
                            {userData?.id === id && (
                              <>
                                <button
                                  type="button"
                                  className={`absolute bottom-2 right-2 p-2 rounded-full ${
                                    isUploading
                                      ? "bg-gray-400 cursor-not-allowed"
                                      : "bg-gray-200 hover:bg-gray-300 cursor-pointer"
                                  }`}
                                  onClick={(e) => {
                                    triggerFileInput(e);
                                  }}
                                  disabled={isUploading}
                                >
                                  {isUploading ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="w-6 h-6 text-gray-700 animate-spin"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                                      />
                                    </svg>
                                  ) : (
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
                                        d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                                      />
                                    </svg>
                                  )}
                                </button>

                                <input
                                  id="profile-picture-upload"
                                  ref={fileInputRef}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleFileChange}
                                  disabled={isUploading}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </>
                            )}
                          </div>

                          {/* Mobile Avatar */}
                          <div className="md:hidden">
                            <Avatar size="2xl" className="relative">
                              <AvatarFallbackText>
                                {getInitial(
                                  data?.email || data?.firstName || ""
                                )}
                              </AvatarFallbackText>
                              <AvatarImage
                                source={{ uri: data?.profilePicture }}
                              />
                              {userData?.id === id && (
                                <>
                                  <button
                                    className={`absolute bottom-0 right-0 p-1 rounded-full ${
                                      isUploading
                                        ? "bg-gray-400"
                                        : "bg-gray-200 hover:bg-gray-300"
                                    }`}
                                    onClick={(e) => {
                                      triggerFileInput(e);
                                    }}
                                    disabled={isUploading}
                                  >
                                    {isUploading ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-4 h-4 text-gray-700 animate-spin"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-4 h-4 text-gray-700"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                                        />
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                                        />
                                      </svg>
                                    )}
                                  </button>
                                </>
                              )}
                            </Avatar>
                          </div>
                        </div>
                      </Card>
                      <VStack>
                        <Text>No user information to display.</Text>
                      </VStack>
                    </HStack>
                    <Button
                      variant="link"
                      size="xl"
                      onPress={() => setIsFavourite((prev) => !prev)}
                      isDisabled={isUploading}
                    >
                      <ButtonIcon
                        className={`w-8 h-8 ${
                          isFavourite && "text-red-500 fill-red-500"
                        }`}
                        as={FavouriteIcon}
                      />
                    </Button>
                  </HStack>
                  <HStack className="justify-between px-4 items-end">
                    <VStack className="gap-1">
                      <Heading className="mb-2" size="sm">
                        {data?.firstName} {data?.lastName}
                      </Heading>
                      <Text size="sm">
                        {
                          data?.activeRoleId?.location?.primary?.address
                            ?.country
                        }
                      </Text>
                      <Text size="sm">
                        Joined{" "}
                        {format(new Date(data?.createdAt), "MMM d, yyyy")}
                      </Text>
                      <Text size="sm">Online</Text>
                    </VStack>
                    {data.activeRoleId && (
                      <Button
                        size="xs"
                        variant="link"
                        onPress={() => setShowCompanyProfile(true)}
                        isDisabled={isUploading}
                      >
                        <ButtonText className="text-btn-primary data-[hover=true]:no-underline data-[active=true]:no-underline">
                          VIEW COMPANY PROFILE
                        </ButtonText>
                      </Button>
                    )}
                  </HStack>
                </VStack>
              )}
            </Card>
            {data?.activeRoleId?._id && showCompanyProfile && (
              <VStack className="w-full gap-4">
                <ReviewSection companyId={data.activeRoleId._id} />
              </VStack>
            )}
          </VStack>
          <VStack className="hidden md:flex w-1/4 items-center p-4 bg-[#F6F6F6]">
            <Button
              className="hidden bg-brand-primary"
              isDisabled={isUploading}
            >
              <ButtonIcon as={SettingsIcon} />
              <ButtonText>Account Settings</ButtonText>
            </Button>
            {data?.activeRoleId?._id && showCompanyProfile && (
              <VStack className="w-full gap-4">
                <ServiceSection companyId={data.activeRoleId._id} />
              </VStack>
            )}
          </VStack>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default ProfilePage;
