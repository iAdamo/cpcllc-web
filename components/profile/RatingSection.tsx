import { HStack } from "../ui/hstack";
import { Heading } from "../ui/heading";
import renderStars from "../RenderStars";

const RatingSection = ({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) => (
  <HStack className="gap-2 items-center">
    <HStack className="gap-1 items-center">
      {renderStars(rating)}
      <Heading className="text-md text-gray-500">{rating.toFixed(1)}</Heading>
    </HStack>
    <Heading className="text-md text-gray-500">({reviewCount} reviews)</Heading>
  </HStack>
);

export default RatingSection;
