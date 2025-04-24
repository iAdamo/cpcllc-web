"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { SettingsIcon, FavouriteIcon } from "@/components/ui/icon";
import { useSession } from "@/context/AuthContext";
import Image from "next/image";
import { userProfile } from "@/axios/users";
import { UserData } from "@/types";

const ProfilePage = () => {
  const { userData } = useSession();
  const { id } = useParams();
  const [isFavourite, setIsFavourite] = useState(false);
  const [showCompanyProfile, setShowCompanyProfile] = useState(false);
  let data: UserData | null = userData;

  if (!userData) return null;
  if (userData._id !== id) {
    const fetchUserData = async () => {
      if (typeof id === "string") {
        data = await userProfile(id);
      }
    };
    fetchUserData();
  }
  if (!data) return null;
  const date = new Date(data.createdAt);
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const formattedDate = date.toLocaleDateString(undefined, options);

  return (
    <VStack className="">
      <Image
        src="/assets/header10.jpg"
        alt="cover-image"
        width={1200}
        height={200}
        className="w-full"
      />
      <VStack className="h-full px-20 gap-8 -mt-4">
        <Card variant="outline" className="flex flex-row p-0 bg-white">
          <VStack className="w-3/4 border-r">
            {data?.activeRoleId?._id && showCompanyProfile ? (
              <>
                <VStack>
                  <HStack className="h-full justify-between p-4">
                    <HStack className="gap-10">
                      <Card variant="outline" className="-mt-8 bg-white">
                        <Image
                          className="object-cover h-56 w-56"
                          src={
                            data?.activeRoleId?.companyLogo ||
                            "/assets/default-profile.jpg"
                          }
                          alt="cover-image"
                          width={1200}
                          height={1200}
                        />
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
                      {data?.activeRoleId?.companyName}
                    </Heading>
                    <Text size="sm">
                      {
                        data?.activeRoleId?.location?.primary?.address
                          ?.country
                      }
                    </Text>
                    <Text size="sm">Joined {formattedDate}</Text>
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
              <>
                <VStack>
                  <HStack className="h-full justify-between p-4">
                    <HStack className="gap-10">
                      <Card variant="outline" className="-mt-8 bg-white">
                        <Image
                          className="object-cover h-56 w-56"
                          src={
                            data.profilePicture ||
                            "/assets/default-profile.jpg"
                          }
                          alt="cover-image"
                          width={4000}
                          height={4000}
                        />
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
                      {data?.username}
                    </Heading>
                    <Text size="sm">
                      {
                        data?.activeRoleId?.location?.primary?.address
                          ?.country
                      }
                    </Text>
                    <Text size="sm">Joined {formattedDate}</Text>
                    <Text size="sm">Online</Text>
                  </VStack>
                  {data && (
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
              </>
            )}
          </VStack>

          <VStack className="w-1/4 items-center p-4 bg-[#F6F6F6]">
            <Button className="bg-brand-primary">
              <ButtonIcon as={SettingsIcon} />
              <ButtonText>Account Settings</ButtonText>
            </Button>
          </VStack>
        </Card>
        <Card variant="filled">
          <Heading>Your Reviews</Heading>
          <HStack>
            {data?.services?.map((service) => (
              <Card key={service._id} className="w-1/4">
                <VStack>
                  <Text>{service.title}</Text>
                  <Text>{service.description}</Text>
                  <Text>{service.price}</Text>
                </VStack>
              </Card>
            ))}
          </HStack>
        </Card>
      </VStack>
    </VStack>
  );
};

export default ProfilePage;
