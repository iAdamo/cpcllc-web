"use client";

import { motion } from "framer-motion";
import {
  Star,
  Shield,
  Award,
  Clock,
  Zap,
  RotateCcw,
} from "lucide-react";
import { Category, Subcategory } from "@/types";

export interface Filters {
  minRating: number;
  openNow: boolean;
  verifiedOnly: boolean;
  topRated: boolean;
  newOnly: boolean;
  radius: string;
}

interface FilterSidebarProps {
  filters: Filters;
  onChange: (filters: Partial<Filters>) => void;
  onReset: () => void;
  resultCount: number;
  categories: Category[];
  selectedSubcategoryIds: string[];
  onToggleSubcategory: (sub: Subcategory) => void;
}

const ratingOptions = [
  { value: 0, label: "Any rating" },
  { value: 3, label: "3+ stars" },
  { value: 4, label: "4+ stars" },
  { value: 4.5, label: "4.5+ stars" },
];

const radiusOptions = [
  { value: "5", label: "5 km" },
  { value: "15", label: "15 km" },
  { value: "30", label: "30 km" },
  { value: "50", label: "50 km" },
  { value: "100", label: "100 km" },
];

const ToggleRow = ({
  label,
  description,
  icon: Icon,
  value,
  onChange,
  color = "blue",
}: {
  label: string;
  description?: string;
  icon: React.ElementType;
  value: boolean;
  onChange: (v: boolean) => void;
  color?: string;
}) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
    <div className="flex items-center gap-2.5">
      <div className={`w-7 h-7 bg-${color}-50 rounded-lg flex items-center justify-center flex-shrink-0`}>
        <Icon size={14} className={`text-${color}-500`} />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {description && (
          <p className="text-[11px] text-gray-400">{description}</p>
        )}
      </div>
    </div>
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 ${
        value ? "bg-blue-600" : "bg-gray-200"
      }`}
      aria-label={label}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          value ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  </div>
);

export default function FilterSidebar({
  filters,
  onChange,
  onReset,
  resultCount,
  categories,
  selectedSubcategoryIds,
  onToggleSubcategory,
}: FilterSidebarProps) {
  const hasActiveFilters =
    filters.minRating > 0 ||
    filters.openNow ||
    filters.verifiedOnly ||
    filters.topRated ||
    filters.newOnly ||
    selectedSubcategoryIds.length > 0;

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto pr-1 scrollbar-none">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h3 className="font-black text-gray-900 text-sm">Filters</h3>
              <p className="text-[11px] text-gray-400">
                {resultCount} results
              </p>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                <RotateCcw size={12} />
                Reset
              </button>
            )}
          </div>

          <div className="p-5 space-y-6">
            {/* Rating */}
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.12em] mb-3">
                Minimum Rating
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {ratingOptions.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onChange({ minRating: value })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border text-center ${
                      filters.minRating === value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-50 text-gray-600 border-gray-100 hover:border-blue-200"
                    }`}
                  >
                    {value > 0 && <Star size={10} className="inline mr-1" fill="currentColor" />}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick filters */}
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.12em] mb-2">
                Quick Filters
              </p>
              <div className="space-y-1">
                <ToggleRow
                  label="Open Now"
                  icon={Clock}
                  value={filters.openNow}
                  onChange={(v) => onChange({ openNow: v })}
                  color="green"
                />
                <ToggleRow
                  label="Verified Only"
                  description="Background checked & licensed"
                  icon={Shield}
                  value={filters.verifiedOnly}
                  onChange={(v) => onChange({ verifiedOnly: v })}
                  color="blue"
                />
                <ToggleRow
                  label="Top Rated"
                  description="4.8+ rating"
                  icon={Award}
                  value={filters.topRated}
                  onChange={(v) => onChange({ topRated: v })}
                  color="amber"
                />
                <ToggleRow
                  label="New Providers"
                  description="Joined in last 90 days"
                  icon={Zap}
                  value={filters.newOnly}
                  onChange={(v) => onChange({ newOnly: v })}
                  color="violet"
                />
              </div>
            </div>

            {/* Distance */}
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.12em] mb-3">
                Search Radius
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {radiusOptions.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onChange({ radius: value })}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all border text-center ${
                      filters.radius === value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-50 text-gray-600 border-gray-100 hover:border-blue-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.12em] mb-3">
                Categories
              </p>
              <div className="space-y-2">
                {categories.slice(0, 8).map((cat) => (
                  <div key={cat._id}>
                    <p className="text-xs font-bold text-gray-700 mb-1.5">
                      {cat.name}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {cat.subcategories.slice(0, 5).map((sub) => {
                        const selected = selectedSubcategoryIds.includes(sub._id);
                        return (
                          <button
                            key={sub._id}
                            type="button"
                            onClick={() => onToggleSubcategory(sub)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border ${
                              selected
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-gray-50 text-gray-500 border-gray-100 hover:border-blue-200 hover:text-blue-600"
                            }`}
                          >
                            {sub.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Provider CTA */}
          <div className="mx-5 mb-5 p-4 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl">
            <p className="font-black text-white text-sm mb-1">
              Are you a provider?
            </p>
            <p className="text-white/70 text-xs mb-3 leading-relaxed">
              Join thousands of businesses growing with us.
            </p>
            <a
              href="/onboarding"
              className="block text-center py-2 bg-white text-blue-600 font-black text-xs rounded-xl hover:bg-blue-50 transition-colors"
            >
              Join Now →
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
