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
  stickyHeader?: boolean;
}

export default function SearchHeader(props: SearchHeaderProps) {
  return (
    <UniversalSearch
      variant="header"
      stickyHeader={props.stickyHeader ?? false}
      initialQuery={props.initialQuery}
      initialLocation={props.initialLocation}
      onSearch={props.onSearch}
    />
  );
}
