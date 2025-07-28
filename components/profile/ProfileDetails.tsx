import { useState } from "react";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Link, LinkText } from "../ui/link";
import { Button, ButtonIcon } from "../ui/button";
// import { Pressable } from "../ui/pressable";
import { FormControl } from "../ui/form-control";
import { Input, InputField } from "../ui/input";
import { useToast, Toast, ToastTitle } from "../ui/toast";
import LocationDetails from "./LocationDetails";

import {
  Icon,
  PhoneIcon,
  MailIcon,
  EditIcon,
  CheckIcon,
  CloseIcon,
} from "@/components/ui/icon";
import { UserData, CompanyData } from "@/types";
import { updateCompanyProfile } from "@/axios/users";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import SocialMediaDetails from "./SocialMediaDetails";
// import { AddIcon } from "@/components/ui/icon";

type EditableFields = keyof UserData | keyof CompanyData;

const ContactInfo = ({
  activeRoleId,
  isEditable,
  isSaving,
  editingFields,
  handleSave,
  handleEditStart,
  handleCancelEdit,
}: {
  activeRoleId: UserData["activeRoleId"];
  isEditable: boolean;
  isSaving: boolean;
  editingFields: Partial<Record<EditableFields, string>>;
  handleSave: () => void;
  handleEditStart: (fields: Partial<Record<EditableFields, string>>) => void;
  handleCancelEdit: () => void;
}) => {
  const isEditingPhone = editingFields.hasOwnProperty("companyPhoneNumber");
  const isEditingEmail = editingFields.hasOwnProperty("companyEmail");

  // Email validation only
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Get current values with fallbacks
  const currentPhone =
    editingFields.companyPhoneNumber || activeRoleId?.companyPhoneNumber || "";
  const currentEmail =
    editingFields.companyEmail || activeRoleId?.companyEmail || "";

  // Only validate email
  const canSave = !isEditingEmail || isValidEmail(currentEmail);

  return (
    <Card variant="filled" className="h-fit flex-row gap-4 p-2 items-start">
      {isEditingPhone || isEditingEmail ? (
        <VStack className="gap-2 w-full">
          {isEditingPhone && (
            <FormControl className="flex-row items-center gap-2 w-full">
              <Icon as={PhoneIcon} className="text-green-500" />
              <PhoneInput
                country={"us"}
                value={currentPhone}
                onChange={(phone) =>
                  handleEditStart({ companyPhoneNumber: phone })
                }
                inputProps={{
                  name: "companyPhoneNumber",
                  autoFocus: true,
                }}
                inputStyle={{
                  width: "100%",
                  height: "1.5rem",
                }}
              />
            </FormControl>
          )}
          {isEditingEmail && (
            <FormControl className="flex-row items-center gap-2 w-full">
              <Icon as={MailIcon} className="text-blue-500" />
              <VStack className="flex-1">
                <Input className="h-6">
                  <InputField
                    value={currentEmail}
                    onChangeText={(text) =>
                      handleEditStart({ companyEmail: text })
                    }
                    autoFocus={!isEditingPhone}
                    className={
                      !isValidEmail(currentEmail) ? "border-red-500" : ""
                    }
                    placeholder="example@company.com"
                  />
                </Input>
                {!isValidEmail(currentEmail) && currentEmail && (
                  <Text size="xs" className="text-red-500">
                    Please enter a valid email address
                  </Text>
                )}
              </VStack>
            </FormControl>
          )}
          <HStack className="gap-2 self-end">
            <Button
              variant="link"
              size="md"
              onPress={handleSave}
              disabled={isSaving || !canSave}
              className="p-0 h-4"
            >
              <ButtonIcon as={CheckIcon} />
            </Button>
            <Button
              variant="link"
              size="md"
              onPress={handleCancelEdit}
              className="p-0 h-4"
            >
              <ButtonIcon as={CloseIcon} />
            </Button>
          </HStack>
        </VStack>
      ) : (
        <>
          <VStack className="gap-2 flex-1">
            {activeRoleId?.companyPhoneNumber ? (
              <Link
                href={`tel:${activeRoleId.companyPhoneNumber}`}
                className="flex-row gap-2 w-fit"
              >
                <Icon as={PhoneIcon} className="text-green-500" />
                <LinkText size="xs" className="font-semibold">
                  {activeRoleId.companyPhoneNumber}
                </LinkText>
              </Link>
            ) : (
              <HStack className="flex-row gap-2 w-fit">
                <Icon as={PhoneIcon} className="text-green-500" />
                <Text size="xs" className="text-gray-500 italic">
                  No phone number
                </Text>
              </HStack>
            )}
            {activeRoleId?.companyEmail ? (
              <Link
                href={`mailto:${activeRoleId.companyEmail}`}
                className="flex-row gap-2"
              >
                <Icon as={MailIcon} className="text-blue-500" />
                <LinkText size="xs" className="font-semibold">
                  {activeRoleId.companyEmail}
                </LinkText>
              </Link>
            ) : (
              <HStack className="flex-row gap-2">
                <Icon as={MailIcon} className="text-blue-500" />
                <Text size="xs" className="text-gray-500 italic">
                  No email address
                </Text>
              </HStack>
            )}
          </VStack>
          {isEditable && (
            <Button
              variant="link"
              size="xs"
              onPress={() =>
                handleEditStart({
                  companyPhoneNumber: activeRoleId?.companyPhoneNumber || "",
                  companyEmail: activeRoleId?.companyEmail || "",
                })
              }
              className="items-start"
            >
              <ButtonIcon as={EditIcon} />
            </Button>
          )}
        </>
      )}
    </Card>
  );
};

