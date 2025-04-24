import { useEffect, useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
// import { Text } from "@/components/ui/text";
import { getRandomServices } from "@/axios/services";
import { ServiceData } from "@/types";
import ServiceCard from "@/components/ServiceCard";

const ServicesSection = () => {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  useEffect(() => {
    const fetchServices = async () => {
      const { services, totalPages } = await getRandomServices(currentPage, limit);
      setServices(services);
      setTotalPages(totalPages); // Update total pages dynamically
    };
    fetchServices();
  }, [currentPage]);

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <VStack className="mt-32 p-10 gap-6">
      <VStack>
        <Heading>Services</Heading>
        <HStack className="grid md:grid-cols-4 grid-cols-2 gap-4 p-4">
          {services?.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </HStack>
      </VStack>

      {/* Pagination UI */}
      <HStack className="justify-center items-center gap-4">
        <Button
          onPress={() => changePage(currentPage - 1)}
          isDisabled={currentPage === 1}
        >
          <ButtonText>Prev</ButtonText>
        </Button>

        <Button
          onPress={() => changePage(currentPage + 1)}
          isDisabled={currentPage === totalPages}
        >
          <ButtonText>Next</ButtonText>
        </Button>
      </HStack>
      <HStack className="gap-2 justify-center items-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index + 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onPress={() => changePage(index + 1)}
          >
            <ButtonText>{index + 1}</ButtonText>
          </Button>
        ))}
      </HStack>
    </VStack>
  );
};

export default ServicesSection;
