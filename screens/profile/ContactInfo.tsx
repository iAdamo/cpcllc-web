import { VStack } from "../../components/ui/vstack";
import { HStack } from "../../components/ui/hstack";
import { Card } from "../../components/ui/card";
import { Text } from "../../components/ui/text";
import { Link, LinkText } from "../../components/ui/link";
import { Button, ButtonIcon } from "../../components/ui/button";
// import { Pressable } from "../ui/pressable";
import { FormControl } from "../../components/ui/form-control";
import { Input, InputField } from "../../components/ui/input";

import {
  Icon,
  PhoneIcon,
  MailIcon,
  EditIcon,
  CheckIcon,
  CloseIcon,
} from "@/components/ui/icon";
import { UserData, CompanyData } from "@/types";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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
    <Card variant="filled" className="h-fit flex-row gap-4 p-2 items-start md:w-auto w-fit">
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
          <VStack className="gap-4 flex-1">
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

export default ContactInfo;
