import { useEffect, useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { getCompanies } from "@/axios/users";
import { CompanyData } from "@/types";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Pressable } from "@/components/ui/pressable";
import ServiceView from "./ServiceView";
import { GoogleMapsProvider } from "@/components/maps/GoogleMapsProvider";
import { InteractiveMap } from "@/components/maps/InteractiveMap";

const ServicesSection = () => {
  const [showInfo, setShowInfo] = useState(true);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCompanyIndex, setSelectedCompanyIndex] = useState<number>(0);

  const limit = 20;

  // Load from localStorage on initial mount
  useEffect(() => {
    const savedIndex = localStorage.getItem("selectedCompanyIndex");
    if (savedIndex !== null) {
      setSelectedCompanyIndex(parseInt(savedIndex));
    }
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      const { companies: response, totalPages } = await getCompanies(
        currentPage,
        limit,
      );
      setCompanies(response);
      setTotalPages(totalPages);
    };
    fetchCompanies();
  }, [currentPage]);

  // const changePage = (page: number) => {
  //  if (page >= 1 && page <= totalPages) {
  //    setCurrentPage(page);
  //  }
  //};

  const handleCompanySelect = (index: number) => {
    setSelectedCompanyIndex(index);
    setShowInfo(true);
    localStorage.setItem("selectedCompanyIndex", index.toString());
  };

  const options = [
    { name: "Settings", icon: null, action: () => {} },
    {
      name: "Info",
      icon: null,
      action: () => setShowInfo(true),
    },
    {
      name: "on Map",
      icon: null,
      action: () => setShowInfo(false),
    },
  ];

   const handleMarkerClick = (id: string) => {
     console.log("Marker clicked:", id);
     // Fetch more details about the listing, etc.
   };

   const handleMapClick = (location: google.maps.LatLngLiteral) => {
     console.log("Map clicked at:", location);
     // Maybe add a new listing at this location
   };

   // Example markers - in a real app these would come from your database
   const markers = [
     {
       id: "1",
       position: { lat: 40.7128, lng: -74.006 },
       title: "Sample Listing 1",
       content: "This is a sample listing for your marketplace",
     },
     // ... more markers
   ];


  const selectedCompany = companies[selectedCompanyIndex];

  return (
    <VStack className="md:flex-row mt-40 px-4 bg-[#F6F6F6]">
      <VStack className="w-1/3 h-3/5 mt-6  gap-4">
        <Card
          variant="outline"
          className="md:flex-row justify-between bg-white px-8 h-20 top-0"
        >
          {options.map((option, index) => (
            <Button variant="link" key={index} onPress={option.action}>
              <ButtonIcon
                // as={option.icon}
                className="text-gray-500 hover:text-gray-700"
                size="lg"
              />
              <ButtonText>{option.name}</ButtonText>
            </Button>
          ))}
        </Card>

        <VStack className="overflow-y-auto bg-white p-4 h-4/5">
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
                <VStack>
                  <Image
                    className="h-32 w-32 rounded-l-md object-cover"
                    src={company.companyImages[0] || "/assets/placeholder.jpg"}
                    alt={company.companyName || "Company Logo"}
                    width={1400}
                    height={600}
                  />
                </VStack>
                <VStack className="justify-between p-2">
                  <Heading>{company.companyName}</Heading>
                  <Text>{company.location?.primary?.address?.address}</Text>
                </VStack>
              </Card>
            </Pressable>
          ))}
        </VStack>
      </VStack>

      <VStack className="w-2/3 rounded-none p-6 bg-[#F6F6F6]">
        {showInfo ? (
          selectedCompany ? (
            <VStack className="">
              <ServiceView {...selectedCompany} />
            </VStack>
          ) : (
            <VStack className="p-4">
              <Text>No company selected.</Text>
            </VStack>
          )
        ) : (
          <VStack className="p-4">
            <Text className="text-lg font-semibold">Company Map</Text>
            <Text>
              {selectedCompany ? (
                <GoogleMapsProvider>
                  <div className="h-screen flex flex-col">
                    <header className="bg-white shadow-sm p-4">
                      <h1 className="text-xl font-bold">
                        Hyperlocal Marketplace
                      </h1>
                    </header>
                    <InteractiveMap
                      markers={markers}
                      onMarkerClick={handleMarkerClick}
                      onMapClick={handleMapClick}
                    />
                  </div>
                </GoogleMapsProvider>
              ) : (
                "Select a company to see its map."
              )}
            </Text>
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};

export default ServicesSection;
