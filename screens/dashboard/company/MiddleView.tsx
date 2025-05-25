import { useRouter } from "next/navigation";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
// import { Image } from "@/components/ui/image";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { AddIcon } from "@/components/ui/icon";
import { Divider } from "@/components/ui/divider";
// import ServiceCard from "@/components/ServiceCard";
import { useSession } from "@/context/AuthContext";

const MiddleView = () => {
  const router = useRouter();
  const { userData } = useSession();
  console.log(userData);

  return (
    <VStack className="p-4 gap-4 w-3/4">
      <Card
        variant="outline"
        className="flex flex-row bg-white justify-between w-3/4"
      >
        <Heading size="sm">Total Services 20</Heading>
        <Button
          variant="outline"
          className="rounded-lg border-blue-600"
          onPress={() => router.push("/dashboard/company/create-service")}
        >
          <ButtonIcon as={AddIcon} className="text-blue-600 font-bold" />
          <ButtonText className="text-blue-600 font-bold">
            Add New Service
          </ButtonText>
        </Button>
      </Card>
      <HStack className="w-full gap-4">
        <VStack className="grid grid-cols-2 gap-4 w-3/5">
          {/** {userData?.activeRoleId?.services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))} **/}
        </VStack>
        <VStack className="w-2/5">
          <VStack className="bg-white">
            <Card className="gap-4 p-8">
              <Heading size="sm">Simple Steps to Success</Heading>
              <Text size="sm">
                The secret to success on is starting off on the right foot and
                actively maintaining your ratings. Here are some tips to help
                you become a top company.
              </Text>
            </Card>
            <Divider />
            <Card className="">
              <Card className="gap-4">
                <Heading size="xs">
                  Create your services—the more, the better
                </Heading>
                <Button size="xs" variant="outline" className="ml-auto">
                  <ButtonText>Learn More</ButtonText>
                </Button>
              </Card>
              <Divider />
              <Card className="gap-4">
                <Heading size="xs">
                  Share your services to get your first orders and reviews!
                </Heading>
                <Button size="xs" variant="outline" className="ml-auto">
                  <ButtonText>Learn More</ButtonText>
                </Button>
              </Card>
            </Card>
          </VStack>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default MiddleView;
