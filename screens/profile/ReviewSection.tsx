import { useEffect, useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { getReviews } from "@/axios/reviews";
import { ReviewData } from "@/types";
import { getInitial } from "@/utils/GetInitials";
import { Pressable } from "@/components/ui/pressable";
import renderStars from "@/components/RenderStars";
import { format } from "date-fns";
import ReviewInfoModal from "@/components/Overlays/ReviewInfoModal";

const ReviewSection = ({
  companyId,
  newReviews,
}: {
  companyId: string;
  newReviews?: ReviewData[];
}) => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [visibleReviews, setVisibleReviews] = useState<number>(3);
  const [reviewInfoModal, setReviewInfoModal] = useState<{
    isOpen: boolean;
    review?: ReviewData;
  }>({
    isOpen: false,
    review: undefined,
  });

  useEffect(() => {
    const handleReview = async () => {
      try {
        const reviews = await getReviews(companyId);
        setReviews(reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    if (newReviews && newReviews.length > 0) {
      setReviews((prev) => [...newReviews, ...prev]);
    } else {
      handleReview();
    }
  }, [companyId, newReviews]);

  const loadMoreReviews = () => {
    setVisibleReviews((prev) => prev + 3); // Show 3 more reviews
  };

  function showLessReviews(): void {
    setVisibleReviews((prev) => Math.max(prev - 3, 3)); // Ensure at least 3 reviews are visible
  }
  return (
    <VStack className="gap-6">
      <Heading className="text-xl font-bold text-brand-primary">
        Reviews
      </Heading>

      {reviews.length === 0 ? (
        <Text className="text-gray-500">
          No reviews yet. Be the first to review!
        </Text>
      ) : (
        <VStack className="gap-4">
          {reviewInfoModal.review && (
            <ReviewInfoModal
              isOpen={reviewInfoModal.isOpen}
              onClose={() =>
                setReviewInfoModal({ isOpen: false, review: undefined })
              }
              review={reviewInfoModal.review}
            />
          )}
          {reviews.slice(0, visibleReviews).map((review) => (
            <Pressable
              key={review._id}
              className="hover:bg-gray-50 transition-colors duration-200"
              onPress={() => {
                // open the id of the review in a modal
                setReviewInfoModal({
                  isOpen: true,
                  review: review,
                });
              }}
            >
              <Card variant="outline" className="">
                <HStack className="gap-3 items-start">
                  <Avatar className="w-12 h-12">
                    <AvatarFallbackText className="text-sm">
                      {getInitial(review.user?.firstName || review.user?.email)}
                    </AvatarFallbackText>
                    <AvatarImage
                      source={{ uri: review.user?.profilePicture || "" }}
                    />
                  </Avatar>

                  <VStack className="flex-1 gap-1">
                    <HStack className="justify-between items-start">
                      <VStack>
                        <Heading
                          size="sm"
                          className="font-semibold text-gray-800"
                        >
                          {review.user?.firstName && review.user?.lastName
                            ? `${review.user.firstName} ${review.user.lastName}`
                            : "Anonymous User"}
                        </Heading>
                        <HStack className="gap-1 items-center">
                          {renderStars(review.rating)}
                          <Text className="text-xs text-gray-500 ml-1">
                            {review.rating?.toFixed(1)}
                          </Text>
                        </HStack>
                      </VStack>
                      <Text className="text-xs text-gray-400">
                        {format(new Date(review.createdAt), "MMM d, yyyy")}
                      </Text>
                    </HStack>
                    <Text
                      className={`text-sm text-gray-600 ${
                        review.description.length > 80 && "line-clamp-3"
                      }`}
                    >
                      {review.description}
                    </Text>
                    {review.images && review.images.length > 0 && (
                      <Text className="text-sm text-gray-500">
                        {review.images.length} image
                        {review.images.length > 1 ? "s" : ""}
                      </Text>
                    )}
                  </VStack>
                </HStack>
              </Card>
            </Pressable>
          ))}

          <HStack className="self-end gap-4">
            {visibleReviews < reviews.length && (
              <Button variant="outline" size="xs" onPress={loadMoreReviews}>
                <ButtonText>More</ButtonText>
              </Button>
            )}

            {visibleReviews > 3 && (
              <Button variant="outline" size="xs" onPress={showLessReviews}>
                <ButtonText>Less</ButtonText>
              </Button>
            )}
          </HStack>
        </VStack>
      )}
    </VStack>
  );
};

export default ReviewSection;
