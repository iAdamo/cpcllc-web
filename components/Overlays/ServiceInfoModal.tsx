"use client";

import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import {
  Modal,
  ModalCloseButton,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@/components/ui/modal";
import {
  Icon,
  CloseIcon,
  EditIcon,
  CheckCircleIcon,
  CloseCircleIcon,
} from "@/components/ui/icon";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import Image from "next/image";
import ReactPlayer from "react-player";
import { getInitial } from "@/utils/GetInitials";
import { ServiceData } from "@/types";
import { updateService } from "@/axios/services";
import { useState } from "react";

const ServiceInfoModal = ({
  serviceData,
  isOpen,
  onClose,
  isEditable = false,
}: {
  serviceData: ServiceData;
  isOpen: boolean;
  onClose: () => void;
  isEditable?: boolean;
}) => {
  const [editableData, setEditableData] = useState<ServiceData>(serviceData);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: keyof ServiceData, value: string) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...editableData.tags];
    newTags[index] = value;
    setEditableData((prev) => ({
      ...prev,
      tags: newTags,
    }));
  };

  const handleUpdateService = async () => {
    try {
      const formData = new FormData();
      Object.entries(editableData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(key, item);
          });
        } else if (typeof value === "object" && value !== null) {
          Object.entries(value).forEach(([subKey, subValue]) => {
            formData.append(`${key}[${subKey}]`, subValue as any);
          });
        } else if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });
      await updateService(editableData._id, formData);
      setIsEditing(false);
      onClose(); // Close modal after successful update
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      className="fixed z-50"
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
          <ModalHeader className="md:w-1/2 gap-4 items-start p-4 flex-col">
            <HStack space="lg">
              <Avatar size="md" className="shrink-0">
                <AvatarFallbackText className="text-sm">
                  {getInitial(editableData?.company?.name || "Service")}
                </AvatarFallbackText>
                <AvatarImage
                  source={{ uri: editableData?.company?.logo || "" }}
                />
              </Avatar>
              {isEditing ? (
                <FormControl>
                  <Input>
                    <InputField
                      value={editableData.title}
                      onChangeText={(text) => handleInputChange("title", text)}
                      placeholder="Service Title"
                    />
                  </Input>
                </FormControl>
              ) : (
                <Heading size="sm" className="md:text-xl text-gray-800">
                  {editableData?.title}
                </Heading>
              )}
            </HStack>

            {editableData?.description && (
              <Card variant="filled" className="gap-2 w-full">
                <Heading size="xs" className="text-typography-700">
                  Description
                </Heading>
                {isEditing ? (
                  <FormControl>
                    <Input>
                      <InputField
                        value={editableData.description}
                        onChangeText={(text) =>
                          handleInputChange("description", text)
                        }
                        placeholder="Service Description"
                        multiline
                        numberOfLines={4}
                      />
                    </Input>
                  </FormControl>
                ) : (
                  <Text
                    size="xs"
                    className="md:text-sm text-gray-700 break-words"
                  >
                    {editableData.description}
                  </Text>
                )}
              </Card>
            )}
            <HStack className="w-full gap-2 justify-between ">
              <Card variant="filled" className="gap-2 h-fit w-1/2">
                <Heading size="xs" className="text-typography-700">
                  Category
                </Heading>
                {isEditing ? (
                  <FormControl>
                    <Input className="">
                      <InputField
                        value={editableData.category}
                        onChangeText={(text) =>
                          handleInputChange("category", text)
                        }
                        placeholder="Category"
                      />
                    </Input>
                  </FormControl>
                ) : (
                  <Text
                    size="xs"
                    className="p-2 md:text-sm text-gray-700 rounded"
                  >
                    {editableData?.category || "Uncategorized"}
                  </Text>
                )}
              </Card>
              <Card variant="filled" className="gap-2 w-1/2">
                <Heading size="xs" className="text-typography-700">
                  Services Provided
                </Heading>
                <HStack className="flex-wrap gap-2 w-full">
                  {editableData?.tags.map((tag, index) =>
                    isEditing ? (
                      <FormControl key={index} className="w-full">
                        <Input>
                          <InputField
                            value={tag}
                            onChangeText={(text) =>
                              handleTagChange(index, text)
                            }
                            placeholder={`Tag ${index + 1}`}
                          />
                        </Input>
                      </FormControl>
                    ) : (
                      <Text
                        key={index}
                        size="xs"
                        className="p-2 md:text-sm text-gray-700 bg-white rounded"
                      >
                        {tag}
                      </Text>
                    )
                  )}
                </HStack>
              </Card>
            </HStack>
            <HStack className="w-full gap-2 justify-between">
              <Card variant="filled" className="gap-2 w-1/2">
                <Heading size="xs" className="text-typography-700">
                  Service Charges
                </Heading>
                {isEditing ? (
                  <FormControl>
                    <Input>
                      <InputField
                        value={editableData.price.toString()}
                        onChangeText={(text) =>
                          handleInputChange("price", text)
                        }
                        placeholder="Price"
                        keyboardType="numeric"
                      />
                    </Input>
                  </FormControl>
                ) : (
                  <Text
                    size="xs"
                    className="p-2 md:text-sm text-gray-700 bg-white rounded"
                  >
                    {`Service charges from $${editableData?.price}`}
                  </Text>
                )}
              </Card>
              <Card variant="filled" className="gap-2 w-1/2">
                <Heading size="xs" className="text-typography-700">
                  Estimated Time
                </Heading>
                {isEditing ? (
                  <FormControl>
                    <Input>
                      <InputField
                        value={editableData.duration?.toString() || ""}
                        onChangeText={(text) =>
                          handleInputChange("duration", text)
                        }
                        placeholder="Duration (mins)"
                        keyboardType="numeric"
                      />
                    </Input>
                  </FormControl>
                ) : (
                  <Text
                    size="xs"
                    className="p-2 md:text-sm text-gray-700 bg-white rounded"
                  >
                    {`${editableData?.duration} mins`}
                  </Text>
                )}
              </Card>
            </HStack>
            <Card variant="filled" className="w-full gap-2">
              <Heading size="xs" className="text-typography-700">
                Contact Information
              </Heading>
              {isEditing ? (
                <FormControl>
                  <Input>
                    <InputField
                      value={editableData.company?.contact || ""}
                      onChangeText={(text) =>
                        handleInputChange("contact", text)
                      }
                      placeholder="Contact Information"
                    />
                  </Input>
                </FormControl>
              ) : (
                <Text size="xs" className="md:text-sm text-gray-700">
                  {editableData?.company?.contact || "Not Provided"}
                </Text>
              )}
            </Card>
          </ModalHeader>

          {/* Right side - Body and Footer */}
          <div className="md:w-1/2 flex flex-col h-full">
            <ModalBody className="flex-1 my-0 p-4 bg-black overflow-y-auto">
              <VStack className="gap-2">
                <Heading className="sm text-[#D9D9D9]">Media</Heading>
                <VStack className="gap-2 items-center">
                  {editableData?.images.length >= 1 &&
                    editableData.images.map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt={`${editableData.title} image ${index + 1}`}
                        width={4000}
                        height={4000}
                        className="object-cover"
                      />
                    ))}
                </VStack>
                <VStack className="gap-2 items-center">
                  {editableData?.videos.length >= 1 &&
                    editableData.videos.map((video, index) => (
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

            {/* Edit/Save buttons */}
            {isEditable && (
              <HStack className="md:hidden p-2 justify-end space-x-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onPress={() => {
                        setIsEditing(false);
                        setEditableData(serviceData);
                      }}
                    >
                      <ButtonText>Cancel</ButtonText>
                    </Button>
                    <Button onPress={handleUpdateService}>
                      <ButtonText>Save Changes</ButtonText>
                    </Button>
                  </>
                ) : (
                  <Button onPress={() => setIsEditing(true)}>
                    <ButtonIcon as={EditIcon} />
                    <ButtonText size="xs" className="">
                      Edit
                    </ButtonText>
                  </Button>
                )}
              </HStack>
            )}
          </div>
        </div>
        <VStack className="hidden md:flex h-full justify-between p-1">
          <ModalCloseButton className="hidden md:flex justify-center items-center p-0">
            <Icon as={CloseIcon} size="lg" className="" />
          </ModalCloseButton>
          {isEditable && (
            <VStack className="">
              {isEditing ? (
                <>
                  <Button
                    size="xl"
                    variant="link"
                    onPress={() => {
                      setIsEditing(false);
                      setEditableData(serviceData);
                    }}
                  >
                    <ButtonIcon as={CloseCircleIcon} className="text-red-500" />
                  </Button>

                  <Button
                    size="xl"
                    variant="link"
                    onPress={handleUpdateService}
                  >
                    <ButtonIcon
                      as={CheckCircleIcon}
                      className="text-green-500"
                    />
                  </Button>
                </>
              ) : (
                <Button
                  variant="link"
                  size="xl"
                  onPress={() => setIsEditing(true)}
                >
                  <ButtonIcon as={EditIcon} className="text-blue-500" />
                </Button>
              )}
            </VStack>
          )}
        </VStack>
      </ModalContent>
    </Modal>
  );
};
export default ServiceInfoModal;
