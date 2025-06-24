"use client";
import { useEffect, useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
// import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { getCompanies } from "@/axios/users";
import { CompanyData } from "@/types";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Pressable } from "@/components/ui/pressable";
import CompanyView from "./CompanyView";
import GoogleMapComponent from "@/components/maps/GoogleMap";
import { useMapContext } from "@/context/MapContext";
import { useUserLocation } from "@/hooks/useUserLocation";
import Loader from "@/components/Loader";
// import { useParams } from "next/navigation";
// import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { searchCompanies } from "@/axios/users";

const CompaniesSection = () => {
  // const [showInfo, setShowInfo] = useState(true);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCompanyIndex, setSelectedCompanyIndex] = useState<number>(0);
  const { loading, error } = useMapContext();
  const [searchLoading, setSearchLoading] = useState(false);

  useUserLocation();
  const limit = 20;

  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";

  // Load from localStorage on initial mount
  //useEffect(() => {
  //const savedIndex = localStorage.getItem("selectedCompanyIndex");
  //if (savedIndex !== null) {
  //setSelectedCompanyIndex(parseInt(savedIndex));
  //}
  //}, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { companies: response, totalPages } = await getCompanies(
          currentPage,
          limit
        );
        setCompanies(response);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setCompanies([]); // Ensure companies is set to an empty array
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
      fetchCompaniesBySearch();
    }
  }, [currentPage, limit, category]);

  // Uncomment if you want to implement pagination

  // const changePage = (page: number) => {
  //  if (page >= 1 && page <= totalPages) {
  //    setCurrentPage(page);
  //  }
  //};

  if (loading && searchLoading && companies.length === 0) {
    return <Loader />;
  }

  if (error) {
    console.log(error);
    return <div className="error">{error}</div>;
  }

  const handleCompanySelect = (index: number) => {
    setSelectedCompanyIndex(index);
    // setShowInfo(true);
    localStorage.setItem("selectedCompanyIndex", index.toString());
  };

  // Removed duplicate declaration of selectedCoords
  const selectedCompany = companies[selectedCompanyIndex];

  return (
    <VStack className="mt-28 bg-[#F6F6F6]">
      <div className="rounded m-2 p-4">
        <h1 className="text-3xl font-bold text-brand-primary">{`${category} Service Providers Near You`}</h1>
      </div>
      <VStack className="md:flex-row bg-[#F6F6F6]">
        <VStack className="w-1/3 sticky top-32 mt-4 self-start h-fit gap-4">
          <Card
            variant="filled"
            className="overflow-y-auto bg-white min-h-0 max-h-[1500px]"
          >
            {companies.map((company, index) => (
              <Pressable
                key={index}
                onPress={() => handleCompanySelect(index)}
                className={`mb-4 hover:drop-shadow-md transition-shadow duration-300 focus:drop-shadow-blue-300 focus:shadow-lg rounded-lg ${
                  index === selectedCompanyIndex
                    ? "focus:shadow-blue-200 focus:shadow-lg"
                    : ""
                }`}
              >
                <Card
                  variant="outline"
                  className="flex-row w-full p-0 gap-4 bg-white"
                >
                  <Image
                    className="h-24 w-24 rounded-l-md object-cover"
                    src={company.companyImages[0] || "/assets/placeholder.jpg"}
                    alt={company.companyName || "Company Logo"}
                    width={1400}
                    height={600}
                  />
                  <VStack className="justify-between p-2">
                    <Heading className="text-md">{company.companyName}</Heading>
                    <Text className="text-xs text-gray-500">
                      {company.location?.primary?.address?.address.length > 42
                        ? `${company.location?.primary?.address?.address.substring(
                            0,
                            42
                          )}...`
                        : company.location?.primary?.address?.address}
                    </Text>
                  </VStack>
                </Card>
              </Pressable>
            ))}
          </Card>
        </VStack>

        {selectedCompany ? (
          <VStack className="w-2/3 rounded-none bg-[#F6F6F6]">
            <CompanyView {...selectedCompany} />
          </VStack>
        ) : (
          <VStack className="w-2/3 rounded-none p-6 bg-[#F6F6F6]">
            <Text>No company selected.</Text>
          </VStack>
        )}

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
