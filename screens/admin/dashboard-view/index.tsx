"use client";

import { useEffect, useState } from "react";
import useGlobalStore from "@/stores";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
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
import { InsightCard } from "@/components/admin/InsightCard";
import { MetricCard } from "@/components/admin/MetricCard";

export default function DashboardView() {
  const {
    fetchMetrics,
    metricsData,
    isLoading,
    granularity,
    selectedYear,
    selectedMonth,
  } = useGlobalStore();

  const [selectedMetric, setSelectedMetric] = useState("users");

  useEffect(() => {
    fetchMetrics();
  }, [granularity, selectedYear, selectedMonth, fetchMetrics]);

  if (isLoading || !metricsData) {
    return (
      <VStack className="h-64 items-center justify-center">
        <Text>Loading dashboard data...</Text>
      </VStack>
    );
  }

  const { summary, timeSeries, comparison, insights } = metricsData;

  const metrics = [
    {
      title: "Total Users",
      value: summary.users,
      change: comparison.usersChange,
      percentageChange: comparison.percentageChange,
      icon: "users",
      color: "blue",
      dataKey: "users",
      subtitle: "All-time total",
    },
    {
      title: "New Users",
      value: summary.newUsers,
      change: summary.newUsers,
      percentageChange: comparison.percentageChange,
      icon: "userPlus",
      color: "green",
      dataKey: "newUsers",
      subtitle: `This ${granularity === "daily" ? "month" : "year"}`,
    },
    {
      title: "Total Providers",
      value: summary.providers,
      change: comparison.providersChange,
      percentageChange: (summary.providers / summary.users) * 100,
      icon: "building",
      color: "purple",
      dataKey: "providers",
      subtitle: "All-time total",
    },
    {
      title: "Active Providers",
      value: summary.activeProviders,
      change: comparison.activeProvidersChange,
      percentageChange: (summary.activeProviders / summary.providers) * 100,
      icon: "activity",
      color: "orange",
      dataKey: "activeProviders",
      subtitle: "Currently active",
    },
  ];

  // Get the selected metric details for the chart
  const selectedMetricDetails = metrics.find(
    (m) => m.dataKey === selectedMetric
  );

  return (
    <VStack className="space-y-6 p-6">
      {/* Insights Section */}
      {insights && insights.length > 0 && (
        <VStack className="space-y-2">
          <Heading size="md">Key Insights</Heading>
          <HStack className="space-x-4 overflow-x-auto pb-2">
            {insights.map((insight, index) => (
              <InsightCard key={index} {...insight} />
            ))}
          </HStack>
        </VStack>
      )}

      {/* Metrics Grid */}
      <HStack className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            {...metric}
            isActive={selectedMetric === metric.dataKey}
            onClick={() => setSelectedMetric(metric.dataKey)}
          />
        ))}
      </HStack>

      {/* Chart Section */}
      <Card className="p-6">
        <VStack className="space-y-4">
          <HStack className="justify-between items-center">
            <VStack>
              <Heading size="lg">{selectedMetricDetails?.title} Trends</Heading>
              <Text className="text-gray-500">
                {granularity === "monthly"
                  ? `Monthly new ${selectedMetricDetails?.title.toLowerCase()} in ${selectedYear}`
                  : `Daily new ${selectedMetricDetails?.title.toLowerCase()} in ${new Date(
                      selectedYear,
                      selectedMonth! - 1
                    ).toLocaleString("default", {
                      month: "long",
                    })} ${selectedYear}`}
              </Text>
            </VStack>

            <TimeRangeSelector />
          </HStack>

          <VStack className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeries}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  interval={granularity === "daily" ? 3 : 0}
                  angle={granularity === "daily" ? -45 : 0}
                  textAnchor={granularity === "daily" ? "end" : "middle"}
                  height={60}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    value.toLocaleString(),
                    selectedMetricDetails?.title || "Count",
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="#3B82F6"
                  fill="url(#colorMetric)"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </VStack>
        </VStack>
      </Card>

      {/* Summary Stats */}
      <HStack className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="">
          <Text className="text-gray-500">Growth Rate</Text>
          <Heading
            size="xl"
            className={
              comparison.percentageChange >= 0
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {comparison.percentageChange >= 0 ? "+" : ""}
            {comparison.percentageChange.toFixed(1)}%
          </Heading>
          <Text size="sm" className="text-gray-400">
            vs previous {granularity === "monthly" ? "year" : "month"}
          </Text>
        </Card>

        <Card className="">
          <Text className="text-gray-500">
            Average per {granularity === "monthly" ? "Month" : "Day"}
          </Text>
          <Heading size="xl">
            {(
              timeSeries.reduce(
                (sum, item) =>
                  sum +
                  ((item[selectedMetric as keyof typeof item] as number) || 0),
                0
              ) / timeSeries.length
            ).toFixed(0)}
          </Heading>
          <Text size="sm" className="text-gray-400">
            Across {timeSeries.length}{" "}
            {granularity === "monthly" ? "months" : "days"}
          </Text>
        </Card>

        <Card className="">
          <Text className="text-gray-500">Provider Ratio</Text>
          <Heading size="xl">
            {((summary.providers / summary.users) * 100).toFixed(1)}%
          </Heading>
          <Text size="sm" className="text-gray-400">
            {summary.providers.toLocaleString()} out of{" "}
            {summary.users.toLocaleString()} users
          </Text>
        </Card>
      </HStack>

      {/* Peak Performance Card */}
      {/* {timeSeries.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <HStack className="justify-between items-center">
            <VStack>
              <Text className="text-blue-600 font-medium">
                Peak Performance
              </Text>
              <Heading size="lg" className="text-blue-700">
                {Math.max(
                  ...timeSeries.map(
                    (item) =>
                      (item[selectedMetric as keyof typeof item] as number) || 0
                  )
                ).toLocaleString()}{" "}
                {selectedMetricDetails?.title}
              </Heading>
              <Text className="text-blue-500">
                Highest {selectedMetricDetails?.title.toLowerCase()} recorded on{" "}
                {
                  timeSeries.reduce((max, item) =>
                    ((item[selectedMetric as keyof typeof item] as number) ||
                      0) >
                    ((max[selectedMetric as keyof typeof item] as number) || 0)
                      ? item
                      : max
                  ).label
                }
              </Text>
            </VStack>
            <div className="p-3 rounded-full bg-blue-100">
              <span className="text-2xl">📈</span>
            </div>
          </HStack>
        </Card>
      )} */}
    </VStack>
  );
}
