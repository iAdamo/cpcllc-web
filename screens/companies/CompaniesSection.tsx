"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { globalSearch } from "@/axios/search";
import { CompanyData } from "@/types";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Pressable } from "@/components/ui/pressable";
import CompanyView from "./CompanyView";
import GoogleMapComponent from "@/components/maps/GoogleMap";
import Loader from "@/components/Loader";
import { useSearchParams } from "next/navigation";
import { Button, ButtonText } from "@/components/ui/button";
import { MapProvider } from "@/context/MapContext";
import { useRouter } from "next/navigation";
import RatingSection from "@/components/RatingSection";
import { useMediaQuery } from "@/components/ui/utils/use-media-query";
import { getCurrentLocation } from "@/utils/GeoLocation";
import { useTranslation } from "@/context/TranslationContext";

const CompaniesSection = () => {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCompanyIndex, setSelectedCompanyIndex] = useState<number>(0);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const { t } = useTranslation();
  const limit = 20;
  const [isMobile] = useMediaQuery([{ maxWidth: 768 }]);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const router = useRouter();

  useEffect(() => {
    const fetchCompaniesBySearch = async () => {
      setSearchLoading(true);
      setPaginationLoading(true);
      try {
        const coords = await getCurrentLocation();
        const lat = coords?.lat;
        const long = coords?.long;

        const { providers: response, totalPages } = await globalSearch(
          currentPage,
          limit,
          false,
          category,
          lat,
          long
        );
        setTotalPages(totalPages);
        setCompanies((prev) =>
          currentPage === 1 ? response : [...prev, ...response]
        );
        console.log("Fetched companies:", response);
        setCompanies(response);
      } catch (error) {
        console.error("Error fetching companies:", error);
        if (currentPage === 1) setCompanies([]);
      } finally {
        setSearchLoading(false);
        setPaginationLoading(false);
      }
    };

    fetchCompaniesBySearch();
  }, [currentPage, limit, category, companies.length]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (
        target.isIntersecting &&
        !paginationLoading &&
        currentPage < totalPages &&
        category === "all"
      ) {
        setCurrentPage((prev) => prev + 1);
      }
    },
    [paginationLoading, currentPage, totalPages, category]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [handleObserver]);

  const handleCompanySelect = (index: number) => {
    setSelectedCompanyIndex(index);
    localStorage.setItem("selectedCompanyIndex", index.toString());
  };

  const selectedCompany = companies[selectedCompanyIndex];

  if (searchLoading && companies.length === 0) {
    return <Loader />;
  }

  return (
    <VStack className="md:mt-28 mt-32 bg-[#F6F6F6]">
      <div className="rounded md:m-2 p-4">
        <h1 className="md:text-3xl text-xl font-bold text-brand-primary">
          {`${category.charAt(0).toUpperCase() + category.slice(1)} ${t(
            "companies.serviceProvidersNearYou"
          )}`}
        </h1>
      </div>
      <VStack className="md:flex-row bg-[#F6F6F6]">
        {/* Sidebar List */}
        <VStack className="md:w-1/3 w-full md:sticky md:top-32 md:my-4 self-start h-fit gap-4">
          <Card
            variant="filled"
            className="overflow-auto md:flex grid grid-cols-2 gap-2 md:bg-white min-h-0 max-h-[1500px] p-2"
          >
            {companies.map((provider, index) => (
              <Pressable
                key={index}
                onPress={() =>
                  isMobile
                    ? router.push(`companies/${provider?._id}`)
                    : handleCompanySelect(index)
                }
                className={`mb-4 hover:drop-shadow-md transition-shadow duration-300 rounded-lg ${
                  index === selectedCompanyIndex
                    ? "ring-2 ring-brand-primary"
                    : ""
                }`}
              >
                <Card
                  variant="outline"
                  className="md:flex-row w-full p-0 gap-2 bg-white"
                >
                  <Image
                    className="md:h-28 md:w-24 h-40 w-full md:rounded-l-md md:rounded-r-none rounded-t-md object-cover"
                    src={
                      provider?.providerLogo || "/assets/placeholder.jpg"
                    }
                    alt={provider?.providerName || "Company Logo"}
                    width={1400}
                    height={600}
                  />
                  <VStack className="justify-between p-2 md:p-1 md:h-auto h-28">
                    <Heading className="text-md">{provider.providerName}</Heading>
                    <Text
                      className={`${
                        provider.location?.primary?.address?.address.length >
                          32 && "line-clamp-2"
                      } text-xs text-gray-500`}
                    >
                      {provider.location?.primary?.address?.address}
                    </Text>
                    <RatingSection
                      rating={provider?.averageRating || 0}
                      reviewCount={provider?.reviewCount || 0}
                    />
                  </VStack>
                </Card>
              </Pressable>
            ))}

            {/* Infinite Scroll Sentinel */}
            {category === "all" && (
              <div
                ref={loadMoreRef}
                className="w-full flex justify-center items-center h-fit"
              >
                {paginationLoading && <Loader />}
                {!paginationLoading && currentPage < totalPages && (
                  <Button
                    size="xs"
                    variant="outline"
                    onPress={() => setCurrentPage((prev) => prev + 1)}
                  >
                    <ButtonText>{t("companies.loadMore")}</ButtonText>
                  </Button>
                )}
                {!paginationLoading && currentPage >= totalPages && (
                  <Text className="text-gray-400 text-xs md:text-sm">
                    {t("companies.noMoreCompanies")}
                  </Text>
                )}
              </div>
            )}
          </Card>
        </VStack>

        {/* Main Company View */}
        {!isMobile &&
          (selectedCompany ? (
            <VStack className="w-2/3 rounded-none bg-[#F6F6F6]">
              <CompanyView {...selectedCompany} />
            </VStack>
          ) : (
            <VStack className="w-2/3 rounded-none p-6 bg-[#F6F6F6]">
              <Text>{t("companies.noCompanySelected")}</Text>
            </VStack>
          ))}

        {/* Map */}
        {!isMobile && (
          <VStack className="hidden md:flex w-1/3 rounded-none pt-4 bg-[#F6F6F6] sticky top-24 h-[80vh] overflow-hidden">
            <div className="relative w-full h-full rounded-lg">
              <MapProvider>
                <GoogleMapComponent
                  apiKey={process.env.NEX_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
                  companies={companies}
                  selectedCompany={selectedCompany}
                />
              </MapProvider>
            </div>
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};

export default CompaniesSection;
