import { useRouter } from "next/navigation";
import { useSession } from "@/context/AuthContext";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";

const SideBar = () => {
  const { userData } = useSession();
  return (
    <VStack className="p-4 h-screen w-1/4">
      <Card variant="outline" className="items-center gap-2">
        <Image
          source={
            userData?.photo
              ? { uri: userData.photo }
              : {
                  uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
                }
          }
          alt="profile"
          size="lg"
          className="rounded-full"
        />
        <Heading>{userData?.email}</Heading>
        <Text>Nursing Assistant</Text>
        <Button variant="outline" className="w-full">
          <ButtonText className="text-text-cpc1 data-[hover=true]:no-underline data-[hover=true]:text-text-primary">
            View Profile
          </ButtonText>
        </Button>
      </Card>
    </VStack>
  );
};

export default SideBar;
