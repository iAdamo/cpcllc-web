"use client";

// import AiChat from "@/components/AiChatFab";
import { useEffect, useState, useCallback } from "react";
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
    isSearching,
    selectedSubcategories,
  } = useGlobalStore();
  const { id } = useParams();
  const router = useRouter();

  const handleProvidersSearch = useCallback(async () => {
    // console.log("Fetching providers with:", {
    //   sortBy,
    //   lat: currentLocation?.coords.latitude,
    //   long: currentLocation?.coords.longitude,
    //   categories,
    // });
    await executeSearch({
      model: "providers",
      page: 1,
      limit: 5,
      engine: false,
      featured: true,
      sortBy: sortBy,
      lat: currentLocation?.coords.latitude || "7.7427377",
      long: currentLocation?.coords.longitude || "4.5643091",
      city: currentLocation?.subregion || "",
      state: currentLocation?.region || "",
      country: currentLocation?.country || "Nigeria",
      categories: selectedSubcategories.map((s) => s._id),
    });
  }, []);

  useEffect(() => {
    // console.log(sortBy, currentLocation, categories);
    // if (!currentLocation) return;
    handleProvidersSearch();
  }, [handleProvidersSearch]);

  useEffect(() => {
    if (searchResults && searchResults.providers) {
      setProviders(searchResults.providers);
    }
  }, [searchResults]);

  return (
    <section id="companies" className="flex md:flex-row w-full h-full p-4">
      <ProvidersList providers={providers || []} />
      <VStack className="md:w-1/3 w-full"></VStack>
    </section>
  );
};

export default ServiceProvidersPage;
