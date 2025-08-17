import { useEffect, useState, useCallback } from "react";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { FavouriteIcon, ShareIcon } from "@/components/ui/icon";
import { setUserFavourites } from "@/axios/users";
import { UserData, CompanyData, ReviewData } from "@/types";
import ReviewModal from "@/components/overlay/ReviewModal";
import { ReviewIcon } from "@/public/assets/icons/customIcons";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { usePathname } from "next/navigation";

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
  const [isProcessing, setIsProcessing] = useState(false);

  const toast = useToast();
  const pathname = usePathname();

  useEffect(() => {
    const hasFavourited = companyData?.favoritedBy?.includes(
      userData?.id ?? ""
    );
    setIsFavourite(hasFavourited ?? false);
  }, [companyData?.favoritedBy, userData?.id]);

  const isProfilePage = pathname.startsWith("/cpc");

  const handleFavourite = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      if (companyData?.owner === userData?.id) {
        showToast("You can't favorite your own company", "error");
        return;
      }

      const updatedCompany = await setUserFavourites(companyData?._id);

      const hasFavourited = updatedCompany?.favoritedBy.includes(
        userData?.id ?? ""
      );
      setIsFavourite(hasFavourited ?? false);

      showToast(
        hasFavourited ? "Added to favorites" : "Removed from favorites",
        "success"
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      showToast("Failed to update favorites", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const showToast = useCallback(
    (message: string, type: "error" | "success") => {
      toast.show({
        placement: "top",
        duration: 3000,
        render: ({ id }) => (
          <Toast nativeID={id} variant="outline" action={type}>
            <ToastTitle>{message}</ToastTitle>
          </Toast>
        ),
      });
    },
    [toast]
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: companyData?.companyName,
          url: window.location.href,
        })
        .catch(() => {
          // Fallback if share fails
          navigator.clipboard.writeText(window.location.href);
          showToast("Link copied to clipboard", "success");
        });
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard", "success");
    }
  };

  const handleWriteReview = () => {
    if (!userData) {
      showToast("Please sign in to write a review", "error");
      return;
    }
    if (companyData?.owner === userData?.id) {
      showToast("You can't review your own company", "error");
      return;
    }
    setWriteReview(true);
  };

  const buttons = [
    {
      name: "Write a Review",
      icon: ReviewIcon,
      action: handleWriteReview,
      disabled: companyData?.owner === userData?.id,
    },
    {
      name: "Share",
      icon: ShareIcon,
      action: handleShare,
      disabled: false,
    },
    {
      name: isFavourite ? "Favorited" : "Favorite",
      icon: FavouriteIcon,
      action: handleFavourite,
      disabled: companyData?.owner === userData?.id || isProcessing,
    },
  ];

  return (
    <>
      <VStack className="flex-row gap-4">
        {buttons.map((button, index) => (
          <Button
            key={index}
            size={isCompanyPage ? "xs" : "md"}
            variant={isProfilePage ? "outline" : "solid"}
            onPress={button.action}
            disabled={button.disabled}
            className="p-2 border-0 justify-between"
          >
            <ButtonIcon
              className={`
                ${
                  isFavourite && button.name.includes("Favorite")
                    ? "fill-red-500 text-red-500"
                    : ""
                }
                ${button.disabled ? "opacity-50" : ""}
              `}
              as={button.icon}
            />
            {!isProfilePage && (
              <ButtonText
                className={`
                ${isCompanyPage ? "text-xs" : "md:text-xs"}
                data-[hover=true]:no-underline
                data-[active=true]:no-underline
                ${button.disabled ? "opacity-50" : ""}
              `}
              >
                {button.name}
              </ButtonText>
            )}
          </Button>
        ))}
      </VStack>

      <ReviewModal
        companyId={companyData?._id}
        companyName={companyData?.companyName}
        isOpen={showWriteReview}
        onClose={() => setWriteReview(false)}
        setNewReviews={(reviews: ReviewData[]) => {
          setNewReviews?.(reviews);
        }}
      />
    </>
  );
}
