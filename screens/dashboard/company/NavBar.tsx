import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/AuthContext";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import LogoWhite from "@/public/assets/logo-white.jpeg";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

const NavBar = () => {
  const router = useRouter();
  const { userData } = useSession();
  return (
    <VStack className="p-4 border-b">
      <HStack className="justify-between">
        <HStack className="gap-2">
          <Button onPress={() => router.replace("/")} className="p-0">
            <Image src={LogoWhite} alt="Logo" width={130} height={0} />
          </Button>

          {/** Language */}
          <Button variant="link" className="">
            <ButtonText className="text-text-cpc1 data-[hover=true]:no-underline data-[hover=true]:text-text-primary">
              English
            </ButtonText>
          </Button>
        </HStack>
        <HStack>
          <Avatar>
            <AvatarFallbackText>{userData?.email.charAt(0)}</AvatarFallbackText>
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
          <VStack>
            <Heading size="sm">
              {userData?.firstName}
              {userData?.lastName}
            </Heading>
            <Text size="sm">Nursing Assistant</Text>
          </VStack>
        </HStack>
      </HStack>
    </VStack>
  );
};

export default NavBar;
