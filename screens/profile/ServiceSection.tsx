import { useState, useEffect } from "react";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Pressable } from "@/components/ui/pressable";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AddIcon, ArrowRightIcon, ArrowLeftIcon } from "@/components/ui/icon";
import { getServicesByCompany } from "@/axios/services";
import { CompanyData, ServiceData } from "@/types";
import ServiceInfoModal from "@/components/overlays/ServiceInfoModal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const ServiceSection = ({
  company,
  isCurrentUser,
  isProfilePage,
  isCompanyPage,
  isMobile,
}: {
  company: CompanyData;
  isCurrentUser?: boolean;
  isProfilePage?: boolean;
  isCompanyPage?: boolean;
  isMobile?: boolean;
}) => {
  const [services, setServices] = useState<ServiceData[] | []>([]);
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const router = useRouter();

  // Example: If you want to build params from an array of services in company.servicesProvided
  // (assuming company.servicesProvided is an array of strings or similar)
  const params = new URLSearchParams(
    (company.subcategories || []).map((service, idx) => [
      `serviceprovided${idx}`,
      typeof service === "string" ? service : service.name || String(service),
    ])
  );

  // alert(company.services);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await getServicesByCompany(company._id);
        setServices(response);
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };

    fetchService();
  }, [company._id]);

  return (
    <VStack>
      {serviceData && (
        <ServiceInfoModal
          serviceData={serviceData}
          isOpen={!!serviceData}
          onClose={() => setServiceData(null)}
          isEditable={isProfilePage && isCurrentUser} // Pass whether it's editable
        />
      )}
      {isProfilePage ? (
        <VStack>
          {isCurrentUser && (
            <Button
              size="md"
              onPress={() => router.push(`/service/init?${params.toString()}`)}
              className="mb-4 md:h-14 px-2 bg-brand-secondary data-[hover=true]:bg-brand-primary"
            >
              <ButtonIcon as={AddIcon} />
              <ButtonText size="sm" className="">
                What&apos;s New In Your Service
              </ButtonText>
            </Button>
          )}
          {isCurrentUser && services.length === 0 ? (
            <Text
              size="xs"
              className="md:text-base text-text-secondary text-center mt-8"
            >
              No updates available for this service yet. Click the button to add
              new updates.
            </Text>
          ) : (
            <VStack>
              {services.map((update: ServiceData) => (
                <Pressable
                  key={update._id}
                  onPress={() => {
                    setServiceData(update);
                  }}
                  className="gap-4 md:drop-shadow-2xl transform transition-transform duration-300 hover:scale-95"
                >
                  <Card className="p-4 border gap-2">
                    <Heading size="sm" className="text-typography-600">
                      {update.title}
                    </Heading>
                    <Text size="sm" className="break-words line-clamp-3 ">
                      {update.description}
                    </Text>
                    <Heading
                      size="xs"
                      className="w-fit px-2 py-1 rounded-xl bg-gray-200 font-medium text-teal-800 shadow-sm"
                    >
                      {update.category}
                    </Heading>
                    <Image
                      src={update.images[0] || "/assets/header10.jpg"}
                      alt={update.title}
                      width={1300}
                      height={1000}
                      className="object-cover h-40 rounded-md"
                    />
                  </Card>
                </Pressable>
              ))}
              {isCurrentUser && services.length !== 0 ? (
                <Button size="md" className="mt-4">
                  <ButtonText>View All Updates</ButtonText>
                </Button>
              ) : (
                <Text
                  size="xs"
                  className="md:text-base text-text-secondary text-center mt-8"
                >
                  No updates available for this company.
                </Text>
              )}
            </VStack>
          )}
        </VStack>
      ) : (
        <VStack space="2xl" className="px-4">
          <Heading
            size="sm"
            className={`${
              isCompanyPage ? "md:text-lg" : "md:text-sm"
            } font-bold text-brand-primary`}
          >
            Updates from this service provider
          </Heading>
          {services.length > 0 ? (
            <div className="relative w-full">
              {/* Left button */}
              <Button
                size="sm"
                variant="outline"
                className="swiper-button-prev absolute top-1/2 -left-4 z-10 -translate-y-1/2"
              >
                <ButtonIcon as={ArrowLeftIcon} className="text-black" />
              </Button>

              {/* Swiper */}
              <Swiper
                modules={[Navigation, Pagination]}
                className="w-full"
                spaceBetween={10}
                slidesPerView={isMobile ? 1.3 : isCompanyPage ? 2.3 : 1.3}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
              >
                {services.map((service: ServiceData) => {
                  return (
                    <SwiperSlide key={service._id}>
                      <Pressable onPress={() => setServiceData(service)}>
                        <Card variant="outline" className="md:flex-row gap-2">
                          <Image
                            className={`object-cover ${
                              isCompanyPage ? "h-32 md:w-32" : "h-28 w-28"
                            }`}
                            src={service.images[0]}
                            alt="portfolio-image"
                            width={1200}
                            height={1200}
                          />
                          <VStack className="h-auto gap-2">
                            <Heading
                              size="xs"
                              className={`${
                                isCompanyPage ? "md:text-md" : "md:text-sm"
                              }`}
                            >
                              {service.title}
                            </Heading>
                            <Text
                              size="xs"
                              className={`${
                                service.description.length > 80 &&
                                "line-clamp-3"
                              } ${
                                isCompanyPage ? "md:text-md" : "md:text-sm"
                              } break-words`}
                            >
                              {service.description}
                            </Text>
                          </VStack>
                        </Card>
                      </Pressable>
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              {/* Right button */}
              <Button
                size="sm"
                variant="outline"
                className="swiper-button-next absolute top-1/2 -right-4 z-10 -translate-y-1/2"
              >
                <ButtonIcon as={ArrowRightIcon} />
              </Button>
            </div>
          ) : (
            <Text size="xs" className="md:text-sm">
              No updates from this company
            </Text>
          )}
        </VStack>
      )}
    </VStack>
  );
};

export default ServiceSection;
