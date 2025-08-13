import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import GrowthTrends from "./GrowthTrends";
import SummaryCards from "./SummaryCards";

export default function DashboardView() {
  return (
    <VStack className="w-full gap-4 overflow-hidden">
      <SummaryCards />
      <VStack>
        <Card className="bg-white w-full h-72"><GrowthTrends /></Card>
      </VStack>
      <VStack>
        <Card className="bg-white w-full h-96 overflow-hidden"></Card>
      </VStack>
    </VStack>
  );
}
