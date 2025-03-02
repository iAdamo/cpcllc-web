import { useRouter } from "next/navigation";
import { useSession } from "@/context/AuthContext";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Icon, AddIcon } from "@/components/ui/icon";

const RightView = () => {
  const { userData } = useSession();
  return (
    <VStack className="p-4 h-screen w-1/4">
      <VStack className="items-center gap-2">
        <Button
          variant="outline"
          className="w-48 h-32 border-gray-300 rounded-lg"
        >
          <ButtonIcon as={AddIcon} className="w-20 h-20 text-gray-300" />
        </Button>
        <Card variant="outline" className="w-full">
          <HStack className="justify-between">
            <VStack>
              <Heading size="sm">Total Employees</Heading>
              <Text size="sm">20</Text>
            </VStack>
            <Button variant="outline" className="w-20">
              <ButtonText>View</ButtonText>
            </Button>
          </HStack>
        </Card>
      </VStack>
    </VStack>
  );
};

export default RightView;
