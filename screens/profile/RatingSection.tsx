import { HStack } from "../../components/ui/hstack";
import { Heading } from "../../components/ui/heading";
import renderStars from "../../components/RenderStars";

const RatingSection = ({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) => (
  <HStack className="gap-2 items-center">
    {rating && (
      <HStack className="gap-1 items-center">
        {renderStars(rating)}

        <Heading size="xs" className="md:text-md text-gray-500">{rating.toFixed(1)}</Heading>
      </HStack>
    )}
    <Heading size="xs" className="md:text-md text-gray-500">
      {reviewCount === 0
        ? "No reviews"
        : `${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}`}
    </Heading>
  </HStack>
);

export default RatingSection;
