import { useState, useEffect } from "react";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Pressable } from "@/components/ui/pressable";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AddIcon } from "@/components/ui/icon";
import { getServicesByCompany } from "@/axios/services";
import { ServiceData } from "@/types";
import ServiceInfoModal from "@/components/Overlays/ServiceInfoModal";

const ServiceSection = ({
  companyId,
  isCurrentUser,
}: {
  companyId: string;
  isCurrentUser: boolean;
}) => {
  const [services, setServices] = useState<ServiceData[] | []>([]);
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await getServicesByCompany(companyId);
        setServices(response);
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };

    fetchService();
  }, [companyId]);

  return (
    <VStack>
      {serviceData && (
        <ServiceInfoModal
          serviceData={serviceData}
          isOpen={!!serviceData}
          onClose={() => setServiceData(null)}
        />
      )}
      {isCurrentUser && (
        <Button
          onPress={() => router.push("/service/init")}
          className="mb-4 md:h-14 px-2 bg-brand-secondary data-[hover=true]:bg-brand-primary"
        >
          <ButtonIcon as={AddIcon} />
          <ButtonText size="sm" className="">
            What&apos;s New In Your Service
          </ButtonText>
        </Button>
      )}
      {isCurrentUser && services.length === 0 ? (
        <Text size="xs" className="md:text-md text-text-secondary text-center mt-8">
          No updates available for this service yet. Click the button above to
          add new updates.
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
                <Text size="sm" className="text-text-secondary line-clamp-3 ">
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
            <Button className="mt-4">
              <ButtonText>View All Updates</ButtonText>
            </Button>
          ) : (
            <Text size="xs" className="md:text-md text-text-secondary text-center mt-8">
              No updates available for this service.
            </Text>
          )}
        </VStack>
      )}
    </VStack>
  );
};

export default ServiceSection;
