"use client";

import { useEffect } from "react";
import { useDashboardStore, Metric } from "@/stores/dashboard-store";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TimeRangeSelector } from "@/components/admin/TimeRangeSelector";

export default function GrowthTrends() {
  const { metrics, timeRange, isLoading, error, fetchMetrics, setTimeRange } =
    useDashboardStore((state) => ({
      metrics: state.metrics,
      timeRange: state.timeRange,
      isLoading: state.isLoading,
      error: state.error,
      fetchMetrics: state.fetchMetrics,
      setTimeRange: state.setTimeRange,
    }));

  useEffect(() => {
    fetchMetrics(timeRange);
  }, [timeRange, fetchMetrics]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <VStack className="space-y-6">
      <HStack className="justify-between items-center">
        <Heading size="lg">Growth Trends</Heading>
        <TimeRangeSelector
          currentRange={timeRange}
          onRangeChange={setTimeRange}
        />
      </HStack>
      <HStack className="grid grid-cols-2 gap-6">
        <MetricCard
          title="Total Users"
          value={metrics.reduce((sum, m) => sum + m.value, 0)}
          change={calculateChange(metrics)}
        />

        <Card className="col-span-2 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </HStack>
    </VStack>
  );
}

function MetricCard({ title, value, change }) {
  return (
    <Card>
      <Heading size="sm">{title}</Heading>
      <Text size="sm">{value.toLocaleString()}</Text>
      <Text
        size="xs"
        className={change >= 0 ? "text-green-500" : "text-red-500"}
      >
        {change >= 0 ? "↑" : "↓"} {Math.abs(change)}% vs previous period
      </Text>
    </Card>
  );
}

function calculateChange(metrics: Metric[]): number {
  if (metrics.length < 2) return 0;
  const current = metrics[metrics.length - 1].value;
  const previous = metrics[metrics.length - 2].value;
  return ((current - previous) / previous) * 100;
}
