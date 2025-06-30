import { useEffect, useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Button, ButtonText } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HStack } from "@/components/ui/hstack";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { getReviews } from "@/axios/reviews";
import { CompanyData, ReviewData } from "@/types";
import { getInitial } from "@/utils/GetInitials";
import { Pressable } from "@/components/ui/pressable";
import { ReviewModal } from "@/components/Overlays/ReviewModal";

const ReviewSection = ({ companyId }: { companyId: string }) => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);

  const router = useRouter();

  useEffect(() => {
    const handleReview = async () => {
      try {
        const reviews = await getReviews(companyId);
        setReviews(reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    handleReview();
  }, [companyId]);

  return (
    <VStack className="gap-4">
      <Heading className="text-text-tertiary">Reviews</Heading>
      {reviews.map((review, index) => (
        <Pressable key={index}>
          <Card variant="outline" className="gap-2">
            <HStack className="gap-4 items-center">
              <Avatar className="w-10 h-10">
                <AvatarFallbackText>
                  {getInitial(review.user?.firstName || review.user?.email)}
                </AvatarFallbackText>
                <AvatarImage
                  source={{ uri: review.user?.profilePicture || "" }}
                />
              </Avatar>
              <Heading size="xs" className="font-bold">
                {review.user?.firstName && review.user?.lastName
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
  );
};

export default ReviewSection;
