import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { useSession } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const SideBar = () => {
  const { userData, companyData } = useSession();
  const router = useRouter();
  return (
    <VStack className="p-4 h-screen w-1/4">
      <Card variant="outline" className="bg-white items-center gap-2">
        <Image
          source={
            userData?.profilePicture
              ? { uri: userData.profilePicture }
              : {
                  uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
                }
          }
          alt="profile"
          size="lg"
          className="rounded-full"
        />
        <Heading>{userData?.firstName}</Heading>
        <Text>{companyData?.companyName}</Text>
        <Button
          variant="outline"
          className="w-full"
          onPress={() => {
            router.push("/cpc");
          }}
        >
          <ButtonText className="text-text-cpc1 data-[hover=true]:no-underline data-[hover=true]:text-text-primary">
            View Profile
          </ButtonText>
        </Button>
      </Card>
    </VStack>
  );
};

export default SideBar;
