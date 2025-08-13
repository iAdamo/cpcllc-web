"use client";

import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { TimeRange } from "@/stores/dashboard-store";

interface TimeRangeSelectorProps {
  currentRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

export function TimeRangeSelector({
  currentRange,
  onRangeChange,
}: TimeRangeSelectorProps) {
  const ranges: TimeRange[] = ["daily", "weekly", "monthly", "yearly"];

  return (
    <VStack className="self-end">
      <HStack className="space-x-2">
        {ranges.map((range) => (
          <Button
            size="sm"
            key={range}
            variant={currentRange === range ? "solid" : "outline"}
            onPress={() => onRangeChange(range)}
            className={
              currentRange === range
                ? "bg-blue-500 dark:bg-blue-600"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            }
          >
            <ButtonText
              className={`text-sm ${
                currentRange === range
                  ? "text-white dark:text-gray-100"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </ButtonText>
          </Button>
        ))}
      </HStack>
    </VStack>
  );
}
