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
import { useSession } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface ProfileMenuProps {
  userData: any;
  options: any[];
  offset?: number;
}

const ProfileMenu = ({ userData, options, offset }: ProfileMenuProps) => {
  const { logout } = useSession();
  const router = useRouter();

  return (
    userData && (
      <Menu
        offset={offset}
        trigger={({ ...triggerProps }) => {
          return (
            <Pressable {...triggerProps}>
              <Avatar>
                <AvatarFallbackText>
                  {userData?.email.charAt(0)}
                </AvatarFallbackText>
                <AvatarImage
                  source={
                    userData?.photo
                      ? { uri: userData.photo }
                      : {
                          uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
                        }
                  }
                />
                <AvatarBadge />
              </Avatar>
            </Pressable>
          );
        }}
      >
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
          onPress={() => {
            logout();
            router.replace("/");
          }}
        >
          <MenuItemLabel size="md">Logout</MenuItemLabel>
        </MenuItem>
      </Menu>
    )
  );
};

export default ProfileMenu;