const ProfileDetails = ({
  activeRoleId,
  isEditable,
  fetchUserProfile,
}: {
  activeRoleId: UserData["activeRoleId"];
  isEditable: boolean;
  fetchUserProfile: () => Promise<void>;
}) => {
  const [editingFields, setEditingFields] = useState<
    Partial<Record<EditableFields, string>>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const handleEditStart = (fields: Partial<Record<EditableFields, string>>) => {
    setEditingFields(fields);
  };

  const handleCancelEdit = () => {
    setEditingFields({});
  };

  const handleSave = async () => {
    if (Object.keys(editingFields).length === 0) return;

    setIsSaving(true);
    try {
      const formData = new FormData();
      Object.entries(editingFields).forEach(([key, value]) => {
        if (key.startsWith("companySocialMedia.")) {
          const platform = key.split(".")[1];
          formData.append(`companySocialMedia[${platform}]`, value || "");
        } else {
          formData.append(key, value || "");
        }
      });
      console.log(formData);
      await updateCompanyProfile(formData);
      await fetchUserProfile();

      setEditingFields({});
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} action="success">
            <ToastTitle>Profile updated successfully!</ToastTitle>
          </Toast>
        ),
      });
    } catch (error) {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} variant="outline" action="error">
            <ToastTitle>
              {(error as any).response?.data?.message ||
                "Failed to update profile. Please try again."}
            </ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <VStack className="gap-4">
      {(activeRoleId?.subcategories ?? []).length > 0 && (
        <VStack>
          <Heading size="xs" className="md:text-md mb-2">
            Services provided
          </Heading>
          <VStack className="w-fit grid grid-cols-4 md:grid-cols-5 gap-2">
            {activeRoleId?.subcategories?.map((subcategory) => (
              <Card variant="filled" key={subcategory._id} className="p-2">
                <Text size="xs" className="text-gray-600 font-semibold">
                  {subcategory.name}
                </Text>
              </Card>
            ))}
          </VStack>
        </VStack>
      )}
      {/* Company Description */}
      <FormControl>
        <VStack>
          <Heading size="xs" className="md:text-md mb-2">
            Description
          </Heading>
          {"companyDescription" in editingFields ? (
            <VStack className="gap-2">
              <Input className="h-32">
                <InputField
                  multiline
                  numberOfLines={4}
                  value={editingFields.companyDescription || ""}
                  onChangeText={(text) =>
                    handleEditStart({ companyDescription: text })
                  }
                  autoFocus
                  className="h-32"
                />
              </Input>
              <HStack className="gap-2 self-end">
                <Button
                  size="sm"
                  variant="link"
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  <Icon as={CheckIcon} />
                </Button>
                <Button size="sm" variant="link" onPress={handleCancelEdit}>
                  <Icon as={CloseIcon} />
                </Button>
              </HStack>
            </VStack>
          ) : (
            <Card variant="filled" className="flex-row p-4">
              <Text size="sm" className="md:text-md break-words">
                {activeRoleId?.companyDescription}
              </Text>
              {isEditable && (
                <Button
                  variant="link"
                  size="xs"
                  onPress={() =>
                    handleEditStart({
                      companyDescription:
                        activeRoleId?.companyDescription || "",
                    })
                  }
                >
                  <ButtonIcon as={EditIcon} />
                </Button>
              )}
            </Card>
          )}
        </VStack>
      </FormControl>

      <VStack className="md:flex-row gap-4 w-full">
        <ContactInfo
          activeRoleId={activeRoleId}
          isEditable={isEditable}
          isSaving={isSaving}
          editingFields={editingFields}
          handleSave={handleSave}
          handleEditStart={handleEditStart}
          handleCancelEdit={handleCancelEdit}
        />
        <SocialMediaDetails
          activeRoleId={activeRoleId}
          isEditable={isEditable}
          isSaving={isSaving}
          editingFields={editingFields}
          handleSave={handleSave}
          handleEditStart={handleEditStart}
          handleCancelEdit={handleCancelEdit}
        />
      </VStack>
      <LocationDetails
        activeRoleId={activeRoleId}
        isEditable={isEditable}
        isSaving={isSaving}
        handleSave={handleSave}
        handleCancelEdit={handleCancelEdit}
      />
    </VStack>
  );
};

export default ProfileDetails;
