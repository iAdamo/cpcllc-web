// components/admin/MetricCard.tsx
"use client";

import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Pressable } from "@/components/ui/pressable";
import {
  Users,
  UserPlus,
  Building2,
  Activity,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  percentageChange: number;
  icon: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
  dataKey: string;
}

const iconMap = {
  users: Users,
  userPlus: UserPlus,
  building: Building2,
  activity: Activity,
};

const colorMap = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-600",
    icon: "text-blue-500",
    active: "ring-2 ring-blue-500",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-600",
    icon: "text-green-500",
    active: "ring-2 ring-green-500",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-600",
    icon: "text-purple-500",
    active: "ring-2 ring-purple-500",
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-600",
    icon: "text-orange-500",
    active: "ring-2 ring-orange-500",
  },
};

export function MetricCard({
  title,
  value,
  change,
  percentageChange,
  icon,
  color,
  isActive,
  onClick,
}: MetricCardProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || Users;
  const colors = colorMap[color as keyof typeof colorMap] || colorMap.blue;

  const isPositive = change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Pressable onPress={onClick}>
      <Card
        className={`transition-all hover:shadow-md ${
          isActive ? colors.active : ""
        }`}
      >
        <VStack className="space-y-3">
          <HStack className="justify-between items-center">
            <VStack>
              <Text size="sm" className="text-gray-500">
                {title}
              </Text>
              <Heading size="xl" className={colors.text}>
                {value.toLocaleString()}
              </Heading>
            </VStack>
            <div className={`p-3 rounded-full ${colors.bg}`}>
              <IconComponent className={colors.icon} size={24} />
            </div>
          </HStack>

          <HStack className="items-center space-x-2">
            <HStack
              className={`items-center space-x-1 ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              <TrendIcon size={16} />
              <Text size="sm" className="font-medium">
                {isPositive ? "+" : ""}
                {percentageChange.toFixed(1)}%
              </Text>
            </HStack>
            <Text size="sm" className="text-gray-400">
              vs previous period
            </Text>
          </HStack>

          <Text size="xs" className="text-gray-400">
            {Math.abs(change)} {isPositive ? "increase" : "decrease"}
          </Text>
        </VStack>
      </Card>
    </Pressable>
  );
}
