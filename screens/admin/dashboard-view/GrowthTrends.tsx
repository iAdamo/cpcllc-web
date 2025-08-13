"use client";

import { useEffect, useMemo } from "react";
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
  const metrics = useDashboardStore((s) => s.metrics);
  const timeRange = useDashboardStore((s) => s.timeRange);
  const isLoading = useDashboardStore((s) => s.isLoading);
  const error = useDashboardStore((s) => s.error);

  const fetchMetrics = useDashboardStore((s) => s.fetchMetrics);
  const setTimeRange = useDashboardStore((s) => s.setTimeRange);

  useEffect(() => {
    fetchMetrics(timeRange);
  }, [timeRange, fetchMetrics]);

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <Card className="space-y-4">
      <Heading size="lg">Growth Trends</Heading>
      <VStack className="">
        <VStack className="h-72">
          <ResponsiveContainer width="100%" height="100%" className="w-full h-full">
            <LineChart data={metrics} className="">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </VStack>
        <TimeRangeSelector
          currentRange={timeRange}
          onRangeChange={setTimeRange}
        />
      </VStack>
    </Card>
  );
}
