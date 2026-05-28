"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpDown, ChevronDown, LayoutGrid, List, Check } from "lucide-react";

const SORT_OPTIONS = [
  { value: "Relevance", label: "Relevance" },
  { value: "Top Rated", label: "Top Rated" },
  { value: "Most Reviewed", label: "Most Reviewed" },
  { value: "Newest", label: "Newly Joined" },
  { value: "Location", label: "Nearest" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

interface SortBarProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
  resultCount: number;
  isLoading: boolean;
  listStyle: "list" | "grid";
  onListStyleChange: (style: "list" | "grid") => void;
  query?: string;
}

export default function SortBar({
  sortBy,
  onSortChange,
  resultCount,
  isLoading,
  listStyle,
  onListStyleChange,
  query,
}: SortBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Sort by";

  return (
    <div className="flex items-center justify-between py-3 px-1">
      {/* Result count */}
      <div className="flex items-center gap-2">
        {isLoading ? (
          <div className="h-4 w-32 bg-gray-200 rounded-full animate-pulse" />
        ) : (
          <p className="text-sm font-semibold text-gray-700">
            <span className="font-black text-gray-900">{resultCount}</span>{" "}
            {resultCount === 1 ? "provider" : "providers"}
            {query ? (
              <span className="text-gray-400">
                {" "}for <span className="text-blue-600 font-bold">&ldquo;{query}&rdquo;</span>
              </span>
            ) : null}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Layout toggle */}
        <div className="flex bg-gray-100 rounded-xl p-0.5">
          <button
            type="button"
            onClick={() => onListStyleChange("list")}
            className={`p-2 rounded-lg transition-all ${
              listStyle === "list"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
            aria-label="List view"
          >
            <List size={14} />
          </button>
          <button
            type="button"
            onClick={() => onListStyleChange("grid")}
            className={`p-2 rounded-lg transition-all ${
              listStyle === "grid"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid size={14} />
          </button>
        </div>

        {/* Sort dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-blue-300 transition-colors"
          >
            <ArrowUpDown size={13} className="text-gray-400" />
            <span>{activeLabel}</span>
            <ChevronDown
              size={13}
              className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-30 py-1"
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onSortChange(opt.value);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-blue-50 ${
                      sortBy === opt.value
                        ? "text-blue-600 font-bold bg-blue-50/60"
                        : "text-gray-700 font-medium"
                    }`}
                  >
                    {opt.label}
                    {sortBy === opt.value && (
                      <Check size={13} className="text-blue-600" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
