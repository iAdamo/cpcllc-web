"use client";

import { useEffect, useState } from "react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import {
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

type MetricData = {
  title: string;
  value: number;
  change: number;
  icon: JSX.Element;
  iconBg: string;
  dataKey: string;
};

type TimeSeriesData = {
  date: string;
  users: number;
  clients: number;
  companies: number;
  activeCompanies: number;
};

export default function DashboardView() {
  const timeRange = useDashboardStore((s) => s.timeRange);
  const [showWelcome, setShowWelcome] = useState(false);
  const fetchMetrics = useDashboardStore((s) => s.fetchMetrics);
  const setTimeRange = useDashboardStore((s) => s.setTimeRange);

  // Generate more realistic dummy data with different trends for each metric
  const generateDummyData = (): TimeSeriesData[] => {
    const data: TimeSeriesData[] = [];
    const now = new Date();

    for (let i = 50; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      // Base values with different growth patterns
      const dayIndex = 50 - i;
      data.push({
        date: dateStr,
        users: Math.round(
          1000 +
            Math.sin(dayIndex / 8) * 100 +
            dayIndex * 5 +
            Math.random() * 50
        ),
        clients: Math.round(
          800 + Math.sin(dayIndex / 10) * 80 + dayIndex * 3 + Math.random() * 40
        ),
        companies: Math.round(
          300 +
            Math.sin(dayIndex / 15) * 50 +
            dayIndex * 1.5 +
            Math.random() * 30
        ),
        activeCompanies: Math.round(
          250 +
            Math.sin(dayIndex / 12) * 40 +
            dayIndex * 1.2 +
            Math.random() * 20
        ),
      });
    }

    return data;
  };

  const [timeSeriesData] = useState<TimeSeriesData[]>(generateDummyData());
  const latestData = timeSeriesData[timeSeriesData.length - 1];

  const metricsData: MetricData[] = [
    {
      title: "Total Users",
      value: latestData.users,
      change: calculateChange(timeSeriesData, "users"),
      icon: <Icon as={TotalUsersIcon} />,
      iconBg: "bg-blue-100 text-blue-600",
      dataKey: "users",
    },
    {
      title: "Total Clients",
      value: latestData.clients,
      change: calculateChange(timeSeriesData, "clients"),
      icon: <Icon as={TotalClientsIcon} />,
      iconBg: "bg-orange-100 text-orange-600",
      dataKey: "clients",
    },
    {
      title: "Total Companies",
      value: latestData.companies,
      change: calculateChange(timeSeriesData, "companies"),
      icon: <Icon as={TotalProvidersIcon} />,
      iconBg: "bg-teal-100 text-teal-600",
      dataKey: "companies",
    },
    {
      title: "Active Companies",
      value: latestData.activeCompanies,
      change: calculateChange(timeSeriesData, "activeCompanies"),
      icon: <Icon as={ActiveIcon} />,
      iconBg: "bg-gray-100 text-gray-600",
      dataKey: "activeCompanies",
    },
  ];

  const [selectedMetric, setSelectedMetric] = useState<MetricData>(
    metricsData[0]
  );

  useEffect(() => {
    fetchMetrics(timeRange);
  }, [timeRange, fetchMetrics]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <VStack className="space-y-4">
      {!showWelcome && (
        <Card className="bg-green-100 border-green-200">
          <Heading className="text-green-800">Welcome Alejandro</Heading>
          <Text size="sm" className="text-green-600">
            Your dashboard is ready with the latest metrics
          </Text>
        </Card>
      )}

      <HStack className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((metric) => (
          <MetricCard
            key={metric.title}
            metric={metric}
            isActive={selectedMetric.title === metric.title}
            onClick={() => setSelectedMetric(metric)}
          />
        ))}
      </HStack>

      <Card className="space-y-4">
        <HStack className="justify-between items-center">
          <VStack className="space-y-1">
            <Heading size="lg">{selectedMetric.title} Trends</Heading>
            <Text size="sm" className="text-gray-500">
              Last {timeSeriesData.length} days
            </Text>
          </VStack>
          <TimeRangeSelector
            currentRange={timeRange}
            onRangeChange={setTimeRange}
          />
        </HStack>

        <VStack className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={timeSeriesData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id={`color${selectedMetric.dataKey}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }}
                formatter={(value) => [value, selectedMetric.title]}
                labelStyle={{ fontWeight: "bold" }}
              />
              <Area
                type="monotone"
                dataKey={selectedMetric.dataKey}
                stroke="#3B82F6"
                fillOpacity={1}
                fill={`url(#color${selectedMetric.dataKey})`}
                strokeWidth={2}
                activeDot={{ r: 6, stroke: "#2563EB", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </VStack>
      </Card>
    </VStack>
  );
}

type MetricCardProps = {
  metric: MetricData;
  isActive: boolean;
  onClick: () => void;
};

function MetricCard({ metric, isActive, onClick }: MetricCardProps) {
  return (
    <Card
      className={`w-full h-32 justify-between transition-all cursor-pointer ${
        isActive ? "ring-2 ring-blue-500" : "hover:bg-gray-50"
      }`}
      onPointerDown={onClick}
    >
      <HStack className="justify-between items-center">
        <VStack>
          <Text size="sm" className="text-gray-500">
            {metric.title}
          </Text>
          <Heading size="lg" className="text-gray-800">
            {metric.value.toLocaleString()}
          </Heading>
        </VStack>
        <div className={`p-3 rounded-full ${metric.iconBg}`}>{metric.icon}</div>
      </HStack>
      <HStack className="items-center">
        <Text
          size="sm"
          className={metric.change >= 0 ? "text-green-500" : "text-red-500"}
        >
          {metric.change >= 0 ? "↑" : "↓"} {Math.abs(metric.change).toFixed(1)}%
        </Text>
        <Text size="sm" className="text-gray-500 ml-1">
          vs previous period
        </Text>
      </HStack>
    </Card>
  );
}

function calculateChange(
  data: TimeSeriesData[],
  dataKey: keyof TimeSeriesData
): number {
  if (data.length < 2) return 0;

  // Compare last 7 days with previous 7 days for more stable trend calculation
  const recentPeriod = data.slice(-7);
  const previousPeriod = data.slice(-14, -7);

  if (recentPeriod.length === 0 || previousPeriod.length === 0) return 0;

  const recentAvg =
    recentPeriod.reduce((sum, item) => sum + Number(item[dataKey]), 0) /
    recentPeriod.length;
  const previousAvg =
    previousPeriod.reduce((sum, item) => sum + Number(item[dataKey]), 0) /
    previousPeriod.length;

  if (previousAvg === 0) return 0;

  return ((recentAvg - previousAvg) / previousAvg) * 100;
}
