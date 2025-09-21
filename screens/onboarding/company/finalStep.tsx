"use client";

import { VStack } from "@/components/ui/vstack";
import { Spinner } from "@/components/ui/spinner";
import { Icon, CheckIcon, CloseIcon } from "@/components/ui/icon";
import { useOnboarding } from "@/context/OnboardingContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/AuthContext";
import { useTranslation } from "@/context/TranslationContext"; // Add this import

const FinalStep = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const { data, submitData } = useOnboarding();
  const router = useRouter();
  const { userData, createProviderProfile, fetchUserProfile } = useSession();
  const { t } = useTranslation(); // Add this hook
  // console.log("FinalStep data:", data);
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        // Skip firstName, lastName, and profilePicture
        if (["firstName", "lastName", "profilePicture"].includes(key)) return;
        if (Array.isArray(value)) {
          if (key === "subcategories") {
            const ids = value.map(
              (item: { categoryId: string; _id: string }) => ({
                category: item.categoryId,
                subcategory: item._id,
              })
            );
            ids.forEach(
              (id) => (
                formData.append("subcategories[]", id.subcategory),
                formData.append("categories[]", id.category)
              )
            );
          } else {
            value.forEach((file, idx) => {
              if (file instanceof File) {
                formData.append(key, file, `providerImage-${idx}`);
              }
            });
          }
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (
          [
            "latitude",
            "longitude",
            "zip",
            "city",
            "state",
            "country",
            "address",
          ].includes(key)
        ) {
          const locationKeyMap: Record<string, string> = {
            latitude: "location[primary][coordinates][lat]",
            longitude: "location[primary][coordinates][long]",
            zip: "location[primary][address][zip]",
            city: "location[primary][address][city]",
            state: "location[primary][address][state]",
            country: "location[primary][address][country]",
            address: "location[primary][address][address]",
          };
          formData.append(locationKeyMap[key], value as string);
        } else {
          formData.append(key, value as string);
        }
      });
       console.log("Submitting formData:", Array.from(formData.entries()));
      await createProviderProfile(formData);
      await fetchUserProfile();
      setSuccess(true);
      submitData();
      router.replace(`/cpc/${userData?.id}`);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(true);
    } finally {
      setLoading(false);
      // router.replace(`/cpc/${userData?.activeRoleId?._id}`);
    }
  };

  useEffect(() => {
    handleSubmit(); // Automatically send the request when the component loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VStack className="w-full h-screen bg-white p-8 gap-8 justify-center items-center">
      {loading && <Spinner size="large" />} {/* Show spinner while loading */}
      {!loading && success && (
        <VStack className="items-center gap-4">
          <Icon as={CheckIcon} className="text-green-500" size="lg" />
          <p className="text-green-500 text-lg font-semibold">
            {t("profileUpdatedSuccess")}
          </p>
        </VStack>
      )}
      {!loading && error && (
        <VStack className="items-center gap-4">
          <Icon as={CloseIcon} className="text-red-500" size="lg" />
          <p className="text-red-500 text-lg font-semibold">
            {t("profileUpdateFailed")}
          </p>
        </VStack>
      )}
    </VStack>
  );
};

export default FinalStep;
