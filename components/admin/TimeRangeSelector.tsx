"use client";

import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";
import { TimeGranularity } from "@/types";
import useGlobalStore from "@/stores";

export function TimeRangeSelector() {
  const {
    granularity,
    selectedYear,
    selectedMonth,
    setGranularity,
    setSelectedYear,
    setSelectedMonth,
  } = useGlobalStore();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const handleGranularityChange = (newGranularity: TimeGranularity) => {
    setGranularity(newGranularity);
    // Auto-select current month when switching to daily
    if (newGranularity === "daily" && !selectedMonth) {
      setSelectedMonth(new Date().getMonth() + 1);
    }
  };

  return (
    <HStack className="space-x-4">
      <Button
        variant={granularity === "monthly" ? "solid" : "outline"}
        onPress={() => handleGranularityChange("monthly")}
        className={granularity === "monthly" ? "bg-blue-500" : ""}
      >
        <ButtonText className={granularity === "monthly" ? "text-white" : ""}>
          Monthly
        </ButtonText>
      </Button>

      <Button
        variant={granularity === "daily" ? "solid" : "outline"}
        onPress={() => handleGranularityChange("daily")}
        className={granularity === "daily" ? "bg-blue-500" : ""}
      >
        <ButtonText className={granularity === "daily" ? "text-white" : ""}>
          Daily
        </ButtonText>
      </Button>
      <Select
        className="w-24"
        selectedValue={selectedYear.toString()}
        onValueChange={(value) => setSelectedYear(parseInt(value))}
        initialLabel={selectedYear.toString()}
      >
        <SelectTrigger variant="outline" size="md">
          <SelectInput placeholder="Select year" />
          <SelectIcon className="mr-3" as={ChevronDownIcon} />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {years.map((year) => (
              <SelectItem
                key={year}
                value={year.toString()}
                label={year.toString()}
              />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>

      {granularity === "daily" && (
        <Select
          className="w-32"
          selectedValue={selectedMonth?.toString()}
          onValueChange={(value) => setSelectedMonth(parseInt(value))}
          initialLabel={selectedMonth
            ? months.find((m) => m.value === selectedMonth)?.label
            : "Select month"}
        >
          <SelectTrigger variant="outline" size="md">
            <SelectInput placeholder="Select month" />
            <SelectIcon className="mr-3" as={ChevronDownIcon} />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {months.map((month) => (
                <SelectItem
                  key={month.value}
                  value={month.value.toString()}
                  label={month.label}
                />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>
      )}
    </HStack>
  );
}
