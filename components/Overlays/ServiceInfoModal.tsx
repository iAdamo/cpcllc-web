"use client";

import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
// import { Button, ButtonText } from "@/components/ui/button";
import {
  Modal,
  ModalCloseButton,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
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
      <ModalContent className="w-full max-w-4xl h-screen md:max-h-[38rem] md:flex-row p-0">
        <ModalCloseButton className="md:hidden ml-4 mt-4">
          <Icon
            as={CloseIcon}
            size="lg"
            className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
          />
        </ModalCloseButton>
        <div className="flex flex-col md:flex-row w-full h-full overflow-y-auto">
          {/* Left side - Header content */}
          <ModalHeader className="md:w-1/2 p-4 flex-col">
            <VStack className="gap-4 items-start">
              <HStack space="lg">
                <Avatar size="md" className="shrink-0">
                  <AvatarFallbackText className="text-sm">
                    {getInitial(serviceData?.company?.name || "Service")}
                  </AvatarFallbackText>
                  <AvatarImage
                    source={{ uri: serviceData?.company?.logo || "" }}
                  />
                </Avatar>
                <Heading size="sm" className="md:text-xl text-gray-800">
                  {serviceData?.title}
                </Heading>
              </HStack>

              {serviceData?.description && (
                <Card variant="filled" className="gap-2">
                  <Heading size="xs" className="text-typography-700">
                    Description
                  </Heading>
                  <Text size="xs" className="md:text-sm text-gray-700">
                    {serviceData.description}
                  </Text>
                </Card>
              )}
              <HStack className="w-full justify-between ">
                <Card variant="filled" className="gap-2 h-fit">
                  <Heading size="xs" className="text-typography-700">
                    Category
                  </Heading>
                  <Text
                    size="xs"
                    className="p-2 md:text-sm text-gray-700 bg-white rounded"
                  >
                    {serviceData?.category || "Uncategorized"}
                  </Text>
                </Card>
                <Card variant="filled" className="gap-2">
                  <Heading size="xs" className="text-typography-700">
                    Services Provided
                  </Heading>
                  <HStack className="grid grid-cols-2 gap-2">
                    {serviceData?.tags.map((tag, index) => (
                      <Text
                        key={index}
                        size="xs"
                        className="p-1 md:text-sm text-gray-700 bg-white rounded"
                      >
                        {tag}
                      </Text>
                    ))}
                  </HStack>
                </Card>
              </HStack>
              <HStack className="w-full justify-between">
                <Card variant="filled" className="gap-2">
                  <Heading size="xs" className="text-typography-700">
                    Service Charges
                  </Heading>
                  <Text
                    size="xs"
                    className="p-2 md:text-sm text-gray-700 bg-white rounded"
                  >
                    {`Service charges from $${serviceData?.price}`}
                  </Text>
                </Card>
                <Card variant="filled" className="gap-2">
                  <Heading size="xs" className="text-typography-700">
                    Estimated Time
                  </Heading>
                  <Text
                    size="xs"
                    className="p-2 md:text-sm text-gray-700 bg-white rounded"
                  >
                    {`${serviceData?.price} mins`}
                  </Text>
                </Card>
              </HStack>
              <Card variant="filled" className="w-full gap-2">
                <Heading size="xs" className="text-typography-700">
                  Contact Information
                </Heading>
                <Text size="xs" className="md:text-sm text-gray-700">
                  {serviceData?.company?.contact || "Not Provided"}
                </Text>
              </Card>
            </VStack>
          </ModalHeader>

          {/* Right side - Body and Footer */}
          <div className="md:w-1/2 flex flex-col h-full">
            <ModalBody className="flex-1 p-4 bg-black overflow-y-auto">
              <VStack className="gap-2">
                <Heading className="sm text-[#D9D9D9]">Media</Heading>
                <VStack className="gap-2 items-center">
                  {serviceData?.images.length >= 1 &&
                    serviceData.images.map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt={`${serviceData.title} image ${index + 1}`}
                        width={4000}
                        height={4000}
                        className="object-cover"
                      />
                    ))}
                </VStack>
                <VStack className="gap-2 items-center">
                  {serviceData?.videos.length >= 1 &&
                    serviceData.videos.map((video, index) => (
                      <ReactPlayer
                        key={index}
                        src={video}
                        controls
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    ))}
                </VStack>
              </VStack>
            </ModalBody>
          </div>
        </div>
        <ModalCloseButton className="hidden md:flex">
          <Icon
            as={CloseIcon}
            size="lg"
            className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
          />
        </ModalCloseButton>
      </ModalContent>
    </Modal>
  );
};
export default ServiceInfoModal;
