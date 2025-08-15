"use client";

import { useEffect, useState, useMemo } from "react";
import { useDashboardStore, Metric } from "@/stores/dashboard-store";
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
import {
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TimeRangeSelector } from "@/components/admin/TimeRangeSelector";

export default function DashboardView() {
  // const metrics = useDashboardStore((s) => s.metrics);
  const timeRange = useDashboardStore((s) => s.timeRange);
  // const isLoading = useDashboardStore((s) => s.isLoading);
  // const error = useDashboardStore((s) => s.error);
  // Dummy data for testing (50 days)
    const [showWelcome, setShowWelcome] = useState(false);

  const dummyMetrics = Array.from({ length: 50 }, (_, i) => ({
    date: `2025-07-${(i + 1).toString().padStart(2, "0")}`,
    value:
      1000 + Math.round(Math.sin(i / 5) * 30 + i * 2 + Math.random() * 1000),
  }));
  const metrics = dummyMetrics;
  const fetchMetrics = useDashboardStore((s) => s.fetchMetrics);
  const setTimeRange = useDashboardStore((s) => s.setTimeRange);

  useEffect(() => {
    fetchMetrics(timeRange);
  }, [timeRange, fetchMetrics]);

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <VStack className="space-y-4">
        {!showWelcome && (
        <Card className="bg-green-200">
          <Heading className="text-green-800">Welcome Alejandro</Heading>
        </Card>
      )}
      <HStack className="w-full grid grid-cols-4 gap-4">
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
      <Card className="space-y-4">
        <HStack className="justify-between">
          <Heading size="lg">Growth Trends</Heading>
          <TimeRangeSelector
            currentRange={timeRange}
            onRangeChange={setTimeRange}
          />
        </HStack>
        <VStack className="">
          <VStack className="h-72">
            <ResponsiveContainer
              width="100%"
              height={300}
              className="w-full focus:border-none"
            >
              <AreaChart data={metrics} className="w-full focus:border-none">
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="50%" stopColor="#00B69B" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  strokeWidth={2}
                  dot={{ fill: "#067368", r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </VStack>
        </VStack>
      </Card>
      <Card className="bg-white w-full h-96 overflow-hidden"></Card>
    </VStack>
  );
}
