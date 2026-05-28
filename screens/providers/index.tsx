"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Wrench,
  Zap,
  Wind,
  Snowflake,
  PaintBucket,
  Hammer,
  Package,
  Bug,
  Scissors,
  Truck,
  ChevronRight,
  Loader2,
  MapPin,
  Search,
} from "lucide-react";
import Link from "next/link";
import useGlobalStore from "@/stores";
import { Subcategory, Category } from "@/types";

import { useProviderSearch } from "../../hooks/useProviderSearch";
import { useCategories } from "../../hooks/useCategories";

import UniversalSearch from "@/components/UniversalSearch";
import FilterBar from "./FilterBar";
import FilterDrawer from "./FilterDrawer";
import ProviderCard, { ProviderCardSkeleton } from "./ProviderCard";
import EmptyState from "./EmptyState";
import MapPanel from "./MapPanel";
import { Filters } from "./FilterSidebar";

// ─── Category icon map ────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  plumbing: Wrench,
  electrical: Zap,
  cleaning: Wind,
  "ac repair": Snowflake,
  "air conditioning": Snowflake,
  painting: PaintBucket,
  carpentry: Hammer,
  appliance: Package,
  pest: Bug,
  landscaping: Scissors,
  moving: Truck,
};

function getCategoryIcon(name: string): React.ElementType {
  const key = name.toLowerCase();
  for (const [k, Icon] of Object.entries(CATEGORY_ICONS)) {
    if (key.includes(k)) return Icon;
  }
  return Wrench;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_FILTERS: Filters = {
  minRating: 0,
  openNow: false,
  verifiedOnly: false,
  topRated: false,
  newOnly: false,
  radius: "30",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ServiceProvidersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    selectedSubcategories,
    toggleSubcategory,
    clearSelectedSubcategories,
  } = useGlobalStore();

  // ── State ──────────────────────────────────────────────────────────────────
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [location, setLocation] = useState(searchParams.get("location") ?? "");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState("Relevance");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  /** Which category row is expanded to show its subcategories */
  const [expandedCatId, setExpandedCatId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => {
        /* silently fall back to default center */
      }
    );
  }, []);

  // ── Derived ────────────────────────────────────────────────────────────────
  const activeFiltersCount = useMemo(() => {
    let n = 0;
    if (filters.minRating > 0) n++;
    if (filters.openNow) n++;
    if (filters.verifiedOnly) n++;
    if (filters.topRated) n++;
    if (filters.newOnly) n++;
    if (filters.radius !== "30") n++;
    n += selectedSubcategories.length;
    return n;
  }, [filters, selectedSubcategories]);

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
      lat: userLocation?.lat,
      long: userLocation?.lng,
    }),
    [query, location, sortBy, selectedSubcategories, filters, userLocation]
  );

  // ── Data ───────────────────────────────────────────────────────────────────
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
  const categories: Category[] = categoriesData ?? [];

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSearch = useCallback(
    (q: string, loc: string) => {
      setQuery(q);
      setLocation(loc);
      const p = new URLSearchParams();
      if (q) p.set("q", q);
      if (loc) p.set("location", loc);
      router.replace(`/providers?${p.toString()}`, { scroll: false });
    },
    [router]
  );

  const handleFiltersChange = useCallback(
    (partial: Partial<Filters>) =>
      setFilters((prev) => ({ ...prev, ...partial })),
    []
  );

  const handleFiltersReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    clearSelectedSubcategories?.();
    setExpandedCatId(null);
  }, [clearSelectedSubcategories]);

  const handleReset = useCallback(() => {
    setQuery("");
    setLocation("");
    handleFiltersReset();
    router.replace("/providers", { scroll: false });
  }, [handleFiltersReset, router]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleToggleSubcat = useCallback(
    (sub: Subcategory) => toggleSubcategory(sub),
    [toggleSubcategory]
  );

  const handleCategoryClick = useCallback((cat: Category) => {
    setExpandedCatId((prev) => (prev === cat._id ? null : cat._id));
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative h-[calc(100vh-5rem)] mt-20 overflow-hidden m-4">
      {/* ══════════════════════════════════════════════════════
          LAYER 1 — Full-width Google Map (background)
      ══════════════════════════════════════════════════════ */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[40%]">
        <MapPanel
          providers={providers}
          hoveredId={hoveredId}
          onHover={setHoveredId}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          center={userLocation ?? undefined}
          className="w-full h-full"
        />
      </div>

      {/* ══════════════════════════════════════════════════════
          LAYER 2 — Floating glassmorphism panel (left ~65%)
      ══════════════════════════════════════════════════════ */}
      <div className="absolute gap-4 left-0 top-0 bottom-0 w-full lg:w-2/3 flex flex-col overflow-hidden">
        {/* ── Page heading ── */}
        <div className="flex-shrink-0 px-4 pt-4 pb-2 space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            Find trusted <span className="text-brand-primary">business</span>
            <br /> near you
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Quality services from verified professionals.
          </p>
        </div>

        {/* ── Universal Search (non-sticky, inside glass panel) ── */}
        <div className="flex-shrink-0">
          <UniversalSearch
            variant="hero"
            initialQuery={query}
            initialLocation={location}
            onSearch={handleSearch}
          />
        </div>
        {/* ── Categories sidebar + Provider list ── */}
        <div className="flex flex-1 overflow-hidden">
          {/* Categories sidebar */}
          <div className="hidden gap-2 lg:flex flex-col w-44 xl:w-60 flex-shrink-0 overflow-y-auto no-scrollbar">
            <p className="px-4 py-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Categories
            </p>

            {isLoading && categories.length === 0
              ? Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2.5 animate-pulse"
                  >
                    <div className="w-6 h-6 bg-gray-200 rounded-lg" />
                    <div className="flex-1 h-3 bg-gray-200 rounded" />
                  </div>
                ))
              : categories.map((cat) => {
                  const Icon = getCategoryIcon(cat.name);
                  const isExpanded = expandedCatId === cat._id;
                  const hasSubcats = (cat.subcategories?.length ?? 0) > 0;
                  const activeSubCount = selectedSubcategories.filter((s) =>
                    cat.subcategories?.some((sub) => sub._id === s._id)
                  ).length;

                  return (
                    <div key={cat._id}>
                      {/* Category row */}
                      <button
                        type="button"
                        onClick={() => handleCategoryClick(cat)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors group ${
                          isExpanded || activeSubCount > 0
                            ? "bg-blue-50/80 text-blue-700"
                            : "bg-white text-gray-600 hover:bg-white/60 hover:text-gray-900"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                            isExpanded || activeSubCount > 0
                              ? "bg-blue-100"
                              : "bg-gray-100/80 group-hover:bg-gray-200"
                          }`}
                        >
                          <Icon
                            size={12}
                            className={
                              isExpanded || activeSubCount > 0
                                ? "text-blue-600"
                                : "text-gray-500"
                            }
                          />
                        </div>
                        <span className="flex-1 text-xs font-semibold line-clamp-1">
                          {cat.name}
                        </span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {activeSubCount > 0 && (
                            <span className="w-4 h-4 bg-blue-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                              {activeSubCount}
                            </span>
                          )}
                          {hasSubcats && (
                            <ChevronRight
                              size={11}
                              className={`text-gray-400 transition-transform duration-200 ${
                                isExpanded ? "rotate-90" : ""
                              }`}
                            />
                          )}
                        </div>
                      </button>

                      {/* Subcategories (expand/collapse) */}
                      <AnimatePresence initial={false}>
                        {isExpanded && hasSubcats && (
                          <motion.div
                            key="subcats"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.22,
                              ease: [0.4, 0, 0.2, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pt-2 flex flex-col gap-1">
                              {cat.subcategories.map((sub) => {
                                const isActive = selectedSubcategories.some(
                                  (s) => s._id === sub._id
                                );
                                return (
                                  <button
                                    key={sub._id}
                                    type="button"
                                    onClick={() => handleToggleSubcat(sub)}
                                    className={`flex flex-row gap-2 text-left px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                                      isActive
                                        ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                                        : "bg-white/70 text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-100"
                                    }`}
                                  >
                                    {sub.icon && (
                                      <span
                                        className="flex-shrink-0 w-4 h-4"
                                        dangerouslySetInnerHTML={{ __html: sub.icon }}
                                      />
                                    )}
                                    {sub.name}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

            {categories.length > 0 && (
              <button
                type="button"
                onClick={handleFiltersReset}
                className="flex items-center gap-1 px-4 py-2.5 text-xs font-semibold text-blue-600 hover:underline"
              >
                Clear all filters
              </button>
            )}

            {/* Provider CTA */}
            <div className="mx-3 mt-4 mb-3 rounded-xl bg-blue-600 p-3 text-white flex-shrink-0">
              <p className="text-xs font-black leading-snug mb-1">
                Are you a provider?
              </p>
              <p className="text-[10px] text-blue-100 mb-2.5">
                Join and grow your business
              </p>
              <Link
                href="/register"
                className="block text-center py-1.5 bg-white text-blue-600 text-[10px] font-black rounded-lg hover:bg-blue-50 transition-colors"
              >
                Join now
              </Link>
            </div>
          </div>

          {/* Provider list */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {isError ? (
              <EmptyState variant="error" onRetry={refetch} />
            ) : isLoading ? (
              <div className="flex flex-col gap-2 p-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProviderCardSkeleton key={i} />
                ))}
              </div>
            ) : providers.length === 0 ? (
              <EmptyState
                variant="no-results"
                query={query || undefined}
                onReset={handleReset}
              />
            ) : (
              <>
                {/* ── Filter bar ── */}
                <div className="flex-shrink-0 px-6">
                  <FilterBar
                    filters={filters}
                    sortBy={sortBy}
                    resultCount={totalCount}
                    isLoading={isLoading}
                    onFiltersOpen={() => setFiltersOpen(true)}
                    onSortChange={setSortBy}
                    onFiltersChange={handleFiltersChange}
                    activeFiltersCount={activeFiltersCount}
                  />
                </div>
                <div className="flex flex-col gap-2 pl-8  pt-8">
                  {providers.map((p, i) => (
                    <ProviderCard
                      key={p._id}
                      provider={p}
                      index={i}
                      isHovered={hoveredId === p._id}
                      onHover={setHoveredId}
                    />
                  ))}
                </div>

                <div className="py-5 flex justify-center">
                  {isFetchingNextPage ? (
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Loader2
                        size={15}
                        className="animate-spin text-blue-500"
                      />
                      Loading more...
                    </div>
                  ) : hasNextPage ? (
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      className="px-6 py-2.5 border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors text-sm"
                    >
                      Load more
                    </button>
                  ) : (
                    <p className="text-xs text-gray-400 font-medium">
                      All {providers.length} companies shown
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MOBILE — full-screen map overlay
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {viewMode === "map" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden pt-20"
          >
            <MapPanel
              providers={providers}
              hoveredId={hoveredId}
              onHover={setHoveredId}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              center={userLocation ?? undefined}
              className="h-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile FAB */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden">
        <button
          type="button"
          onClick={() => setViewMode((v) => (v === "list" ? "map" : "list"))}
          className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white text-sm font-bold rounded-full shadow-2xl"
        >
          {viewMode === "list" ? (
            <>
              <MapPin size={14} /> Show map
            </>
          ) : (
            <>
              <Search size={14} /> Show list
            </>
          )}
        </button>
      </div>

      {/* Filter drawer */}
      <FilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onChange={handleFiltersChange}
        onReset={handleFiltersReset}
        resultCount={totalCount}
        categories={categories}
        selectedSubcategoryIds={selectedSubcategories.map((s) => s._id)}
        onToggleSubcategory={handleToggleSubcat}
      />
    </div>
  );
}
