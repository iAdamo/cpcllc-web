"use client";

// import AiChat from "@/components/AiChatFab";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProviderData } from "@/types";
import { useParams } from "next/navigation";
import useGlobalStore from "@/stores";
import { UserData } from "@/types";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import ProvidersList from "./ProvidersList";

const ServiceProvidersPage = () => {
  const [providers, setProviders] = useState<ProviderData[]>();
  const {
    searchResults,
    sortBy,
    executeSearch,
    currentLocation,
    categories,
    setCurrentView,
    isSearching,
    selectedSubcategories,
  } = useGlobalStore();
  const { id } = useParams();
  const router = useRouter();

  const handleProvidersSearch = async () => {
    // console.log("Fetching providers with:", {
    //   sortBy,
    //   lat: currentLocation?.coords.latitude,
    //   long: currentLocation?.coords.longitude,
    //   categories,
    // });
    await executeSearch({
      model: "providers",
      page: 1,
      limit: 50,
      engine: false,
      featured: true,
      sortBy: sortBy,
      lat: currentLocation?.coords.latitude,
      long: currentLocation?.coords.longitude,
      city: currentLocation?.subregion || "",
      state: currentLocation?.region || "",
      country: currentLocation?.country || "",
      categories: selectedSubcategories.map((s) => s._id),
    });
  };

  useEffect(() => {
    // console.log(sortBy, currentLocation, categories);
    if (!currentLocation) return;
    handleProvidersSearch();
  }, [sortBy, currentLocation, selectedSubcategories]);

  useEffect(() => {
    if (searchResults && searchResults.providers) {
      setProviders(searchResults.providers);
    }
  }, [searchResults]);

  return (
    <VStack className="md:flex-row w-full h-full p-4">
      <VStack className="md:w-full w-2/3">
        <ProvidersList providers={providers || []} />
      </VStack>
      <VStack className="md:w-full w-1/3"></VStack>
    </VStack>
  );
};

export default ServiceProvidersPage;
