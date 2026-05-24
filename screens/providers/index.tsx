"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import useGlobalStore from "@/stores";
import { Subcategory } from "@/types";

import { useProviderSearch } from "../../hooks/useProviderSearch";
import { useCategories } from "../../hooks/useCategories";

import SearchHeader from "./components/SearchHeader";
import CategoryBar from "./components/CategoryBar";
import FilterSidebar, { Filters } from "./components/FilterSidebar";
import FilterDrawer from "./components/FilterDrawer";
import ProviderList from "./components/ProviderList";
import MapPanel from "./components/MapPanel";

const DEFAULT_FILTERS: Filters = {
  minRating: 0,
  openNow: false,
  verifiedOnly: false,
  topRated: false,
  newOnly: false,
  radius: "30",
};

export default function ServiceProvidersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { selectedSubcategories, toggleSubcategory, clearSelectedSubcategories } =
    useGlobalStore();

  // ── URL-driven state ──────────────────────────────────────────
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [location, setLocation] = useState(searchParams.get("location") ?? "");

  // ── UI state ──────────────────────────────────────────────────
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState("Relevance");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [listStyle, setListStyle] = useState<"list" | "grid">("list");

  // ── Sync URL category param → Zustand on mount ────────────────
  useEffect(() => {
    const catParam = searchParams.get("q");
    if (catParam) setQuery(catParam);
  }, []);

  // ── Derived filter count for badge ────────────────────────────
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.minRating > 0) count++;
    if (filters.openNow) count++;
    if (filters.verifiedOnly) count++;
    if (filters.topRated) count++;
    if (filters.newOnly) count++;
    if (filters.radius !== "30") count++;
    if (selectedSubcategories.length > 0) count += selectedSubcategories.length;
    return count;
  }, [filters, selectedSubcategories]);

  // ── Data hooks ────────────────────────────────────────────────
  const searchFilters = useMemo(
    () => ({
      query: query || undefined,
      location: location || undefined,
      sortBy,
      categoryIds: selectedSubcategories.map((s) => s._id),
      minRating: filters.minRating,
      openNow: filters.openNow,
      verifiedOnly: filters.verifiedOnly,
      topRated: filters.topRated,
      radius: filters.radius,
    }),
    [query, location, sortBy, selectedSubcategories, filters]
  );

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    refetch,
  } = useProviderSearch(searchFilters);

  const { data: categoriesData } = useCategories();

  const providers = useMemo(
    () => data?.pages.flatMap((p) => p.providers) ?? [],
    [data]
  );

  const totalCount = data?.pages[0]?.total ?? providers.length;
  const categories = categoriesData ?? [];

  // ── Handlers ─────────────────────────────────────────────────
  const handleSearch = useCallback((q: string, loc: string) => {
    setQuery(q);
    setLocation(loc);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (loc) params.set("location", loc);
    router.replace(`/providers?${params.toString()}`, { scroll: false });
  }, [router]);

  const handleFiltersChange = useCallback((partial: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleFiltersReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    clearSelectedSubcategories?.();
  }, [clearSelectedSubcategories]);

  const handleToggleSubcategory = useCallback(
    (sub: Subcategory) => toggleSubcategory(sub),
    [toggleSubcategory]
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleReset = useCallback(() => {
    setQuery("");
    setLocation("");
    handleFiltersReset();
    router.replace("/providers", { scroll: false });
  }, [handleFiltersReset, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col mt-28">
      {/* ── Sticky search header ─────────────────────────────── */}
      <SearchHeader
        initialQuery={query}
        initialLocation={location}
        activeFiltersCount={activeFiltersCount}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onFiltersOpen={() => setFiltersOpen(true)}
        onSearch={handleSearch}
      />

      {/* ── Category bar ─────────────────────────────────────── */}
      <CategoryBar
        categories={categories}
        selectedSubcategoryIds={selectedSubcategories.map((s) => s._id)}
        onToggle={handleToggleSubcategory}
        onClear={handleFiltersReset}
      />

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="flex flex-1 max-w-[1600px] mx-auto w-full px-4 py-4 gap-5">
        {/* Left: Filter sidebar (desktop only) */}
        <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
          <div className="sticky top-[128px]">
            <FilterSidebar
              filters={filters}
              onChange={handleFiltersChange}
              onReset={handleFiltersReset}
              resultCount={totalCount}
              categories={categories}
              selectedSubcategoryIds={selectedSubcategories.map((s) => s._id)}
              onToggleSubcategory={handleToggleSubcategory}
            />
          </div>
        </aside>

        {/* Center: Provider list */}
        <AnimatePresence mode="wait">
          {(viewMode === "list" || true) && (
            <motion.div
              key="list-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex-1 min-w-0 ${viewMode === "map" ? "hidden md:flex" : "flex"} flex-col`}
            >
              <ProviderList
                providers={providers}
                isLoading={isLoading}
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={!!hasNextPage}
                isError={isError}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onLoadMore={handleLoadMore}
                query={query || undefined}
                onReset={handleReset}
                onRetry={refetch}
                hoveredId={hoveredId}
                onHover={setHoveredId}
                listStyle={listStyle}
                onListStyleChange={setListStyle}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right: Map panel (hidden on mobile in list mode) */}
        <div
          className={`${
            viewMode === "map"
              ? "flex-1"
              : "hidden xl:block w-[420px] 2xl:w-[500px]"
          } flex-shrink-0`}
        >
          <div className="sticky top-[128px] h-[calc(100vh-160px)]">
            <MapPanel
              providers={providers}
              hoveredId={hoveredId}
              onHover={setHoveredId}
              className="h-full"
            />
          </div>
        </div>
      </div>

      {/* ── Mobile: full-screen map mode ─────────────────────── */}
      <AnimatePresence>
        {viewMode === "map" && (
          <motion.div
            key="mobile-map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 xl:hidden pt-[120px]"
          >
            <MapPanel
              providers={providers}
              hoveredId={hoveredId}
              onHover={setHoveredId}
              className="h-full rounded-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile filter drawer ──────────────────────────────── */}
      <FilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onChange={handleFiltersChange}
        onReset={handleFiltersReset}
        resultCount={totalCount}
        categories={categories}
        selectedSubcategoryIds={selectedSubcategories.map((s) => s._id)}
        onToggleSubcategory={handleToggleSubcategory}
      />
    </div>
  );
}
