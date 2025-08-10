import { HStack } from "./ui/hstack";
import { Heading } from "./ui/heading";
import { Star } from "lucide-react";

const renderStars = (rating: number) => {
  const stars: JSX.Element[] = [];
  const fullStars = Math.floor(rating);
  const decimalPart = rating % 1;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      // Fully filled star
      stars.push(<Star key={i} size={16} fill="#FFD700" color="#FFD700" />);
    } else if (i === fullStars + 1 && decimalPart > 0) {
      // Partially filled star for the decimal part
      stars.push(
        <Star key={i} size={16} fill="url(#partialFill)" color="#D1D5DB">
          <defs>
            <linearGradient id="partialFill" x1="0" x2="1" y1="0" y2="0">
              <stop offset={`${decimalPart * 100}%`} stopColor="#FFD700" />
              <stop offset={`${decimalPart * 100}%`} stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
        </Star>
      );
    } else {
      // Empty star
      stars.push(<Star key={i} size={16} fill="#D1D5DB" color="#D1D5DB" />);
    }
  }

  return stars;
};

const RatingSection = ({
  rating,
  reviewCount,
}: {
  rating?: number; // Make rating optional
  reviewCount?: number;
}) => (
  <HStack className="gap-2">
    {rating !== undefined && rating > 0 && (
      <HStack className="gap-1">
        {renderStars(rating)}
        <Heading size="xs" className="md:text-md text-gray-500">
          {rating.toFixed(1)}
        </Heading>
      </HStack>
    )}
    {reviewCount !== undefined && reviewCount >= 0 && ( <Heading size="xs" className="md:text-md text-gray-500">
      {reviewCount === 0
        ? "No reviews"
        : `${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}`}
    </Heading>)}

  </HStack>
);

export default RatingSection;
