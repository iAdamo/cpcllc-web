import { useState, useEffect, useMemo } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Card } from "@/components/ui/card";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { ProviderData, MediaItem } from "@/types";
import { SearchEngine } from "@/components/SearchEngine";
import useGlobalStore from "@/stores";
import { SvgXml } from "react-native-svg";
import CategoriesSection from "@/screens/providers/CategoriesSection";
import Image from "next/image";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { MapPinIcon, Heart, Share2, Star } from "lucide-react-native";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import RatingSection from "@/components/RatingFunction";
// import { useRouter } from "next/router";

const ProviderCard = ({ provider }: { provider: ProviderData }) => {
  // const router = useRouter();

  const { user, savedProviders, setSavedProviders } = useGlobalStore();
  const handlePress = () => {
    // router.push({
    //   pathname: "/profile/[id]",
    //   // params: { id: provider.owner },
    // });
  };

  const savedProviderIds = savedProviders.map((p) => p._id);
  const isSaved = savedProviderIds.includes(provider._id);

  const handleSaveToggle = async () => {
    await setSavedProviders(provider._id);
  };

  // Extract image sources safely
  const mainImageSource = provider.providerImages?.[0] as MediaItem;
  const logoSource = provider.providerLogo as MediaItem;
  const rating = provider.averageRating || 0;
  const reviewCount = provider.reviewCount || 0;
  const address =
    provider?.location?.primary?.address?.address || "Location not specified";
  const subcategoryName = provider?.subcategories?.[0]?.name || "Service";
  const subcategoryIcon = provider?.subcategories?.[0]?.icon;
  const subcategoryIconColor =
    provider?.subcategories?.[0]?.iconColor || "#ccc";

  return (
    <Card className="p-0 h-32 flex-row border bg-white border-gray-100">
      {/* Image Section */}
      <Image
        src={mainImageSource?.thumbnail ? mainImageSource.thumbnail : undefined}
        alt={provider.providerName}
        // style={{ width: "100%", height: "100%" }}
        width={128}
        height={128}
        quality={100}
        className="rounded-lg w-32 h-32 flex-1"
      />

      {/* Content Section */}
      <VStack className="flex-row p-2 gap-4">
        {/* Provider Info */}
        <VStack className="flex-1">
          <HStack className="items-start mb-1 gap-1">
            <Avatar size="xs" className="border border-gray-200">
              <AvatarImage source={{ uri: logoSource.thumbnail }} />
              <AvatarFallbackText>{provider.providerName}</AvatarFallbackText>
            </Avatar>

            <VStack className="ml-2 flex-1">
              <Heading
                size="sm"
                className="font-bold text-gray-900 line-clamp-1"
              >
                {provider.providerName}
              </Heading>
              <RatingSection rating={rating} reviewCount={reviewCount} />

              <Badge className="bg-transparent px-0 gap-1">
                <SvgXml
                  xml={subcategoryIcon}
                  width={16}
                  height={16}
                  color={subcategoryIconColor}
                />
                <BadgeText className="text-xs font-medium">
                  {subcategoryName}
                </BadgeText>
              </Badge>
            </VStack>
          </HStack>

          <Text className="text-sm text-gray-600 line-clamp-1">
            {provider.providerDescription}
          </Text>
          <HStack className="items-center flex-1" space="xs">
            <MapPinIcon size={12} color="#ef4444" />
            <Text className="text-xs text-gray-500 line-clamp-1 flex-1">
              {address}
            </Text>
          </HStack>
        </VStack>

        {/* Bottom Row */}
        <VStack className="justify-between items-end">
          {/* Rating & Actions */}
          {/* <HStack className="items-center" space="sm">
              {rating > 0 && (
                <HStack className="items-center">
                  <Star size={12} color="#f59e0b" fill="#f59e0b" />
                  <Text className="text-xs font-semibold ml-1">
                    {rating.toFixed(1)}
                  </Text>
                </HStack>
              )}

              <Button
                onPress={(e) => {
                  e.stopPropagation();
                  // handleShare();
                }}
                variant="link"
                className="h-7 w-7 p-0"
              >
                <ButtonIcon as={Share2} size="xs" className="text-gray-400" />
              </Button>
            </HStack> */}

          {/* Save Button */}
          <Button
            onPress={(e) => {
              e.stopPropagation();
              handleSaveToggle();
            }}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm rounded-full h-8 w-8 p-0 border-0"
          >
            <ButtonIcon
              as={Heart}
              className={`
                    ${isSaved ? "text-red-500 fill-red-500" : "text-gray-400"}
                  `}
              size="xs"
            />
          </Button>
          <Button onPress={handlePress} size="xs" className="bg-brand-primary">
            <ButtonText>View Profile</ButtonText>
          </Button>
        </VStack>
      </VStack>
    </Card>
  );
};

const ProvidersList = ({ providers }: { providers: ProviderData[] }) => {
  return (
    <VStack className="md:3/5 flex-1 gap-8 h-full">
      <SearchEngine />
      <VStack className="flex-1 md:flex-row gap-8">
        <CategoriesSection />
        <VStack className="w-3/5">
          <VStack className="gap-2 ">
            {providers.map((provider: ProviderData, idx) => (
              <ProviderCard key={idx} provider={provider} />
            ))}
          </VStack>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default ProvidersList;
