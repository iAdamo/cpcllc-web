"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { getCompanies, searchCompanies } from "@/axios/users";
import { CompanyData } from "@/types";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Pressable } from "@/components/ui/pressable";
import CompanyView from "./CompanyView";
import GoogleMapComponent from "@/components/maps/GoogleMap";
import { useMapContext } from "@/context/MapContext";
import { useUserLocation } from "@/hooks/useUserLocation";
import Loader from "@/components/Loader";
import { useSearchParams } from "next/navigation";
import { Button, ButtonText } from "@/components/ui/button";
import renderStars from "@/components/RenderStars";

const CompaniesSection = () => {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCompanyIndex, setSelectedCompanyIndex] = useState<number>(0);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const { loading, error } = useMapContext();
  useUserLocation();

  const limit = 20;
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "all";

  // ✅ Fetch companies (with pagination append)
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setPaginationLoading(true);
        const { companies: response, totalPages } = await getCompanies(
          currentPage,
          limit
        );

        setTotalPages(totalPages);
        setCompanies((prev) =>
          currentPage === 1 ? response : [...prev, ...response]
        );
      } catch (error) {
        console.error("Error fetching companies:", error);
        if (currentPage === 1) setCompanies([]);
      } finally {
        setPaginationLoading(false);
      }
    };

    const fetchCompaniesBySearch = async () => {
      setSearchLoading(true);
      try {
        const response = await searchCompanies(category);
        setCompanies(response);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setCompanies([]);
      } finally {
        setSearchLoading(false);
      }
    };

    if (category === "all") {
      fetchCompanies();
    } else {
      // If searching, always reset page to 1
      setCurrentPage(1);
      fetchCompaniesBySearch();
    }
  }, [currentPage, limit, category]);

  // ✅ Intersection Observer for infinite scroll
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
  //const observer = new IntersectionObserver(handleObserver, option);
  //if (loadMoreRef.current) observer.observe(loadMoreRef.current);
  //return () => {
  // if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
  //};
  //}, [handleObserver]);

  const handleCompanySelect = (index: number) => {
    setSelectedCompanyIndex(index);
    localStorage.setItem("selectedCompanyIndex", index.toString());
  };

  const selectedCompany = companies[selectedCompanyIndex];

  if ((loading || searchLoading) && companies.length === 0) {
    return <Loader />;
  }

  if (error) {
    console.log(error);
    return <div className="error">{error}</div>;
  }

  return (
    <VStack className="hidden md:flex mt-28 bg-[#F6F6F6]">
      <div className="rounded m-2 p-4">
        <h1 className="text-3xl font-bold text-brand-primary">{`${category} Service Providers Near You`}</h1>
      </div>
      <VStack className="md:flex-row bg-[#F6F6F6]">
        {/* Sidebar List */}
        <VStack className="w-1/3 sticky top-32 my-4 self-start h-fit gap-4">
          <Card
            variant="filled"
            className="overflow-y-auto bg-white min-h-0 max-h-[1500px] p-2"
          >
            {companies.map((company, index) => (
              <Pressable
                key={index}
                onPress={() => handleCompanySelect(index)}
                className={`mb-4 hover:drop-shadow-md transition-shadow duration-300 rounded-lg ${
                  index === selectedCompanyIndex
                    ? "ring-2 ring-brand-primary"
                    : ""
                }`}
              >
                <Card
                  variant="outline"
                  className="flex-row w-full p-0 gap-2 bg-white"
                >
                  <Image
                    className="h-24 w-24 rounded-l-md object-cover"
                    src={company?.companyImages?.[0] || "/assets/placeholder.jpg"}
                    alt={company?.companyName || "Company Logo"}
                    width={1400}
                    height={600}
                  />
                  <VStack className="justify-between p-2">
                    <Heading className="text-md">{company.companyName}</Heading>
                    <Text
                      className={`${
                        company.location?.primary?.address?.address.length >
                          32 && "line-clamp-2"
                      } text-xs text-gray-500`}
                    >
                      {company.location?.primary?.address?.address}
                    </Text>
                    <HStack className="gap-2 items-center">
                      <HStack className="gap-1 items-center">
                        {renderStars(company?.averageRating)}
                        <Text className="text-xs text-gray-500">
                          {company?.averageRating?.toFixed(1)}
                        </Text>
                      </HStack>
                      <Text className="text-xs text-gray-500">
                        ({company?.reviewCount} reviews)
                      </Text>
                    </HStack>
                  </VStack>
                </Card>
              </Pressable>
            ))}

            {/* Infinite Scroll Sentinel */}
            {category === "all" && (
              <div
                ref={loadMoreRef}
                className="w-full flex justify-center items-center h-16"
              >
                {paginationLoading && <Loader />}
                {!paginationLoading && currentPage < totalPages && (
                  <Button
                    size="sm"
                    variant="outline"
                    onPress={() => setCurrentPage((prev) => prev + 1)}
                  >
                    <ButtonText>Load More</ButtonText>
                  </Button>
                )}
                {!paginationLoading && currentPage >= totalPages && (
                  <Text className="text-gray-400 text-sm">
                    No more companies to load.
                  </Text>
                )}
              </div>
            )}
          </Card>
        </VStack>

        {/* Main Company View */}
        {selectedCompany ? (
          <VStack className="w-2/3 rounded-none bg-[#F6F6F6]">
            <CompanyView {...selectedCompany} />
          </VStack>
        ) : (
          <VStack className="w-2/3 rounded-none p-6 bg-[#F6F6F6]">
            <Text>No company selected.</Text>
          </VStack>
        )}

        {/* Map */}
        <VStack className="w-1/3 rounded-none pt-4 bg-[#F6F6F6] sticky top-24 h-[80vh] overflow-hidden">
          <div className="relative w-full h-full rounded-lg">
            <GoogleMapComponent
              apiKey={process.env.NEX_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
              companies={companies}
              selectedCompany={selectedCompany}
            />
          </div>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default CompaniesSection;
