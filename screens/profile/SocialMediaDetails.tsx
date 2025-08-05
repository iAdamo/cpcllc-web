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
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from "@/public/assets/icons/customIcons";
import {
  Icon,
  ExternalLinkIcon,
  GlobeIcon,
  EditIcon,
  CheckIcon,
  CloseIcon,
} from "@/components/ui/icon";
import { UserData, CompanyData } from "@/types";

type EditableFields = keyof UserData | keyof CompanyData;

interface ProfileEditProps {
  activeRoleId: UserData["activeRoleId"];
  isEditable: boolean;
  isSaving: boolean;
  editingFields: Partial<Record<EditableFields, string>>;
  handleSave: () => void;
  handleEditStart: (fields: Partial<Record<EditableFields, string>>) => void;
  handleCancelEdit: () => void;
}

const SocialMediaDetails = ({
  activeRoleId,
  isEditable,
  isSaving,
  editingFields,
  handleSave,
  handleEditStart,
  handleCancelEdit,
}: ProfileEditProps) => {
  const isEditingPlatform = (platform: string) =>
    editingFields.hasOwnProperty(`companySocialMedia.${platform}`);

  const platformPatterns: Record<string, RegExp> = {
    website: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/i,
    facebook: /^(https?:\/\/)?(www\.)?facebook\.com\/.+/i,
    instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/.+/i,
    linkedin: /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/.+/i,
    twitter: /^(https?:\/\/)?(www\.)?(twitter|x)\.com\/.+/i,
    other: /^(https?:\/\/).+/i,
  };

  const platformPlaceholders: Record<string, string> = {
    website: "https://yourcompany.com",
    facebook: "https://facebook.com/yourpage",
    instagram: "https://instagram.com/yourprofile",
    linkedin: "https://linkedin.com/in/yourcompany",
    twitter: "https://x.com/yourhandle",
    other: "https://example.com",
  };

  const sanitizeAndValidateLink = (
    platform: string,
    link: string
  ): { link: string; isValid: boolean } => {
    let sanitized = link.trim();

    // Add https:// if missing
    if (!sanitized.startsWith("http://") && !sanitized.startsWith("https://")) {
      sanitized = `https://${sanitized}`;
    }

    // Validate against platform pattern
    const isValid = platformPatterns[platform].test(sanitized);

    return { link: sanitized, isValid };
  };

  return (
    <Card variant="filled" className="h-fit gap-4 p-2 flex-row -z-50 md:w-auto w-fit">
      <VStack className="grid grid-cols-2 gap-x-4">
        {[
          "website",
          "facebook",
          "instagram",
          "linkedin",
          "twitter",
          "other",
        ].map((platform) => {
          const link = activeRoleId?.companySocialMedia?.[platform];
          const editingKey = `companySocialMedia.${platform}`;
          const isEditing = isEditingPlatform(platform);
          const currentValue = isEditing
            ? editingFields[editingKey] || ""
            : link || "";
          const { isValid } = sanitizeAndValidateLink(platform, currentValue);

          return (
            <div key={platform} className="flex flex-row items-start gap-2">
              <Icon
                as={
                  {
                    website: GlobeIcon,
                    facebook: FacebookIcon,
                    instagram: InstagramIcon,
                    linkedin: LinkedInIcon,
                    twitter: TwitterIcon,
                    other: ExternalLinkIcon,
                  }[platform]
                }
              />
              {isEditing ? (
                <FormControl className="items-end gap-2 w-full">
                  <Input className="w-full h-6">
                    <InputField
                      value={currentValue}
                      onChangeText={(text) => {
                        const { link: sanitized } = sanitizeAndValidateLink(
                          platform,
                          text
                        );
                        handleEditStart({ [editingKey]: sanitized });
                      }}
                      placeholder={platformPlaceholders[platform]}
                      autoFocus
                      className={`text-sm ${
                        !isValid && currentValue ? "border-red-500" : ""
                      }`}
                    />
                  </Input>
                  {!isValid && currentValue && (
                    <Text size="xs" className="text-red-500 self-start">
                      Please enter a valid {platform} URL
                    </Text>
                  )}
                  <HStack className="gap-2 mb-2">
                    <Button
                      size="sm"
                      variant="link"
                      onPress={handleSave}
                      disabled={isSaving || !isValid}
                      className="p-0 h-4"
                    >
                      <ButtonIcon as={CheckIcon} />
                    </Button>
                    <Button
                      size="sm"
                      variant="link"
                      onPress={handleCancelEdit}
                      className="p-0 h-4"
                    >
                      <ButtonIcon as={CloseIcon} />
                    </Button>
                  </HStack>
                </FormControl>
              ) : (
                <HStack className="w-full justify-between mb-2">
                  {link ? (
                    <Link href={link}>
                      <LinkText
                        size="xs"
                        className="font-semibold"
                      >
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </LinkText>
                    </Link>
                  ) : (
                    <Text
                      size="xs"
                      className="text-gray-500 font-semibold italic"
                    >
                      No link added
                    </Text>
                  )}
                  {isEditable && (
                    <Button
                      size="xs"
                      variant="link"
                      onPress={() =>
                        handleEditStart({ [editingKey]: link || "" })
                      }
                      className="p-0 h-4"
                    >
                      <ButtonIcon as={EditIcon} />
                    </Button>
                  )}
                </HStack>
              )}
            </div>
          );
        })}
      </VStack>
    </Card>
  );
};

export default SocialMediaDetails;
