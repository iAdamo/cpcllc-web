import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import {
  Icon,
  TotalClientsIcon,
  TotalProvidersIcon,
  TotalUsersIcon,
  ActiveIcon,
} from "@/components/ui/icon";
import Image from "next/image";

export default function DashboardView() {
  return (
    <VStack className="w-full gap-4 overflow-hidden">
      <HStack className="grid grid-cols-4 gap-4">
        <Card className="w-full h-32 justify-between bg-white">
          <HStack className="justify-between">
            <VStack space="sm">
              <Text size="sm">Total Users</Text>
              <Heading size="xl" className="text-[505050]">
                1000
              </Heading>
            </VStack>
            <VStack className="p-3 w-fit h-fit rounded-2xl bg-[#00247820]">
              <Icon as={TotalUsersIcon} />
            </VStack>
          </HStack>
          <VStack>
            <Text size="sm">85% up to yesterday</Text>
          </VStack>
        </Card>
        <Card className="w-full h-32 justify-between bg-white">
          <HStack className="justify-between">
            <VStack space="sm">
              <Text size="sm">Total Clients</Text>
              <Heading size="xl" className="text-[505050]">
                1000
              </Heading>
            </VStack>
            <VStack className="p-3 w-fit h-fit rounded-2xl bg-[#FFAB91]">
              <Icon as={TotalClientsIcon} />
            </VStack>
          </HStack>
          <VStack>
            <Text size="sm">85% up to yesterday</Text>
          </VStack>
        </Card>
        <Card className="w-full h-32 justify-between bg-white">
          <HStack className="justify-between">
            <VStack space="sm">
              <Text size="sm">Total Companies</Text>
              <Heading size="xl" className="text-[505050]">
                1000
              </Heading>
            </VStack>
            <VStack className="p-3 w-fit h-fit rounded-2xl bg-[#AEF2EB]">
              <Icon as={TotalProvidersIcon} />
            </VStack>
          </HStack>
          <VStack>
            <Text size="sm">85% up to yesterday</Text>
          </VStack>
        </Card>
        <Card className="w-full h-32 justify-between bg-white">
          <HStack className="justify-between">
            <VStack space="sm">
              <Text size="sm">Active Companies</Text>
              <Heading size="xl" className="text-[505050]">
                1000
              </Heading>
            </VStack>
            <VStack className="p-3 w-fit h-fit rounded-2xl bg-[#F0EDED]">
              <Icon as={ActiveIcon} />
            </VStack>
          </HStack>
          <VStack>
            <Text size="sm">85% up to yesterday</Text>
          </VStack>
        </Card>
      </HStack>
      <VStack>
        <Card className="bg-white w-full h-72"></Card>
      </VStack>
      <VStack>
        <Card className="bg-white w-full h-96 overflow-hidden"></Card>
      </VStack>
    </VStack>
  );
}
