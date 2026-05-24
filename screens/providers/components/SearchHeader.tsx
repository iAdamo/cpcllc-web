"use client";

import UniversalSearch from "@/components/UniversalSearch";

interface SearchHeaderProps {
  initialQuery?: string;
  initialLocation?: string;
  activeFiltersCount: number;
  viewMode: "list" | "map";
  onViewModeChange: (mode: "list" | "map") => void;
  onFiltersOpen: () => void;
  onSearch: (query: string, location: string) => void;
}

export default function SearchHeader(props: SearchHeaderProps) {
  return (
    <UniversalSearch
      variant="header"
      initialQuery={props.initialQuery}
      initialLocation={props.initialLocation}
      activeFiltersCount={props.activeFiltersCount}
      viewMode={props.viewMode}
      onViewModeChange={props.onViewModeChange}
      onFiltersOpen={props.onFiltersOpen}
      onSearch={props.onSearch}
    />
  );
}
