"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  X,
  SlidersHorizontal,
  Map,
  List,
  Navigation,
} from "lucide-react";

// ─── Shared types ────────────────────────────────────────────────────────────

interface BaseSearchProps {
  initialQuery?: string;
  initialLocation?: string;
  /** Called after internal state updates so parent can react. Omit to have the
   *  component push to /providers itself (hero mode default). */
  onSearch?: (query: string, location: string) => void;
}

// ─── Hero variant ─────────────────────────────────────────────────────────────

interface HeroSearchProps extends BaseSearchProps {
  variant: "hero";
  popularTags?: string[];
}

// ─── Header variant ──────────────────────────────────────────────────────────

interface HeaderSearchProps extends BaseSearchProps {
  variant: "header";
  activeFiltersCount: number;
  viewMode: "list" | "map";
  onViewModeChange: (mode: "list" | "map") => void;
  onFiltersOpen: () => void;
}

export type UniversalSearchProps = HeroSearchProps | HeaderSearchProps;

// ─── Component ───────────────────────────────────────────────────────────────

export default function UniversalSearch(props: UniversalSearchProps) {
  const { variant, initialQuery = "", initialLocation = "", onSearch } = props;

  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  // Sticky scroll blur — header only
  useEffect(() => {
    if (variant !== "header") return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  const handleSearch = useCallback(() => {
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    if (location) p.set("location", location);
    if (onSearch) {
      onSearch(query, location);
    } else {
      router.push(`/providers?${p.toString()}`);
    }
  }, [query, location, onSearch, router]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  // ── Hero variant ──────────────────────────────────────────────────────────
  if (variant === "hero") {
    const { popularTags = ["Plumbing", "HVAC", "Electrical", "Cleaning", "Roofing", "Painting"] } =
      props as HeroSearchProps;

    return (
      <div className="w-full max-w-2xl">
        {/* Search card */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-black/25 overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            {/* Service input */}
            <div className="flex items-center flex-1 px-5 py-4 border-b sm:border-b-0 sm:border-r border-gray-100">
              <Search className="text-blue-600 w-5 h-5 mr-3 flex-shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-0.5">
                  What
                </span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Plumbing, HVAC, Electrical…"
                  className="text-gray-900 placeholder-gray-300 font-medium text-sm bg-transparent outline-none w-full"
                />
              </div>
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="ml-2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Location input */}
            <div className="flex items-center flex-1 px-5 py-4 border-b sm:border-b-0 border-gray-100">
              <MapPin className="text-blue-600 w-5 h-5 mr-3 flex-shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-0.5">
                  Where
                </span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Tampa, Florida"
                  className="text-gray-900 placeholder-gray-300 font-medium text-sm bg-transparent outline-none w-full"
                />
              </div>
            </div>

            {/* Button */}
            <div className="p-2.5">
              <button
                type="button"
                onClick={handleSearch}
                className="w-full sm:w-auto h-full px-7 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-95 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap text-sm shadow-lg shadow-blue-500/30"
              >
                <Search size={15} />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Popular tags */}
        {popularTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-white/40 text-sm font-medium">Popular:</span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setQuery(tag);
                  router.push(`/providers?q=${encodeURIComponent(tag)}`);
                }}
                className="text-white/75 text-sm bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full border border-white/15 transition-colors backdrop-blur-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Header variant ────────────────────────────────────────────────────────
  const { activeFiltersCount, viewMode, onViewModeChange, onFiltersOpen } =
    props as HeaderSearchProps;

  return (
    <div
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-md border-b border-gray-100"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 py-3">
        <div className="flex items-center gap-2 sm:gap-3">

          {/* ── Desktop: dual-input bar ── */}
          <div className="hidden md:flex flex-1 items-center bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            {/* Service */}
            <div className="flex items-center flex-1 px-4 py-3 min-w-0">
              <Search size={15} className="text-blue-500 mr-2.5 flex-shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.12em]">
                  Service
                </span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Plumbing, HVAC, Electrical..."
                  className="text-gray-900 placeholder-gray-400 font-medium text-sm bg-transparent outline-none w-full"
                />
              </div>
              <AnimatePresence>
                {query && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setQuery("")}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={13} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-8 bg-gray-200 flex-shrink-0" />

            {/* Location */}
            <div className="flex items-center flex-1 px-4 py-3 min-w-0">
              <MapPin size={15} className="text-blue-500 mr-2.5 flex-shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.12em]">
                  Location
                </span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Tampa, Florida"
                  className="text-gray-900 placeholder-gray-400 font-medium text-sm bg-transparent outline-none w-full"
                />
              </div>
              <AnimatePresence>
                {location && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setLocation("")}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={13} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Search button */}
            <div className="pr-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleSearch}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl transition-all text-sm flex items-center gap-2 shadow-sm whitespace-nowrap"
              >
                <Search size={14} />
                Search
              </button>
            </div>
          </div>

          {/* ── Mobile: single search input ── */}
          <div className="md:hidden flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search size={14} className="text-gray-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKey}
              placeholder="Search services or companies..."
              className="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none min-w-0"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="ml-1.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter button */}
          <button
            type="button"
            onClick={onFiltersOpen}
            className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all flex-shrink-0 ${
              activeFiltersCount > 0
                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* View mode toggle */}
          <div className="flex bg-gray-100 rounded-xl p-0.5 flex-shrink-0">
            {(["list", "map"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onViewModeChange(mode)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  viewMode === mode
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                aria-label={`${mode} view`}
              >
                {mode === "list" ? <List size={13} /> : <Map size={13} />}
                <span className="hidden sm:inline capitalize">{mode}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
