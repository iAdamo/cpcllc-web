"use client";

import { VStack } from "@/components/ui/vstack";
import { Spinner } from "@/components/ui/spinner";
import { Icon, CheckIcon, CloseIcon } from "@/components/ui/icon";
import { useOnboarding } from "@/context/OnboardingContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/AuthContext";

const FinalStep = () => {
  const [loading, setLoading] = useState(true); // Spinner initially visible
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const { data, submitData } = useOnboarding();
  const router = useRouter();
  const { registerCompany } = useSession();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value as string);
        }
      });
      await registerCompany(formData);
      setSuccess(true);
      submitData(); // Clear onboarding data
      router.replace("/dashboard");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(true);
    } finally {
      setLoading(false);
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
