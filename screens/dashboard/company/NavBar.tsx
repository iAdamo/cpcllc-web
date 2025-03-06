import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/AuthContext";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import LogoWhite from "@/public/assets/logo-white.jpeg";
import ProfileMenu from "@/components/Overlays/ProfileMenu";

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
          <ProfileMenu
            userData={userData}
            options={[
              { name: "Membership", onPress: () => router.replace("/profile") },
              { name: "Settings", onPress: () => router.replace("/settings") },
            ]}
            offset={15}
          />
        </HStack>
      </HStack>
    </VStack>
  );
};

export default NavBar;
