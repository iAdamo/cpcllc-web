"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Category, Subcategory } from "@/types";

interface CategoryBarProps {
  categories: Category[];
  selectedSubcategoryIds: string[];
  onToggle: (sub: Subcategory) => void;
  onClear: () => void;
}

export default function CategoryBar({
  categories,
  selectedSubcategoryIds,
  onToggle,
  onClear,
}: CategoryBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };

  const activeCategory = categories.find((c) => c._id === activeCategoryId);

  return (
    <div className="border-b border-gray-100 bg-white">
      {/* Category row */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-3 relative">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center hidden md:flex border border-gray-100"
          aria-label="Scroll left"
        >
          <ChevronLeft size={15} className="text-gray-600" />
        </button>

        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-none md:px-6"
          style={{ scrollbarWidth: "none" }}
        >
          {/* All tab */}
          <button
            type="button"
            onClick={() => { setActiveCategoryId(null); onClear(); }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all border ${
              !activeCategoryId && selectedSubcategoryIds.length === 0
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            All
          </button>

          {categories.map((cat) => {
            const isActive = activeCategoryId === cat._id;
            const hasSelected = cat.subcategories.some((s) =>
              selectedSubcategoryIds.includes(s._id)
            );

            return (
              <button
                key={cat._id}
                type="button"
                onClick={() =>
                  setActiveCategoryId(isActive ? null : cat._id)
                }
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all border whitespace-nowrap ${
                  isActive || hasSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {cat.name}
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    isActive || hasSelected
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {cat.subcategories.length}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-md rounded-full items-center justify-center hidden md:flex border border-gray-100"
          aria-label="Scroll right"
        >
          <ChevronRight size={15} className="text-gray-600" />
        </button>
      </div>

      {/* Subcategory row */}
      {activeCategory && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="border-t border-gray-50 bg-gray-50/60 overflow-hidden"
        >
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {activeCategory.subcategories.map((sub) => {
              const selected = selectedSubcategoryIds.includes(sub._id);
              return (
                <button
                  key={sub._id}
                  type="button"
                  onClick={() => onToggle(sub)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    selected
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
