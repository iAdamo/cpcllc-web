// components/admin/InsightCard.tsx
"use client";

import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import {
  TrendingUp,
  TrendingDown,
  Info,
  Users,
  Building2,
  Activity,
} from "lucide-react";

interface InsightCardProps {
  type: "positive" | "negative" | "neutral";
  message: string;
  metric: string;
  value: number;
}

const insightIcons = {
  positive: TrendingUp,
  negative: TrendingDown,
  neutral: Info,
};

const metricIcons = {
  newUsers: Users,
  growthRate: TrendingUp,
  providerRatio: Building2,
  default: Activity,
};

export function InsightCard({
  type,
  message,
  metric,
  value,
}: InsightCardProps) {
  const IconComponent = insightIcons[type];
  const MetricIcon = metricIcons[metric] || metricIcons.default;

  const colors = {
    positive: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      icon: "text-green-500",
    },
    negative: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: "text-red-500",
    },
    neutral: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      icon: "text-blue-500",
    },
  };

  const colorSet = colors[type];

  return (
    <Card className={`${colorSet.bg} ${colorSet.border} border p-4`}>
      <HStack className="space-x-3">
        <div className={`p-2 rounded-full ${colorSet.bg} ${colorSet.icon}`}>
          <IconComponent size={20} />
        </div>
        <VStack className="flex-1">
          <HStack className="items-center space-x-2">
            <MetricIcon size={16} className={colorSet.icon} />
            <Text className={`font-medium ${colorSet.text}`}>{message}</Text>
          </HStack>
          <Text size="sm" className={`${colorSet.text} opacity-75 mt-1`}>
            {metric === "newUsers" && `${value} new users joined`}
            {metric === "growthRate" &&
              `${value > 0 ? "+" : ""}${value.toFixed(1)}% growth rate`}
            {metric === "providerRatio" &&
              `${value.toFixed(1)}% provider ratio`}
          </Text>
        </VStack>
      </HStack>
    </Card>
  );
}
