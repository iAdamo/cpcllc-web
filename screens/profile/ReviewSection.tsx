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
import RatingSection from "@/components/RatingSection";
import { format } from "date-fns";
import ReviewInfoModal from "@/components/overlays/ReviewInfoModal";

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
    <Card className="md:gap-6 gap-3">
      <Heading size="sm" className="md:text-xl  text-brand-primary">
        Reviews
      </Heading>

      {reviews.length === 0 ? (
        <Text size="xs" className="md:text-base text-gray-500">
          No reviews yet!
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
              <VStack className="">
                <HStack className="gap-3 items-start">
                  <Avatar className="md:w-12 md:h-12 w-10 h-10">
                    <AvatarFallbackText className="text-sm">
                      {getInitial(review.user?.firstName || review.user?.email)}
                    </AvatarFallbackText>
                    <AvatarImage
                      source={{ uri: review.user?.profilePicture || "" }}
                    />
                  </Avatar>

                  <VStack className="flex-1 gap-4">
                    <HStack className="justify-between items-start">
                      <VStack>
                        <Heading
                          size="xs"
                          className="md:text-md font-semibold text-gray-800"
                        >
                          {review.user?.firstName && review.user?.lastName
                            ? `${review.user.firstName} ${review.user.lastName}`
                            : "Anonymous User"}
                        </Heading>

                        <RatingSection rating={review.rating || 0} />
                      </VStack>
                      <Text size="xs" className="text-gray-400">
                        {format(new Date(review.createdAt), "MMM d, yyyy")}
                      </Text>
                    </HStack>
                    <Text
                      size="xs"
                      className={`md:text-sm text-gray-600 ${
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
              </VStack>
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
    </Card>
  );
};

export default ReviewSection;
