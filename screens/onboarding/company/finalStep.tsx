"use client";

import { VStack } from "@/components/ui/vstack";
import { Spinner } from "@/components/ui/spinner";
import { Icon, CheckIcon, CloseIcon } from "@/components/ui/icon";
import { useOnboarding } from "@/context/OnboardingContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/AuthContext";

const FinalStep = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const { data, submitData } = useOnboarding();
  const router = useRouter();
  const { userData, registerCompany, fetchUserProfile } = useSession();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (key === "subcategories") {
            const ids = value.map((item: { id: string }) => item.id);
            formData.append(key, JSON.stringify(ids));
          } else {
            value.forEach((file) => {
              if (file instanceof File) {
                formData.append(key, file);
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
      await registerCompany(formData);
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
            Profile updated successfully!
          </p>
        </VStack>
      )}
      {!loading && error && (
        <VStack className="items-center gap-4">
          <Icon as={CloseIcon} className="text-red-500" size="lg" />
          <p className="text-red-500 text-lg font-semibold">
            Failed to update profile. Please try again.
          </p>
        </VStack>
      )}
    </VStack>
  );
};

export default FinalStep;
