import { useEffect, useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { FavouriteIcon, ShareIcon } from "@/components/ui/icon";
import { setUserFavourites } from "@/axios/users";
import { UserData, CompanyData, ReviewData } from "@/types";
import { useRouter } from "next/navigation";
import { ReviewModal } from "@/components/Overlays/ReviewModal";
import { ReviewIcon } from "@/public/assets/icons/customIcons";

interface ActionButtonsProps {
  companyData: CompanyData;
  userData: UserData | null;
  isCompanyPage?: boolean;
  setNewReviews?: (reviews: ReviewData[]) => void;
}

export default function ActionButtons({
  companyData,
  userData,
  isCompanyPage,
  setNewReviews,
}: ActionButtonsProps) {
  const [isFavourite, setIsFavourite] = useState(false);
  const [showWriteReview, setWriteReview] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const hasFavourited = companyData?.favoritedBy.includes(userData?.id ?? "");
    setIsFavourite(hasFavourited ?? false);
  }, [companyData?.favoritedBy, userData?.id]);

  const handleFavourite = async () => {
    try {
      if (!companyData?._id) return;

      const updatedCompany = await setUserFavourites(companyData?._id);
      const hasFavourited = updatedCompany?.favoritedBy.includes(
        userData?.id ?? ""
      );
      setIsFavourite(hasFavourited ?? false);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };
  const buttons = [
    {
      name: "Write a Review",
      icon: ReviewIcon,
      action: () => {
        if (companyData?.owner !== userData?.id) {
          setWriteReview(true);
        }
      },
    },
    {
      name: "Share",
      icon: ShareIcon,
      action: () => router.forward(),
    },
    {
      name: "Favorite",
      icon: FavouriteIcon,
      action: () => {
        if (companyData?.owner !== userData?.id) {
          handleFavourite();
        }
      },
    },
  ];

  return (
    <VStack className="flex-row gap-4 w-fit">
      {ReviewModal({
        companyId: companyData?._id,
        companyName: companyData?.companyName,
        isOpen: showWriteReview,
        onClose: () => setWriteReview(false),
        setNewReviews(reviews: ReviewData[]) {
          setNewReviews?.(reviews);
        },
      })}
      {buttons.map((button, index) => (
        <Button key={index} onPress={button.action} className="justify-between">
          <ButtonIcon
            className={`${
              isFavourite &&
              "fill-red-500 border-red-500 text-red-500 font-extrabold"
            }`}
            as={button.icon}
          />
          <ButtonText
            className={`${
              !isCompanyPage && "text-xs"
            } data-[hover=true]:no-underline data-[active=true]:no-underline`}
          >
            {button.name}
          </ButtonText>
        </Button>
      ))}
    </VStack>
  );
}
