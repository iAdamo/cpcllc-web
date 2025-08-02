import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import {
  Modal,
  ModalCloseButton,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Icon, CloseIcon } from "@/components/ui/icon";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import Image from "next/image";
import ReactPlayer from "react-player";
import { getInitial } from "@/utils/GetInitials";
import { ServiceData } from "@/types";

const ServiceInfoModal = ({
  serviceData,
  isOpen,
  onClose,
}: {
  serviceData: ServiceData;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      className="fixed"
    >
      <ModalBackdrop />
      <ModalContent className="h-auto max-h-[32rem] max-w-3xl">
        <ModalHeader className="flex-row gap-3 items-start">
          <Avatar size="md" className="shrink-0">
            <AvatarFallbackText className="text-sm">
              {getInitial(serviceData?.company?.name || "Service")}
            </AvatarFallbackText>
            <AvatarImage source={{ uri: serviceData?.company?.logo || "" }} />
          </Avatar>
          <VStack className="flex-1 gap-1">
            <Heading size="sm" className="font-semibold text-gray-800">
              {serviceData?.title}
            </Heading>
          </VStack>
          <ModalCloseButton>
            <Icon
              as={CloseIcon}
              size="md"
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
            />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <VStack className="gap-4">
            {serviceData?.description && (
              <Text size="sm" className="text-gray-700">
                {serviceData.description}
              </Text>
            )}
            <VStack className="w-full">
              {serviceData?.images.length >= 1 &&
                serviceData.images.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`${serviceData.title} image ${index + 1}`}
                    width={500}
                    height={300}
                    className="rounded-lg h-52 w-full"
                  />
                ))}
            </VStack>
            <VStack className="flex-wrap">
              {serviceData?.videos.length >= 1 &&
                serviceData.videos.map((video, index) => (
                  <ReactPlayer
                    key={index}
                    url={video}
                    controls
                    width="500px"
                    height="300px"
                    className="rounded-lg"
                  />
                ))}
            </VStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack className="justify-end w-full">
            {/* Add any footer actions if needed */}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default ServiceInfoModal;
