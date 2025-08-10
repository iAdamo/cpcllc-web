import { useState } from "react";
import { VStack } from "../../components/ui/vstack";
import { HStack } from "../../components/ui/hstack";
import { Card } from "../../components/ui/card";
import { Heading } from "../../components/ui/heading";
import { Text } from "../../components/ui/text";
import { Button, ButtonIcon } from "../../components/ui/button";
// import { Pressable } from "../ui/pressable";
import { FormControl } from "../../components/ui/form-control";
import { Input, InputField } from "../../components/ui/input";
import { useToast, Toast, ToastTitle } from "../../components/ui/toast";
import LocationDetails from "./LocationDetails";
import ContactInfo from "./ContactInfo";

import {
  Icon,
  EditIcon,
  CheckIcon,
  CloseIcon,
} from "@/components/ui/icon";
import { UserData, CompanyData } from "@/types";
import { updateCompanyProfile } from "@/axios/users";
import "react-phone-input-2/lib/style.css";
import SocialMediaDetails from "./SocialMediaDetails";
// import { AddIcon } from "@/components/ui/icon";

type EditableFields = keyof UserData | keyof CompanyData;

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
    <VStack className="gap-8">
      {(activeRoleId?.subcategories ?? []).length > 0 && (
        <VStack>
          <Heading size="xs" className="md:text-md mb-2">
            Categories Provided
          </Heading>
          <VStack className="w-fit grid grid-cols-3 gap-2">
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
              <Text size="xs" className="md:text-sm">
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

      <VStack className="md:flex-row md:justify-between gap-4 w-full">
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
        fetchUserProfile={fetchUserProfile}
      />
    </VStack>
  );
};

export default ProfileDetails;
