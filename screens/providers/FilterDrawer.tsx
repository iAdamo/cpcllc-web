"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Shield, Award, Clock, Zap, RotateCcw } from "lucide-react";
import { Filters } from "./FilterSidebar";
import { Category, Subcategory } from "@/types";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  onChange: (filters: Partial<Filters>) => void;
  onReset: () => void;
  categories: Category[];
  selectedSubcategoryIds: string[];
  onToggleSubcategory: (sub: Subcategory) => void;
  resultCount: number;
}

const ratingOptions = [
  { value: 0, label: "Any" },
  { value: 3, label: "3+" },
  { value: 4, label: "4+" },
  { value: 4.5, label: "4.5+" },
];

export default function FilterDrawer({
  open,
  onClose,
  filters,
  onChange,
  onReset,
  categories,
  selectedSubcategoryIds,
  onToggleSubcategory,
  resultCount,
}: FilterDrawerProps) {
  const quickFilters = [
    {
      key: "openNow" as keyof Filters,
      label: "Open Now",
      Icon: Clock,
      color: "green",
    },
    {
      key: "verifiedOnly" as keyof Filters,
      label: "Verified",
      Icon: Shield,
      color: "blue",
    },
    {
      key: "topRated" as keyof Filters,
      label: "Top Rated",
      Icon: Award,
      color: "amber",
    },
    {
      key: "newOnly" as keyof Filters,
      label: "New",
      Icon: Zap,
      color: "violet",
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <div>
                <h2 className="font-black text-gray-900">Filters</h2>
                <p className="text-xs text-gray-400">{resultCount} results</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onReset}
                  className="flex items-center gap-1 text-sm font-bold text-blue-600"
                >
                  <RotateCcw size={13} />
                  Reset
                </button>
                <button
                  title="Reset"
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
              {/* Quick filter pills */}
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.12em] mb-3">
                  Quick Filters
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickFilters.map(({ key, label, Icon }) => {
                    const active = filters[key] as boolean;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => onChange({ [key]: !active })}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                          active
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        <Icon size={14} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rating */}
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.12em] mb-3">
                  Minimum Rating
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {ratingOptions.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => onChange({ minRating: value })}
                      className={`py-3 rounded-xl text-sm font-semibold border transition-all text-center ${
                        filters.minRating === value
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-50 text-gray-600 border-gray-100"
                      }`}
                    >
                      {value > 0 ? (
                        <span className="flex items-center justify-center gap-0.5">
                          <Star size={11} fill="currentColor" />
                          {label}
                        </span>
                      ) : (
                        label
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.12em] mb-3">
                  Service Categories
                </p>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <div key={cat._id}>
                      <p className="text-xs font-bold text-gray-700 mb-2">
                        {cat.name}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.subcategories.map((sub) => {
                          const selected = selectedSubcategoryIds.includes(
                            sub._id
                          );
                          return (
                            <button
                              key={sub._id}
                              type="button"
                              onClick={() => onToggleSubcategory(sub)}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                selected
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-gray-50 text-gray-600 border-gray-100"
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

            {/* Footer */}
            <div className="p-5 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-base transition-colors"
              >
                Show {resultCount} Results
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
