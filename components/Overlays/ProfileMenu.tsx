import { useEffect } from "react";
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  MenuSeparator,
} from "@/components/ui/menu";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Pressable } from "@/components/ui/pressable";
import { useAuthStore } from "@/stores";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import Link from "next/link";

interface ProfileMenuProps {
  options: any[];
  offset?: number;
}

const ProfileMenu = ({ options, offset }: ProfileMenuProps) => {
  const { userData, fetchUserProfile, logout } = useAuthStore();

  // get user profile data and update userData
  useEffect(() => {
    if (userData?.id) {
      fetchUserProfile(userData.id);
    }
  }, [userData?.id, fetchUserProfile]);

  const getInitial = (name: string) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase();
  };

  return userData ? (
    <Menu
      offset={offset}
      trigger={({ ...triggerProps }) => {
        return (
          <Pressable {...triggerProps}>
            <Avatar>
              <AvatarFallbackText>
                {userData?.email.charAt(0)}
              </AvatarFallbackText>
              <AvatarImage source={{ uri: userData?.profilePicture }} />
              <AvatarBadge />
            </Avatar>
          </Pressable>
        );
      }}
    >
      <MenuItem className="">
        <VStack className="items-center gap-2">
          <Avatar>
            <AvatarFallbackText>
              {getInitial(userData?.email || userData?.firstName || "")}
            </AvatarFallbackText>
            <AvatarImage source={{ uri: userData?.profilePicture }} />
            <AvatarBadge />
          </Avatar>
          <Button variant="outline">
            <ButtonText>
              {userData?.activeRole === "Client"
                ? "Switch to Company"
                : "Switch to Client"}
            </ButtonText>
          </Button>
        </VStack>
      </MenuItem>
      <MenuSeparator />
      {options.map((option) => (
        <MenuItem
          key={option.name}
          textValue={option.name}
          onPress={option.onPress}
        >
          <MenuItemLabel size="md">{option.name}</MenuItemLabel>
        </MenuItem>
      ))}
      <MenuSeparator />
      <MenuItem
        key="Logout"
        textValue="Logout"
        className=""
        onPress={() => logout()}
      >
        <MenuItemLabel size="md">Logout</MenuItemLabel>
      </MenuItem>
    </Menu>
  ) : (
    <Link
      href="/onboarding"
      className="px-4 py-2 font-bold bg-btn-primary border border-btn-outline rounded-3xl hover:bg-btn-secondary text-text-primary"
    >
      Get Started
    </Link>
  );
};

export default ProfileMenu;
