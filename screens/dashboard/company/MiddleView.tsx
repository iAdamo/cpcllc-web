import { useRef } from "react";
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
import { ScrollView } from "@/components/ui/scroll-view";

const MiddleView = () => {
  const { userData } = useSession();
  const scrollRef = useRef<ScrollView>(null);

  const services = [
    {
      name: "Service 1",
      category: "Plumbing",
      thumbnail:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
    },
    {
      name: "Service 1",
      category: "Plumbing",
      thumbnail:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
    },
    {
      name: "Service 1",
      category: "Plumbing",
      thumbnail:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
    },
    {
      name: "Service 1",
      category: "Plumbing",
      thumbnail:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
    },
    {
      name: "Service 1",
      category: "Plumbing",
      thumbnail:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
    },
    {
      name: "Service 1",
      category: "Plumbing",
      thumbnail:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
    },
  ];
  return (
    <VStack className="p-4 h-screen w-1/2">
      <VStack className="items-center gap-20">
        <Card variant="outline" className="w-full ">
          <HStack className="justify-between p-4">
            <Heading size="sm">Total Services 20</Heading>
            <Button variant="outline" className="border-gray-300 rounded-lg">
              <ButtonIcon as={AddIcon} />
              <ButtonText>Add New Service</ButtonText>
            </Button>
          </HStack>
          <VStack className="grid grid-cols-2 gap-4 p-4 overflow-auto [&::-webkit-scrollbar]:hidden h-96 ">
            {services.map((service, index) => (
              <Card key={index} variant="outline" className="">
                <Image
                  source={{ uri: service.thumbnail }}
                  alt="Service"
                  className="w-full h-40"
                />
                <VStack>
                  <Heading size="sm">{service.name}</Heading>
                  <Text size="sm">{service.category}</Text>
                </VStack>
              </Card>
            ))}
          </VStack>
        </Card>
      </VStack>
    </VStack>
  );
};

export default MiddleView;
