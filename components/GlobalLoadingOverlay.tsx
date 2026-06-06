"use client";

import { Loader2 } from "lucide-react";
import useGlobalStore from "@/stores";

export default function GlobalLoadingOverlay() {
  const isLoading = useGlobalStore((s) => s.isLoading);
  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/25 backdrop-blur-[2px]"
      style={{ pointerEvents: "all" }}
      aria-hidden="true"
    >
      <div className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-2xl px-5 py-4 shadow-2xl border border-gray-100 dark:border-gray-800">
        <Loader2 size={18} className="animate-spin text-blue-600 flex-shrink-0" />
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 select-none">
          Please wait…
        </span>
      </div>
    </div>
  );
}
