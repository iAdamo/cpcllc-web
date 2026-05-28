"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  SlidersHorizontal,
  ChevronDown,
  Star,
  Check,
  ArrowUpDown,
} from "lucide-react";
import { Filters } from "./FilterSidebar";

const SORT_OPTIONS = [
  { value: "Relevance", label: "Relevance" },
  { value: "Top Rated", label: "Top Rated" },
  { value: "Most Reviewed", label: "Most Reviewed" },
  { value: "Newest", label: "Newly Joined" },
  { value: "Location", label: "Nearest" },
] as const;

const RATING_OPTIONS = [4, 4.5, 4.8] as const;

interface FilterBarProps {
  filters: Filters;
  sortBy: string;
  resultCount: number;
  isLoading: boolean;
  onFiltersOpen: () => void;
  onSortChange: (sort: string) => void;
  onFiltersChange: (partial: Partial<Filters>) => void;
  activeFiltersCount: number;
}

export default function FilterBar({
  filters,
  sortBy,
  resultCount,
  isLoading,
  onFiltersOpen,
  onSortChange,
  onFiltersChange,
  activeFiltersCount,
}: FilterBarProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node))
        setSortOpen(false);
      if (ratingRef.current && !ratingRef.current.contains(e.target as Node))
        setRatingOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeSort = SORT_OPTIONS.find((o) => o.value === sortBy);

  return (
    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
      {/* Filters button */}
      <button
        type="button"
        onClick={onFiltersOpen}
        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold flex-shrink-0 transition-all ${
          activeFiltersCount > 0
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
        }`}
      >
        <SlidersHorizontal size={12} />
        Filters
        {activeFiltersCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Sort dropdown */}
      <div ref={sortRef} className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => setSortOpen((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:border-blue-300 transition-colors"
        >
          <ArrowUpDown size={11} className="text-gray-400" />
          Sort: {activeSort?.label ?? "Relevance"}
          <ChevronDown
            size={11}
            className={`text-gray-400 transition-transform ${
              sortOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence>
          {sortOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.13 }}
              className="absolute left-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-30 py-1"
            >
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onSortChange(opt.value);
                    setSortOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors hover:bg-blue-50 ${
                    sortBy === opt.value
                      ? "text-blue-600 font-bold bg-blue-50/60"
                      : "text-gray-700 font-medium"
                  }`}
                >
                  {opt.label}
                  {sortBy === opt.value && (
                    <Check size={11} className="text-blue-600" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rating quick filter */}
      <div ref={ratingRef} className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => setRatingOpen((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            filters.minRating > 0
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
          }`}
        >
          <Star
            size={11}
            fill={filters.minRating > 0 ? "#d97706" : "none"}
            color={filters.minRating > 0 ? "#d97706" : "#9ca3af"}
          />
          Rating{filters.minRating > 0 ? ` ${filters.minRating}+` : ""}
          <ChevronDown size={11} className="text-gray-400" />
        </button>
        <AnimatePresence>
          {ratingOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.13 }}
              className="absolute left-0 top-full mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-30 py-1"
            >
              <button
                type="button"
                onClick={() => {
                  onFiltersChange({ minRating: 0 });
                  setRatingOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors hover:bg-blue-50 ${
                  filters.minRating === 0
                    ? "text-blue-600 font-bold"
                    : "text-gray-700 font-medium"
                }`}
              >
                Any rating
                {filters.minRating === 0 && (
                  <Check size={11} className="text-blue-600" />
                )}
              </button>
              {RATING_OPTIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    onFiltersChange({ minRating: r });
                    setRatingOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors hover:bg-blue-50 ${
                    filters.minRating === r
                      ? "text-blue-600 font-bold"
                      : "text-gray-700 font-medium"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Star size={10} fill="#f59e0b" color="#f59e0b" />
                    {r}+
                  </span>
                  {filters.minRating === r && (
                    <Check size={11} className="text-blue-600" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Open now toggle */}
      <button
        type="button"
        onClick={() => onFiltersChange({ openNow: !filters.openNow })}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold flex-shrink-0 transition-all ${
          filters.openNow
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            filters.openNow ? "bg-emerald-500" : "bg-gray-300"
          }`}
        />
        Open now
      </button>

      {/* More filters */}
      <button
        type="button"
        onClick={onFiltersOpen}
        className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:border-blue-300 flex-shrink-0 transition-colors"
      >
        More filters
        <ChevronDown size={11} className="text-gray-400" />
      </button>
    </div>
  );
}
