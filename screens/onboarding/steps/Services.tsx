"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useGlobalStore from "@/stores";
import { useCategories } from "@/hooks/useCategories";
import StepShell from "./StepShell";

const MAX = 3;

interface SelectedSub {
  _id: string;
  name: string;
  categoryId: string;
  categoryName: string;
}

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Services({ onNext, onBack }: Props) {
  const { onboardingData, updateOnboardingData } = useGlobalStore();
  const { data: categories = [], isLoading } = useCategories();

  const [selected, setSelected] = useState<SelectedSub[]>(
    onboardingData.subcategories ?? []
  );
  const [expandedCat, setExpandedCat] = useState<string | null>(
    categories[0]?._id ?? null
  );

  const toggle = (sub: { _id: string; name: string }, cat: { _id: string; name: string }) => {
    const exists = selected.some((s) => s._id === sub._id);
    if (exists) {
      setSelected((prev) => prev.filter((s) => s._id !== sub._id));
    } else if (selected.length < MAX) {
      setSelected((prev) => [
        ...prev,
        { _id: sub._id, name: sub.name, categoryId: cat._id, categoryName: cat.name },
      ]);
    }
  };

  const handleContinue = () => {
    updateOnboardingData({ subcategories: selected });
    onNext();
  };

  return (
    <StepShell
      step="2 of 4 · Services"
      title="What do you offer?"
      subtitle={`Pick up to ${MAX} services you specialise in.`}
      onNext={handleContinue}
      onBack={onBack}
      nextDisabled={selected.length === 0}
    >
      {/* Counter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 flex-wrap">
          {selected.map((s) => (
            <span
              key={s._id}
              className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full"
            >
              {s.name}
              <button
                type="button"
                onClick={() =>
                  setSelected((prev) => prev.filter((p) => p._id !== s._id))
                }
                className="hover:text-blue-900 transition-colors"
                aria-label={`Remove ${s.name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <span
          className={`text-xs font-bold tabular-nums shrink-0 ml-2 ${
            selected.length === MAX ? "text-amber-500" : "text-gray-400"
          }`}
        >
          {selected.length}/{MAX}
        </span>
      </div>

      {/* Category list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
          {categories.map((cat: any) => {
            const isOpen = expandedCat === cat._id;
            const activeSubs = selected.filter((s) => s.categoryId === cat._id);

            return (
              <div
                key={cat._id}
                className="border border-gray-100 rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedCat(isOpen ? null : cat._id)
                  }
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-800 text-sm">
                      {cat.name}
                    </span>
                    {activeSubs.length > 0 && (
                      <span className="w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                        {activeSubs.length}
                      </span>
                    )}
                  </div>
                  {isOpen ? (
                    <ChevronDown size={14} className="text-gray-400" />
                  ) : (
                    <ChevronRight size={14} className="text-gray-400" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-3 pt-2 flex flex-wrap gap-2">
                        {(cat.subcategories ?? []).map((sub: any) => {
                          const isActive = selected.some(
                            (s) => s._id === sub._id
                          );
                          const atMax =
                            selected.length >= MAX && !isActive;
                          return (
                            <button
                              key={sub._id}
                              type="button"
                              onClick={() => toggle(sub, cat)}
                              disabled={atMax}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                isActive
                                  ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                                  : atMax
                                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                                  : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-700"
                              }`}
                            >
                              {isActive && (
                                <Check size={10} strokeWidth={3} />
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
        </div>
      )}
    </StepShell>
  );
}
